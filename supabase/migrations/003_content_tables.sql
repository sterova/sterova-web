-- =============================================================================
-- Content Tables — Run in Supabase SQL Editor after 002_reviews.sql
-- =============================================================================

-- ─────────────────────────────────────────────
-- Services
-- ─────────────────────────────────────────────
create table if not exists public.services (
  id              uuid primary key default uuid_generate_v4(),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  title           text not null check (char_length(title) <= 200),
  short_description text not null check (char_length(short_description) <= 500),
  description     text not null check (char_length(description) <= 3000),
  icon_name       text not null default 'Code2' check (char_length(icon_name) <= 50),
  features        text[] not null default '{}',
  technologies    text[] not null default '{}',
  display_order   integer not null default 0,
  is_active       boolean not null default true
);

alter table public.services enable row level security;
create policy "public_read_active_services"   on public.services for select using (is_active = true);
create policy "service_role_all_services"     on public.services using (auth.role() = 'service_role');
create index if not exists services_order_idx on public.services (display_order) where is_active = true;
create trigger services_updated_at before update on public.services for each row execute procedure public.set_updated_at();

-- ─────────────────────────────────────────────
-- Portfolio Items
-- ─────────────────────────────────────────────
create table if not exists public.portfolio_items (
  id            uuid primary key default uuid_generate_v4(),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  title         text not null check (char_length(title) <= 200),
  category      text not null check (char_length(category) <= 200),
  description   text not null check (char_length(description) <= 2000),
  tags          text[] not null default '{}',
  image_url     text check (char_length(image_url) <= 500),
  live_url      text check (char_length(live_url) <= 500),
  github_url    text check (char_length(github_url) <= 500),
  is_featured   boolean not null default false,
  is_active     boolean not null default true,
  display_order integer not null default 0
);

alter table public.portfolio_items enable row level security;
create policy "public_read_active_portfolio" on public.portfolio_items for select using (is_active = true);
create policy "service_role_all_portfolio"   on public.portfolio_items using (auth.role() = 'service_role');
create index if not exists portfolio_featured_idx on public.portfolio_items (is_featured, display_order) where is_active = true;
create trigger portfolio_items_updated_at before update on public.portfolio_items for each row execute procedure public.set_updated_at();

-- ─────────────────────────────────────────────
-- Testimonials
-- ─────────────────────────────────────────────
create table if not exists public.testimonials (
  id            uuid primary key default uuid_generate_v4(),
  created_at    timestamptz not null default now(),
  name          text not null check (char_length(name) <= 200),
  role          text not null check (char_length(role) <= 200),
  company       text check (char_length(company) <= 200),
  content       text not null check (char_length(content) between 10 and 2000),
  rating        integer not null default 5 check (rating between 1 and 5),
  avatar_url    text check (char_length(avatar_url) <= 500),
  is_active     boolean not null default true,
  display_order integer not null default 0
);

alter table public.testimonials enable row level security;
create policy "public_read_active_testimonials" on public.testimonials for select using (is_active = true);
create policy "service_role_all_testimonials"   on public.testimonials using (auth.role() = 'service_role');

-- ─────────────────────────────────────────────
-- FAQs
-- ─────────────────────────────────────────────
create table if not exists public.faqs (
  id            uuid primary key default uuid_generate_v4(),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  question      text not null check (char_length(question) <= 500),
  answer        text not null check (char_length(answer) <= 3000),
  category      text check (char_length(category) <= 100),
  display_order integer not null default 0,
  is_active     boolean not null default true
);

alter table public.faqs enable row level security;
create policy "public_read_active_faqs" on public.faqs for select using (is_active = true);
create policy "service_role_all_faqs"   on public.faqs using (auth.role() = 'service_role');
create index if not exists faqs_order_idx on public.faqs (display_order) where is_active = true;
create trigger faqs_updated_at before update on public.faqs for each row execute procedure public.set_updated_at();

-- ─────────────────────────────────────────────
-- Site Settings
-- ─────────────────────────────────────────────
create table if not exists public.site_settings (
  id          uuid primary key default uuid_generate_v4(),
  key         text not null unique check (char_length(key) <= 100),
  value       text not null default '',
  type        text not null default 'text' check (type in ('text', 'json', 'boolean', 'number', 'url', 'email')),
  description text check (char_length(description) <= 500),
  updated_at  timestamptz not null default now()
);

