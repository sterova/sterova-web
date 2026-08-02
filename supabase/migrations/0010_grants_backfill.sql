-- ============================================================================
-- 0010_grants_backfill.sql — Data API grants backfill
-- The 0001/0002 tables were created without explicit GRANTs. PostgREST needs
-- table privileges in addition to RLS policies, so mirror each table's policies
-- here. Safe to run repeatedly.
-- Run this in the Supabase SQL editor.
-- ============================================================================

-- admin_users: admins read; writes stay service-side.
grant select on public.admin_users to authenticated;
grant all on public.admin_users to service_role;

-- contact_messages: anonymous submissions, admin read/update/delete.
grant insert on public.contact_messages to anon;
grant select, insert, update, delete on public.contact_messages to authenticated;
grant all on public.contact_messages to service_role;

-- reviews: anonymous submit + read approved, admin moderation.
grant select, insert on public.reviews to anon;
grant select, insert, update, delete on public.reviews to authenticated;
grant all on public.reviews to service_role;

-- projects: public reads active rows, admin manages all.
grant select on public.projects to anon;
grant select, insert, update, delete on public.projects to authenticated;
grant all on public.projects to service_role;

-- blog_categories: public reads, admin manages.
grant select on public.blog_categories to anon;
grant select, insert, update, delete on public.blog_categories to authenticated;
grant all on public.blog_categories to service_role;

-- blog_posts: public reads published rows, admin manages. Anon deliberately has
-- no UPDATE grant — view counting goes through increment_post_views().
grant select on public.blog_posts to anon;
grant select, insert, update, delete on public.blog_posts to authenticated;
grant all on public.blog_posts to service_role;

-- admin_sessions: CMS session state.
grant select, insert, update, delete on public.admin_sessions to authenticated;
grant all on public.admin_sessions to service_role;
