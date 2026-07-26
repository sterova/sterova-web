---
name: DB migration split
description: Which tables are in which migration file and what order to run them
---

## Migration order (must run in order)

1. `supabase/migrations/001_initial_schema.sql` — contact_messages, newsletter_subscribers, job_applications, `set_updated_at()` trigger function
2. `supabase/migrations/002_content_schema.sql` — reviews, services, portfolio_items, testimonials, faqs, site_settings, navigation_items + seed data
3. `supabase/migrations/003_admin_blog_schema.sql` — admins, audit_logs, blog_posts

**Why split:** The initial schema predates the DB-driven content system. Keeping them separate makes rollback safer and lets the user apply incrementally.

**How to apply:**
- All migrations are idempotent (`CREATE TABLE IF NOT EXISTS`, `ON CONFLICT DO NOTHING`).
- Run via Supabase Dashboard → SQL Editor, or `supabase db push` from CLI.
- After running migrations, visit `/admin/setup` to create the first admin account.
- The `service_role` RLS policy on admins/audit_logs means anon clients can never read them.
