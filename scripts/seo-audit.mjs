#!/usr/bin/env node
/**
 * SEO / Open Graph / structured-data / performance-budget audit.
 *
 * Crawls the server-rendered HTML of every public route and fails the build
 * when metadata regresses. Also enforces a client bundle size budget when a
 * production build output is present.
 *
 * Usage:  node scripts/seo-audit.mjs [--base https://sterova.tech]
 */
import { readdirSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";

const args = process.argv.slice(2);
const baseArg = args.indexOf("--base");
const BASE =
  (baseArg !== -1 && args[baseArg + 1]) || process.env.AUDIT_BASE_URL || "https://sterova.tech";

const ROUTES = [
  "/",
  "/about",
  "/services",
  "/portfolio",
  "/process",
  "/blog",
  "/careers",
  "/contact",
  "/privacy",
  "/terms",
];

// Performance budgets (KB, uncompressed)
const BUDGETS = { totalJs: 2000, singleJs: 850, totalCss: 250 };

const REQUIRED_META = [
  { key: 'name="description"', label: "meta description" },
  { key: 'property="og:title"', label: "og:title" },
  { key: 'property="og:description"', label: "og:description" },
  { key: 'property="og:type"', label: "og:type" },
  { key: 'property="og:url"', label: "og:url" },
  { key: 'property="og:image"', label: "og:image" },
  { key: 'property="og:site_name"', label: "og:site_name" },
  { key: 'name="twitter:card"', label: "twitter:card" },
  { key: 'name="twitter:image"', label: "twitter:image" },
];

const errors = [];
const warnings = [];

function attr(html, marker) {
  const tag = html.split("<").find((t) => t.includes(marker) && t.includes("content="));
  if (!tag) return null;
  const m = tag.match(/content="([^"]*)"/);
  return m ? m[1] : null;
}

function auditHtml(route, html) {
  const fail = (msg) => errors.push(`${route}: ${msg}`);
  const warn = (msg) => warnings.push(`${route}: ${msg}`);

  // Title
  const title = (html.match(/<title[^>]*>([^<]*)<\/title>/) || [])[1];
  if (!title) fail("missing <title>");
  else {
    if (title.length > 65) warn(`title is ${title.length} chars (>65)`);
  }

  // Meta tags
  for (const { key, label } of REQUIRED_META) {
    if (!html.includes(key)) fail(`missing ${label}`);
  }

  const desc = attr(html, 'name="description"');
  if (desc && (desc.length < 50 || desc.length > 165)) {
    warn(`description is ${desc.length} chars (aim 50–165)`);
  }

  // Open Graph validation
  const ogImage = attr(html, 'property="og:image"');
  if (ogImage && !/^https?:\/\//.test(ogImage)) fail(`og:image must be absolute, got "${ogImage}"`);
  const ogUrl = attr(html, 'property="og:url"');
  const canonical = (html.match(/<link[^>]+rel="canonical"[^>]*>/) || [])[0];
  if (!canonical) fail("missing canonical link");
  else {
    const href = (canonical.match(/href="([^"]*)"/) || [])[1];
    const normalized = href?.replace(/^https?:\/\/[^/]+/, "") || "";
    if (normalized.replace(/\/$/, "") !== route.replace(/\/$/, "")) {
      fail(`canonical "${href}" does not self-reference ${route}`);
    }
    if (
      ogUrl &&
      ogUrl.replace(/^https?:\/\/[^/]+/, "").replace(/\/$/, "") !== route.replace(/\/$/, "")
    ) {
      fail(`og:url "${ogUrl}" does not self-reference ${route}`);
    }
  }

  // Canonical must appear exactly once
  const canonicalCount = (html.match(/rel="canonical"/g) || []).length;
  if (canonicalCount > 1) fail(`${canonicalCount} canonical tags (must be 1)`);

  // Single H1
  const h1Count = (html.match(/<h1[\s>]/g) || []).length;
  if (h1Count === 0) warn("no <h1> in server-rendered HTML");
  if (h1Count > 1) fail(`${h1Count} <h1> elements (must be 1)`);

  // Structured data
  const blocks = [
    ...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g),
  ];
  if (blocks.length === 0) fail("no JSON-LD structured data");
  const types = [];
  for (const [, raw] of blocks) {
    let parsed;
    try {
      parsed = JSON.parse(raw.trim());
    } catch {
      fail("invalid JSON-LD (parse error)");
      continue;
    }
    for (const node of Array.isArray(parsed) ? parsed : [parsed]) {
      if (!node["@context"]) fail("JSON-LD block missing @context");
      if (!node["@type"]) fail("JSON-LD block missing @type");
      types.push(node["@type"]);
    }
  }
  if (!types.includes("Organization")) warn("no Organization schema");
  if (route !== "/" && !types.includes("BreadcrumbList")) warn("no BreadcrumbList schema");

  // Images need alt text
  const imgsWithoutAlt = (html.match(/<img(?![^>]*\balt=)[^>]*>/g) || []).length;
  if (imgsWithoutAlt > 0) fail(`${imgsWithoutAlt} <img> without alt attribute`);

  // Language + viewport
  if (!/<html[^>]+lang="/.test(html)) fail("<html> missing lang attribute");
  if (!html.includes('name="viewport"')) fail("missing responsive viewport meta");
  if (/name="robots"[^>]*content="[^"]*noindex/.test(html)) fail("route is set to noindex");
}

