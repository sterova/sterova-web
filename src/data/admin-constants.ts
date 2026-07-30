/**
 * Base path for the CMS. Deliberately unguessable-ish and never linked from the
 * public site, excluded from the sitemap, and served with noindex. Obscurity is
 * a convenience here — the real protection is Supabase auth plus RLS.
 */
export const ADMIN_BASE = "/sterova-admin";

export const ADMIN_ROUTES = {
  login: ADMIN_BASE,
  dashboard: `${ADMIN_BASE}/dashboard`,
  posts: `${ADMIN_BASE}/posts`,
  postNew: `${ADMIN_BASE}/posts/new`,
  postEdit: (id: string) => `${ADMIN_BASE}/posts/${id}`,
  categories: `${ADMIN_BASE}/categories`,
  reviews: `${ADMIN_BASE}/reviews`,
  projects: `${ADMIN_BASE}/projects`,
  results: `${ADMIN_BASE}/results`,
  team: `${ADMIN_BASE}/team`,
  messages: `${ADMIN_BASE}/messages`,
  sessions: `${ADMIN_BASE}/sessions`,
  brandLinks: `${ADMIN_BASE}/brand-links`,
} as const;

export const STORAGE_BUCKETS = {
  blog: "blog-media",
  project: "project-media",
  team: "team-media",
} as const;

/** Max upload size for images, in bytes. */
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
];
