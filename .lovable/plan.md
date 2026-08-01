# Sterova SEO Remediation — Round 2

Important context first: the audit was run against the **live Vercel deployment**, which predates last round's work. Verified against the current source, these audit items are **already fixed in code and will clear on the next deploy**: hreflang (`en` + `x-default` in `seo()`), LocalBusiness/ProfessionalService schema, unified Organization/WebSite entity graph with `@id`, phone in constants, title length (`Sterova — Custom Software & Web App Development Agency`, 54 chars), custom 404 (`src/routes/$.tsx` + `NotFoundPage`), sitemap with real `lastmod` from post dates.

So this plan covers what is genuinely still broken. No new dependencies, no stack changes.

## Critical

**1. Placeholder junk in the root head.** `src/routes/__root.tsx` currently emits a second `{ title: "Sterova" }`, a second `description`/`og:description`/`twitter:description` reading *"Project Insight Engine analyzes your project's structure…"*, and an `og:image`/`twitter:image` pointing at a Lovable preview screenshot on `pub-...r2.dev`. These are duplicate, wrong, and leak a preview URL into social previews. Fix: strip all of it; root keeps only `charSet`, `viewport`, `og:site_name`, `og:type`, `theme-color`, `author`, and a default title/description — per-route `seo()` owns everything else. Also remove `og:image`/`twitter:image` from root so the per-route `/og-image.png` wins.

## High

**2. Mobile FCP 4.9s / LCP 5.9s.** Two verified causes in `__root.tsx`: the Google Fonts stylesheet is a render-blocking third-party request pulling 4 font files / 103 KB, and 68 JS requests ship on first load.
- Trim the font request to the weights actually used, and add `<link rel="preload" as="style">` + `media="print" onload` swap so it stops blocking first paint.
- Add `rel="preload" as="image" fetchpriority="high"` for `/logo.png` (the hero LCP element) in the index route's `head().links`.
- Audit which lazy root components (`RoutePrefetcher`, `RouteFocus`, `WhatsAppButton`, `Toaster`) actually need to mount before first paint; defer the rest behind an idle callback.

**3. Modern image formats + sizing.** `public/logo.png`, `logo-512.png` and `og-image.png` are the only raster assets and are served as PNG at full size everywhere. Generate WebP siblings and serve via `<picture>` in `Navbar`, `Footer` and `HeroSection`, with explicit `width`/`height` to lock aspect ratio.

**4. DOM size 1,963 nodes / 50 headings.** The homepage stacks 39 H3s against 9 H2s — the tech-stack chips in `TechStackSection` are marked up as headings. Demote them to `<li>`/`<span>`, which fixes both the outline and part of the node count. Also collapse the decorative node/particle divs in `HeroSection` that render dozens of empty elements.

## Medium

**5. Analytics missing.** No tracking on the page. I'll add a single `gtag.js` snippet in `__root.tsx` `head().scripts` plus a route-change `page_view` — no npm package. **Needs your GA4 measurement ID** (or say Plausible/Umami/skip).

**6. Keyword distribution in headings.** Terms driving the page (`custom software`, `web app development`, `react`, `typescript`) appear in body copy but not in H2s. Rework the homepage and services H2s so primary terms sit in headings.

**7. Plaintext email addresses.** `hello@sterova.tech` renders as literal text in Footer, CTASection, Privacy, Terms and Careers. Swap the visible text for an obfuscated render (assembled client-side) while keeping the `mailto:` link working and accessible.

**8. Inline styles sweep.** Remaining `style={{...}}` in `TechStackSection` (brand colors), `HeroSection` (node positions, fill widths) and `AdminUI`. Move static values to Tailwind arbitrary classes / CSS custom properties; keep only genuinely dynamic ones.

## Low

**9. Unfriendly URL.** `/start-project?service=custom-software` — ensure that route's canonical strips the query param so parameter variants don't fragment signals.

**10. `ads.txt` content-type.** The scanner flags `/ads.txt` returning HTML. Add an empty `public/ads.txt` so it serves `text/plain`.

**11. Internal linking.** Add contextual in-body links between services ↔ portfolio ↔ process ↔ blog (currently nearly all 41 internal links are nav/footer chrome), and a `BreadcrumbList` render on deep routes to match the existing breadcrumb schema.

**12. Content freshness signal.** Add `og:updated_time` on blog posts and confirm sitemap `lastmod` reaches the deployed output.

## Off-code (you must do these)

- **Backlinks (0 referring domains)** — the single biggest ranking constraint. Outreach/content work, no code fix.
- **DMARC**: `v=DMARC1; p=none; rua=mailto:dmarc@sterova.tech`
- **Deploy** — most of the "already fixed" list above only clears once the current code is live on sterova.tech.
- Facebook / Instagram / YouTube profiles: only worth adding if you'll actually post.

## Order of execution

1. Root head cleanup (#1).
2. Font + LCP + JS deferral (#2), image formats (#3).
3. Heading hierarchy + DOM trim (#4, #6).
4. Analytics (#5, once you give the ID), email obfuscation (#7), inline styles (#8).
5. Canonical/ads.txt/internal linking/freshness (#9–#12).
