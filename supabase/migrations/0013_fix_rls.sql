-- 0013_fix_rls.sql

-- Drop the old overly-broad policies
DROP POLICY IF EXISTS "Public read access for services" ON public.services;
DROP POLICY IF EXISTS "Public read access for case_studies" ON public.case_studies;
DROP POLICY IF EXISTS "Public read access for industries" ON public.industries;
DROP POLICY IF EXISTS "Public read access for project_industries" ON public.project_industries;
DROP POLICY IF EXISTS "Public read access for faqs" ON public.faqs;
DROP POLICY IF EXISTS "Public read access for media_assets" ON public.media_assets;
DROP POLICY IF EXISTS "Public read access for seo_metadata" ON public.seo_metadata;

DROP POLICY IF EXISTS "Admin full access for services" ON public.services;
DROP POLICY IF EXISTS "Admin full access for case_studies" ON public.case_studies;
DROP POLICY IF EXISTS "Admin full access for industries" ON public.industries;
DROP POLICY IF EXISTS "Admin full access for project_industries" ON public.project_industries;
DROP POLICY IF EXISTS "Admin full access for faqs" ON public.faqs;
DROP POLICY IF EXISTS "Admin full access for media_assets" ON public.media_assets;
DROP POLICY IF EXISTS "Admin full access for seo_metadata" ON public.seo_metadata;


-- Generate proper explicit policies for each table

-- 1. Services
CREATE POLICY "public reads active services" ON public.services FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "admins read all services" ON public.services FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "admins insert services" ON public.services FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "admins update services" ON public.services FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "admins delete services" ON public.services FOR DELETE TO authenticated USING (public.is_admin());

-- 2. Case Studies
CREATE POLICY "public reads active case_studies" ON public.case_studies FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "admins read all case_studies" ON public.case_studies FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "admins insert case_studies" ON public.case_studies FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "admins update case_studies" ON public.case_studies FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "admins delete case_studies" ON public.case_studies FOR DELETE TO authenticated USING (public.is_admin());

-- 3. Industries
CREATE POLICY "public reads active industries" ON public.industries FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "admins read all industries" ON public.industries FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "admins insert industries" ON public.industries FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "admins update industries" ON public.industries FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "admins delete industries" ON public.industries FOR DELETE TO authenticated USING (public.is_admin());

-- 4. Project Industries
CREATE POLICY "public reads project_industries" ON public.project_industries FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admins read all project_industries" ON public.project_industries FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "admins insert project_industries" ON public.project_industries FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "admins update project_industries" ON public.project_industries FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "admins delete project_industries" ON public.project_industries FOR DELETE TO authenticated USING (public.is_admin());

-- 5. FAQs
CREATE POLICY "public reads active faqs" ON public.faqs FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "admins read all faqs" ON public.faqs FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "admins insert faqs" ON public.faqs FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "admins update faqs" ON public.faqs FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "admins delete faqs" ON public.faqs FOR DELETE TO authenticated USING (public.is_admin());

-- 6. Media Assets
CREATE POLICY "public reads media_assets" ON public.media_assets FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admins read all media_assets" ON public.media_assets FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "admins insert media_assets" ON public.media_assets FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "admins update media_assets" ON public.media_assets FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "admins delete media_assets" ON public.media_assets FOR DELETE TO authenticated USING (public.is_admin());

-- 7. SEO Metadata
CREATE POLICY "public reads seo_metadata" ON public.seo_metadata FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admins read all seo_metadata" ON public.seo_metadata FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "admins insert seo_metadata" ON public.seo_metadata FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "admins update seo_metadata" ON public.seo_metadata FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "admins delete seo_metadata" ON public.seo_metadata FOR DELETE TO authenticated USING (public.is_admin());
