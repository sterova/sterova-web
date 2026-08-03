-- 0014_grants_and_cache.sql

-- Explicitly grant permissions to anon and authenticated roles
-- (Sometimes Supabase default privileges don't apply automatically to new tables)
GRANT SELECT, INSERT, UPDATE, DELETE ON public.services TO authenticated;
GRANT SELECT ON public.services TO anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.case_studies TO authenticated;
GRANT SELECT ON public.case_studies TO anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.industries TO authenticated;
GRANT SELECT ON public.industries TO anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.project_industries TO authenticated;
GRANT SELECT ON public.project_industries TO anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.faqs TO authenticated;
GRANT SELECT ON public.faqs TO anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.media_assets TO authenticated;
GRANT SELECT ON public.media_assets TO anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.seo_metadata TO authenticated;
GRANT SELECT ON public.seo_metadata TO anon;

-- Force PostgREST to reload its schema cache
NOTIFY pgrst, 'reload schema';
