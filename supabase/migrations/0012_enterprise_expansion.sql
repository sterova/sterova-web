-- 0012_enterprise_expansion.sql

-- 1. Services
CREATE TABLE public.services (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    overview TEXT NOT NULL,
    benefits TEXT[] DEFAULT '{}',
    process TEXT[] DEFAULT '{}',
    pricing_approach TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Case Studies
CREATE TABLE public.case_studies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    client_name TEXT NOT NULL,
    problem TEXT NOT NULL,
    research TEXT NOT NULL,
    design TEXT NOT NULL,
    development TEXT NOT NULL,
    deployment TEXT NOT NULL,
    results TEXT NOT NULL,
    cover_image TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Industries
CREATE TABLE public.industries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    icon_key TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Project Industries (Many-to-Many)
CREATE TABLE public.project_industries (
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    industry_id UUID REFERENCES public.industries(id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, industry_id)
);

-- 5. FAQs
CREATE TABLE public.faqs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category TEXT DEFAULT 'general',
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Media Assets
CREATE TABLE public.media_assets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    file_name TEXT NOT NULL,
    file_type TEXT NOT NULL,
    url TEXT NOT NULL,
    alt_text TEXT,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. SEO Metadata
CREATE TABLE public.seo_metadata (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    route_path TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    keywords TEXT[] DEFAULT '{}',
    og_image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Triggers for updated_at
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.services
    FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.case_studies
    FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.industries
    FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.faqs
    FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.seo_metadata
    FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

-- RLS Policies
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_studies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.industries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_industries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_metadata ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read access for services" ON public.services FOR SELECT USING (is_active = true);
CREATE POLICY "Public read access for case_studies" ON public.case_studies FOR SELECT USING (is_active = true);
CREATE POLICY "Public read access for industries" ON public.industries FOR SELECT USING (is_active = true);
CREATE POLICY "Public read access for project_industries" ON public.project_industries FOR SELECT USING (true);
CREATE POLICY "Public read access for faqs" ON public.faqs FOR SELECT USING (is_active = true);
CREATE POLICY "Public read access for media_assets" ON public.media_assets FOR SELECT USING (true);
CREATE POLICY "Public read access for seo_metadata" ON public.seo_metadata FOR SELECT USING (true);

-- Admin full access
CREATE POLICY "Admin full access for services" ON public.services FOR ALL USING (is_admin());
CREATE POLICY "Admin full access for case_studies" ON public.case_studies FOR ALL USING (is_admin());
CREATE POLICY "Admin full access for industries" ON public.industries FOR ALL USING (is_admin());
CREATE POLICY "Admin full access for project_industries" ON public.project_industries FOR ALL USING (is_admin());
CREATE POLICY "Admin full access for faqs" ON public.faqs FOR ALL USING (is_admin());
CREATE POLICY "Admin full access for media_assets" ON public.media_assets FOR ALL USING (is_admin());
CREATE POLICY "Admin full access for seo_metadata" ON public.seo_metadata FOR ALL USING (is_admin());
