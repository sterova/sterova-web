/**
 * Seeds the CMS tables from the existing static content files so the live site
 * keeps every post and project it had before the migration.
 *
 * Idempotent: re-running will not duplicate rows (upsert on slug / name).
 *
 * Usage:
 *   node --env-file-if-exists=/vercel/share/.env.project scripts/seed.ts
 */
import pg from "pg";
import { BLOG_POSTS } from "../src/data/blog.ts";
import { BLOG_CATEGORIES, PORTFOLIO_ITEMS } from "../src/data/constants.ts";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const connectionString =
  process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL;
if (!connectionString) {
  console.error("Missing POSTGRES_URL_NON_POOLING / POSTGRES_URL");
  process.exit(1);
}

const url = new URL(connectionString);
url.searchParams.delete("sslmode");
url.searchParams.delete("ssl");

const client = new pg.Client({
  connectionString: url.toString(),
  ssl: { rejectUnauthorized: false },
});

await client.connect();

try {
  await client.query("begin");

  // ── Categories ───────────────────────────────────────────────────────────
  // "All" is a UI filter pseudo-category, not real data.
  const realCategories = BLOG_CATEGORIES.filter((c) => c !== "All");
  const categoryIds = new Map<string, string>();

  for (const [index, name] of realCategories.entries()) {
    const { rows } = await client.query<{ id: string }>(
      `insert into public.blog_categories (name, slug, display_order)
       values ($1, $2, $3)
       on conflict (name) do update set display_order = excluded.display_order
       returning id`,
      [name, slugify(name), index],
    );
    categoryIds.set(name, rows[0].id);
  }
  console.log(`Seeded ${realCategories.length} blog categories`);

  // ── Blog posts ───────────────────────────────────────────────────────────
  for (const post of BLOG_POSTS) {
    await client.query(
      `insert into public.blog_posts
         (title, slug, excerpt, content, cover_image_url, category_id, tags,
          author_name, author_avatar_url, published, published_at,
          read_time_minutes, views)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
       on conflict (slug) do update set
         title             = excluded.title,
         excerpt           = excluded.excerpt,
         content           = excluded.content,
         cover_image_url   = excluded.cover_image_url,
         category_id       = excluded.category_id,
         tags              = excluded.tags,
         author_name       = excluded.author_name,
         published         = excluded.published,
         published_at      = excluded.published_at,
         read_time_minutes = excluded.read_time_minutes`,
      [
        post.title,
        post.slug,
        post.excerpt,
        post.content,
        post.cover_image_url,
        categoryIds.get(post.category) ?? null,
        post.tags,
        post.author_name,
        post.author_avatar_url,
        post.published,
        post.published_at,
        post.read_time_minutes,
        post.views,
      ],
    );
  }
  console.log(`Seeded ${BLOG_POSTS.length} blog posts`);

  // ── Projects ─────────────────────────────────────────────────────────────
  for (const item of PORTFOLIO_ITEMS) {
    await client.query(
      `insert into public.projects
         (title, slug, category, description, tags, image_url, live_url,
          github_url, is_featured, is_active, display_order)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       on conflict (slug) do update set
         title         = excluded.title,
         category      = excluded.category,
         description   = excluded.description,
         tags          = excluded.tags,
         image_url     = excluded.image_url,
         live_url      = excluded.live_url,
         github_url    = excluded.github_url,
         is_featured   = excluded.is_featured,
         is_active     = excluded.is_active,
         display_order = excluded.display_order`,
      [
        item.title,
        item.slug,
        item.category,
        item.description,
        item.tags,
        item.image_url,
        item.live_url,
        item.github_url,
        item.is_featured,
        item.is_active,
        item.display_order,
      ],
    );
  }
  console.log(`Seeded ${PORTFOLIO_ITEMS.length} projects`);

  await client.query("commit");
  console.log("Seed complete");
} catch (err) {
  await client.query("rollback");
  console.error("Seed failed:", (err as Error).message);
  process.exitCode = 1;
} finally {
  await client.end();
}