alter table public.site_settings enable row level security;
create policy "public_read_settings"    on public.site_settings for select using (true);
create policy "service_role_all_settings" on public.site_settings using (auth.role() = 'service_role');

-- ─────────────────────────────────────────────
-- Seed: Services (3 active)
-- ─────────────────────────────────────────────
insert into public.services (title, short_description, description, icon_name, features, technologies, display_order, is_active) values
(
  'Custom Software Development',
  'Tailor-made software built around your exact business requirements.',
  'We architect and build custom software solutions from the ground up — designed to fit your workflows, scale with your growth, and outlast off-the-shelf alternatives.',
  'Code2',
  ARRAY['Requirements analysis and technical scoping','Full-stack development with modern frameworks','API design and third-party integrations','Automated testing and QA','CI/CD setup and deployment pipelines','Ongoing maintenance and support'],
  ARRAY['TypeScript','Node.js','PostgreSQL','React','Next.js'],
  1, true
),
(
  'Web Development',
  'Fast, accessible, SEO-optimized web apps that convert and scale.',
  'From marketing sites to full-featured SaaS platforms, we build web applications that are performant, accessible, and designed to grow.',
  'Globe',
  ARRAY['Server-side and static rendering with Next.js','Responsive design for all screen sizes','SEO and Core Web Vitals optimization','Authentication, authorization, and user management','Real-time features and interactive UX','Analytics and conversion tracking setup'],
  ARRAY['Next.js','TypeScript','Tailwind CSS','Supabase','Vercel'],
  2, true
),
(
  'Mobile App Development',
  'Native-quality iOS and Android apps from a single codebase.',
  'We build cross-platform mobile applications using React Native and Flutter — delivering native performance with efficient development cycles.',
  'Smartphone',
  ARRAY['Cross-platform iOS and Android development','Native performance and smooth animations','Offline-first architecture','Push notifications and background services','App Store and Play Store publishing','OTA update support'],
  ARRAY['React Native','Flutter','TypeScript','Expo'],
  3, true
)
on conflict do nothing;

-- ─────────────────────────────────────────────
-- Seed: Portfolio Items
-- ─────────────────────────────────────────────
insert into public.portfolio_items (title, category, description, tags, is_featured, is_active, display_order) values
('FinTech Analytics Dashboard',       'SaaS · FinTech',     'A real-time financial analytics platform processing millions of transactions with sub-second query performance and role-based access for enterprise teams.',                                           ARRAY['Next.js','Supabase','TypeScript','PostgreSQL'],     true,  true, 1),
('Healthcare Patient Portal',         'Web App · Healthcare','A HIPAA-aligned patient management system with appointment booking, secure messaging, and EHR integration for a regional clinic network.',                                                               ARRAY['React','Node.js','PostgreSQL','Cloudflare'],        true,  true, 2),
('Multi-Vendor E-commerce Platform',  'SaaS · E-commerce',  'A scalable marketplace platform supporting 200+ vendors with automated payouts, inventory management, and a mobile-first storefront.',                                                                    ARRAY['Next.js','Stripe','Supabase','React Native'],       true,  true, 3),
('Logistics Tracking System',         'Web App · Logistics', 'End-to-end shipment tracking with real-time driver location, automated notifications, and a carrier partner integration layer.',                                                                         ARRAY['React','Node.js','WebSockets','PostgreSQL'],        false, true, 4),
('EdTech Learning Management System', 'SaaS · Education',   'A feature-complete LMS with video streaming, progress tracking, quiz engine, and certificate generation for 10,000+ learners.',                                                                          ARRAY['Next.js','Supabase','Cloudflare','TypeScript'],     false, true, 5),
('AI-Powered Content Platform',       'SaaS · AI',          'A content generation SaaS with LLM integrations, usage-based billing, and a multi-tenant architecture serving B2B customers.',                                                                           ARRAY['Next.js','OpenAI','Stripe','Supabase'],             false, true, 6)
on conflict do nothing;

