# Sterova — Supabase Setup

## Running Migrations

Open your Supabase project's SQL editor and run the files in `/supabase/migrations/` in order:

1. `001_initial_schema.sql` — Creates all tables, RLS policies, indexes, and triggers

## Tables

| Table | Description |
|-------|-------------|
| `contact_messages` | Contact form submissions from the website |
| `newsletter_subscribers` | Email newsletter sign-ups |
| `job_applications` | Career page applications |
| `blog_categories` | Blog category taxonomy (seeded) |
| `blog_posts` | Published and draft blog articles |
| `admins` | Admin users linked to Supabase Auth |
| `audit_logs` | Admin action audit trail |

## Row Level Security

All tables have RLS enabled:

- **Public tables** (`blog_categories`, `blog_posts`): Read access for published content only
- **Private tables** (`contact_messages`, `newsletter_subscribers`, `job_applications`, `admins`, `audit_logs`): Service role access only — never exposed to the browser

## Environment Variables

Set these in Replit Secrets and in Vercel (Production only):

```
NEXT_PUBLIC_SUPABASE_URL     = https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJ...
SUPABASE_SERVICE_ROLE_KEY    = eyJ...  ← server-side only, never in the browser
```

## Storage Buckets

The following storage buckets should be configured in your Supabase project:

| Bucket | Visibility | Purpose |
|--------|-----------|---------|
| `website-assets` | Public | Logos, icons, general assets |
| `portfolio-images` | Public | Portfolio/case study images |
| `team` | Public | Team member photos |
| `blog` | Public | Blog cover images |
| `documents` | Private | Internal documents |
| `uploads` | Private | User/client uploads |

For public buckets, ensure the storage policy allows anonymous reads.
For private buckets, use signed URLs via the service role client.