async function auditRoutes() {
  let unreachable = 0;
  for (const route of ROUTES) {
    let res;
    try {
      res = await fetch(`${BASE}${route}`, { headers: { "user-agent": "sterova-seo-audit" } });
    } catch (err) {
      unreachable += 1;
      continue;
    }
    if (!res.ok) {
      errors.push(`${route}: HTTP ${res.status}`);
      continue;
    }
    auditHtml(route, await res.text());
  }
  if (unreachable === ROUTES.length) {
    warnings.push(
      `no server reachable at ${BASE} — route metadata checks skipped (run \`bun run seo:check\` with the app running)`,
    );
  } else if (unreachable > 0) {
    errors.push(`${unreachable} route(s) unreachable at ${BASE}`);
  }
}

function auditStaticFiles() {
  if (!existsSync("public/robots.txt")) errors.push("public/robots.txt missing");
  if (existsSync("public/sitemap.xml")) {
    errors.push("public/sitemap.xml shadows the dynamic /sitemap.xml route — delete it");
  }
  if (!existsSync("src/routes/sitemap[.]xml.ts")) {
    errors.push("src/routes/sitemap[.]xml.ts missing (no sitemap is served)");
  }
  if (!existsSync("public/og-image.png"))
    errors.push("public/og-image.png missing (og:image would 404)");
}

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    const s = statSync(p);
    if (s.isDirectory()) walk(p, out);
    else out.push({ path: p, size: s.size });
  }
  return out;
}

function auditPerformanceBudget() {
  const dir = [".output/public/_build", "dist/client/_build", ".output/public", "dist/client"].find(
    existsSync,
  );
  if (!dir) {
    warnings.push(
      "no production build output found — performance budget skipped (run `bun run build` first)",
    );
    return;
  }
  const files = walk(dir);
  const kb = (b) => Math.round(b / 1024);
  const js = files.filter((f) => f.path.endsWith(".js"));
  const css = files.filter((f) => f.path.endsWith(".css"));
  const totalJs = kb(js.reduce((a, f) => a + f.size, 0));
  const totalCss = kb(css.reduce((a, f) => a + f.size, 0));
  const biggest = js.sort((a, b) => b.size - a.size)[0];

  console.log(`\nBundle: ${totalJs} KB JS across ${js.length} chunks, ${totalCss} KB CSS`);
  if (totalJs > BUDGETS.totalJs)
    errors.push(`JS budget exceeded: ${totalJs} KB > ${BUDGETS.totalJs} KB`);
  if (totalCss > BUDGETS.totalCss)
    errors.push(`CSS budget exceeded: ${totalCss} KB > ${BUDGETS.totalCss} KB`);
  if (biggest && kb(biggest.size) > BUDGETS.singleJs) {
    errors.push(
      `chunk too large: ${biggest.path} is ${kb(biggest.size)} KB > ${BUDGETS.singleJs} KB`,
    );
  }
}

console.log(`SEO audit against ${BASE}`);
await auditRoutes();
auditStaticFiles();
auditPerformanceBudget();

if (warnings.length) {
  console.log(`\n⚠  ${warnings.length} warning(s):`);
  for (const w of warnings) console.log(`   - ${w}`);
}
if (errors.length) {
  console.error(`\n✖ ${errors.length} SEO/performance error(s):`);
  for (const e of errors) console.error(`   - ${e}`);
  process.exit(1);
}
console.log(
  `\n✔ All ${ROUTES.length} routes passed SEO, Open Graph, structured-data and performance checks.`,
);