-- ─────────────────────────────────────────────
-- Seed: Testimonials
-- ─────────────────────────────────────────────
insert into public.testimonials (name, role, company, content, rating, is_active, display_order) values
('Sarah Chen',      'CEO',               'NexaPay',        'Sterova delivered our FinTech dashboard ahead of schedule and well within budget. Their technical depth is impressive — they flagged architecture risks before they became problems.',                5, true, 1),
('Marcus Okonkwo',  'CTO',               'MedBridge Health','We''ve worked with multiple development agencies. Sterova stands out because they think like engineers, not just executors. The patient portal they built is rock-solid.',                           5, true, 2),
('Priya Nair',      'Founder',           'CartNest',        'Building a multi-vendor marketplace is complex. Sterova made it look easy. They asked the right questions, documented every decision, and delivered a platform we''re proud to run.',                5, true, 3),
('James Whitfield', 'Head of Engineering','LogiTrack',      'The Sterova team integrated into our processes seamlessly. Daily standups, clean commits, clear communication — and the quality of their TypeScript code is exceptional.',                           5, true, 4),
('Aisha Mohammed',  'Product Lead',      'LearnSphere',     'Our LMS handles 10,000+ concurrent learners with zero downtime since launch. Sterova''s architecture choices are battle-tested. They are the kind of partner that makes a real difference.',         5, true, 5)
on conflict do nothing;

-- ─────────────────────────────────────────────
-- Seed: FAQs
-- ─────────────────────────────────────────────
insert into public.faqs (question, answer, display_order, is_active) values
('How long does a typical project take?',     'It depends on scope. A focused MVP typically takes 6–10 weeks. A full-featured SaaS platform can take 3–6 months. We always start with a scoping call to give you an accurate timeline.',                                    1, true),
('Do you work with early-stage startups?',    'Absolutely. We work with founders from idea stage through to post-Series A. We understand early-stage constraints and can help you prioritize ruthlessly to hit your first milestone.',                                        2, true),
('Can you work with our existing codebase?',  'Yes. We frequently take over existing projects, perform code audits, refactor legacy systems, and add new features. We''ll do an honest technical assessment before committing.',                                              3, true),
('What is your tech stack?',                  'Our primary stack is Next.js, TypeScript, Tailwind CSS, Supabase, and PostgreSQL for web. For mobile we use React Native and Flutter. We adapt to your requirements — we''re not stack-locked.',                              4, true),
('How do you handle project communication?',  'You get a dedicated project manager, weekly demo calls, a shared Slack channel, and full access to our project management board. No black boxes — you always know what we''re working on.',                                   5, true),
('Do you sign NDAs?',                         'Yes. We sign NDAs as standard before any detailed technical discussions. Your ideas and data stay confidential.',                                                                                                             6, true),
('How is pricing structured?',                'We offer fixed-price project quotes for well-scoped work, and monthly retainers for ongoing development and support. We discuss pricing transparently after a scoping call — no surprise invoices.',                           7, true),
('What happens after launch?',                'Every project includes a 30-day support window. Beyond that, we offer maintenance retainers for bug fixes, performance monitoring, dependency updates, and feature additions.',                                                8, true),
('Do you have experience with my industry?',  'We''ve built products for FinTech, Healthcare, EdTech, E-commerce, Logistics, and more. We learn your domain deeply before starting. Check our portfolio for examples.',                                                    9, true),
('How do I get started?',                     'Fill out the contact form or send us a WhatsApp message describing your project. We''ll schedule a free 30-minute scoping call within 24 hours.',                                                                           10, true)
on conflict do nothing;

-- ─────────────────────────────────────────────
-- Seed: Site Settings
-- ─────────────────────────────────────────────
insert into public.site_settings (key, value, type, description) values
('site_name',        'Sterova',                         'text',  'Company name displayed across the site'),
('site_tagline',     'Build. Scale. Innovate.',          'text',  'Main tagline shown in hero and browser tab'),
('site_email',       'hello@sterova.tech',              'email', 'Primary contact email'),
('whatsapp_number',  '+919786475035',                   'text',  'WhatsApp number with country code (no spaces)'),
('hero_badge',       'Trusted Engineering Partner',      'text',  'Small badge text above the hero headline'),
('hero_headline',    'Build. Scale. Innovate.',          'text',  'Main hero headline'),
('hero_subheadline', 'We help startups, businesses, and enterprises design, develop, and deploy high-quality digital products — fast.', 'text', 'Hero subheadline'),
('contact_email',    'hello@sterova.tech',              'email', 'Email that receives contact form submissions'),
('from_email',       'hello@sterova.tech',              'email', 'From address for outgoing emails (must be verified in Resend)'),
('site_url',         'https://sterova.tech',            'url',   'Production site URL')
on conflict (key) do update set value = excluded.value, updated_at = now();
