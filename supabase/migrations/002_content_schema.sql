-- =============================================================================
-- Sterova — Content Schema Migration (002)
-- =============================================================================
-- Run AFTER 001_initial_schema.sql
-- Creates: reviews, services, portfolio_items, testimonials, faqs,
--          site_settings, navigation_items
-- Includes seed data for all content tables.
-- =============================================================================

-- Reuse the set_updated_at() trigger function from migration 001.
-- (It is already created there via "create or replace function".)

-- =============================================================================
-- reviews  (public customer reviews — auto-approved)
-- =============================================================================
create table if not exists public.reviews (
  id          uuid primary key default uuid_generate_v4(),
  created_at  timestamptz not null default now(),
  name        text not null check (char_length(name) <= 100),
  content     text not null check (char_length(content) <= 2000),
  rating      integer not null check (rating >= 1 and rating <= 5),
  approved    boolean not null default true,
  ip_address  text check (char_length(ip_address) <= 100)
);

alter table public.reviews enable row level security;

create policy "public_read_approved" on public.reviews
  for select using (approved = true);

create policy "public_insert" on public.reviews
  for insert with check (true);

create policy "service_role_all" on public.reviews
  using (auth.role() = 'service_role');

create index if not exists reviews_created_at_idx
  on public.reviews (created_at desc) where approved = true;

-- =============================================================================
-- services
-- =============================================================================
create table if not exists public.services (
  id                uuid primary key default uuid_generate_v4(),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  slug              text not null unique check (char_length(slug) <= 100),
  title             text not null check (char_length(title) <= 200),
  short_description text not null check (char_length(short_description) <= 500),
  description       text not null,
  icon_name         text not null default 'Code2' check (char_length(icon_name) <= 50),
  features          text[] not null default '{}',
  technologies      text[] not null default '{}',
  display_order     integer not null default 0,
  is_active         boolean not null default true
);

alter table public.services enable row level security;

create policy "public_read_active" on public.services
  for select using (is_active = true);

create policy "service_role_all" on public.services
  using (auth.role() = 'service_role');

create trigger services_updated_at
  before update on public.services
  for each row execute procedure public.set_updated_at();

create index if not exists services_display_order_idx
  on public.services (display_order) where is_active = true;

-- Seed: 3 core services
insert into public.services (slug, title, short_description, description, icon_name, features, technologies, display_order) values
(
  'custom-software',
  'Custom Software Development',
  'Tailor-made software built around your exact business requirements.',
  'We architect and build custom software solutions from the ground up — designed to fit your workflows, scale with your growth, and outlast off-the-shelf alternatives.',
  'Code2',
  array['Requirements analysis and technical scoping','Full-stack development with modern frameworks','API design and third-party integrations','Automated testing and QA','CI/CD setup and deployment pipelines','Ongoing maintenance and support'],
  array['TypeScript','Node.js','PostgreSQL','React','Next.js'],
  1
),
(
  'web-development',
  'Web Application Development',
  'Fast, accessible, SEO-optimized web apps that convert and scale.',
  'From marketing sites to full-featured SaaS platforms, we build web applications that are performant, accessible, and designed to grow.',
  'Globe',
  array['Server-side and static rendering with Next.js','Responsive design for all screen sizes','SEO and Core Web Vitals optimization','Authentication, authorization, and user management','Real-time features and interactive UX','Analytics and conversion tracking setup'],
  array['Next.js','TypeScript','Tailwind CSS','Supabase','Vercel'],
  2
),
(
  'mobile-apps',
  'Mobile App Development',
  'Native-quality iOS and Android apps from a single codebase.',
  'We build cross-platform mobile applications using React Native and Flutter — delivering native performance with efficient development cycles.',
  'Smartphone',
  array['Cross-platform iOS and Android development','Native performance and smooth animations','Offline-first architecture','Push notifications and background services','App Store and Play Store publishing','OTA update support'],
  array['React Native','Flutter','TypeScript','Expo'],
  3
)
on conflict (slug) do nothing;

-- =============================================================================
-- portfolio_items
-- =============================================================================
create table if not exists public.portfolio_items (
  id            uuid primary key default uuid_generate_v4(),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  title         text not null check (char_length(title) <= 300),
  category      text not null check (char_length(category) <= 200),
  description   text not null,
  tags          text[] not null default '{}',
  image_url     text check (char_length(image_url) <= 500),
  live_url      text check (char_length(live_url) <= 500),
  github_url    text check (char_length(github_url) <= 500),
  is_featured   boolean not null default false,
  is_active     boolean not null default true,
  display_order integer not null default 0
);

alter table public.portfolio_items enable row level security;

create policy "public_read_active" on public.portfolio_items
  for select using (is_active = true);

create policy "service_role_all" on public.portfolio_items
  using (auth.role() = 'service_role');

create trigger portfolio_items_updated_at
  before update on public.portfolio_items
  for each row execute procedure public.set_updated_at();

create index if not exists portfolio_items_display_order_idx
  on public.portfolio_items (display_order) where is_active = true;

create index if not exists portfolio_items_featured_idx
  on public.portfolio_items (is_featured) where is_active = true;

-- Seed: 6 portfolio projects
insert into public.portfolio_items (title, category, description, tags, is_featured, display_order) values
('FinTech Analytics Dashboard','SaaS · FinTech','A real-time financial analytics platform processing millions of transactions with sub-second query performance and role-based access for enterprise teams.',array['Next.js','Supabase','TypeScript','PostgreSQL'],true,1),
('Healthcare Patient Portal','Web App · Healthcare','A HIPAA-aligned patient management system with appointment booking, secure messaging, and EHR integration for a regional clinic network.',array['React','Node.js','PostgreSQL','Cloudflare'],true,2),
('Multi-Vendor E-commerce Platform','SaaS · E-commerce','A scalable marketplace platform supporting 200+ vendors with automated payouts, inventory management, and a mobile-first storefront.',array['Next.js','Stripe','Supabase','React Native'],true,3),
('Logistics Tracking System','Web App · Logistics','End-to-end shipment tracking with real-time driver location, automated notifications, and a carrier partner integration layer.',array['React','Node.js','WebSockets','PostgreSQL'],false,4),
('EdTech Learning Management System','SaaS · Education','A feature-complete LMS with video streaming, progress tracking, quiz engine, and certificate generation for 10,000+ learners.',array['Next.js','Supabase','Cloudflare','TypeScript'],false,5),
('AI-Powered Content Platform','SaaS · AI','A content generation SaaS with LLM integrations, usage-based billing, and a multi-tenant architecture serving B2B customers.',array['Next.js','OpenAI','Stripe','Supabase'],false,6)
on conflict do nothing;

-- =============================================================================
-- testimonials
-- =============================================================================
create table if not exists public.testimonials (
  id            uuid primary key default uuid_generate_v4(),
  created_at    timestamptz not null default now(),
  name          text not null check (char_length(name) <= 200),
  role          text not null check (char_length(role) <= 200),
  company       text check (char_length(company) <= 200),
  content       text not null,
  rating        integer not null check (rating >= 1 and rating <= 5) default 5,
  avatar_url    text check (char_length(avatar_url) <= 500),
  is_active     boolean not null default true,
  display_order integer not null default 0
);

alter table public.testimonials enable row level security;

create policy "public_read_active" on public.testimonials
  for select using (is_active = true);

create policy "service_role_all" on public.testimonials
  using (auth.role() = 'service_role');

create index if not exists testimonials_display_order_idx
  on public.testimonials (display_order) where is_active = true;

-- Seed: 5 testimonials
insert into public.testimonials (name, role, company, content, rating, display_order) values
('Sarah Chen','CEO','NexaPay','Sterova delivered our FinTech dashboard ahead of schedule and well within budget. Their technical depth is impressive — they flagged architecture risks before they became problems.',5,1),
('Marcus Okonkwo','CTO','MedBridge Health','We''ve worked with multiple development agencies. Sterova stands out because they think like engineers, not just executors. The patient portal they built is rock-solid and has handled 3× projected load without issues.',5,2),
('Priya Nair','Founder','CartNest','Building a multi-vendor marketplace is complex. Sterova made it look easy. They asked the right questions, documented every decision, and delivered a platform we''re proud to run.',5,3),
('James Whitfield','Head of Engineering','LogiTrack','The Sterova team integrated into our processes seamlessly. Daily standups, clean commits, clear communication — and the quality of their TypeScript code is exceptional. We''ve extended the engagement twice.',5,4),
('Aisha Mohammed','Product Lead','LearnSphere','Our LMS handles 10,000+ concurrent learners with zero downtime since launch. Sterova''s architecture choices are battle-tested. They are the kind of engineering partner that makes a real difference.',5,5)
on conflict do nothing;

-- =============================================================================
-- faqs
-- =============================================================================
create table if not exists public.faqs (
  id            uuid primary key default uuid_generate_v4(),
  created_at    timestamptz not null default now(),
  question      text not null check (char_length(question) <= 500),
  answer        text not null,
  category      text check (char_length(category) <= 100),
  display_order integer not null default 0,
  is_active     boolean not null default true
);

alter table public.faqs enable row level security;

create policy "public_read_active" on public.faqs
  for select using (is_active = true);

create policy "service_role_all" on public.faqs
  using (auth.role() = 'service_role');

create index if not exists faqs_display_order_idx
  on public.faqs (display_order) where is_active = true;

-- Seed: 10 FAQs
insert into public.faqs (question, answer, display_order) values
('How long does a typical project take?','It depends on scope. A focused MVP typically takes 6–10 weeks. A full-featured SaaS platform can take 3–6 months. We always start with a scoping call to give you an accurate timeline.',1),
('Do you work with early-stage startups?','Absolutely. We work with founders from idea stage through to post-Series A. We understand early-stage constraints and can help you prioritize ruthlessly to hit your first milestone.',2),
('Can you work with our existing codebase?','Yes. We frequently take over existing projects, perform code audits, refactor legacy systems, and add new features. We''ll do an honest technical assessment before committing to anything.',3),
('What is your tech stack?','Our primary stack is Next.js, TypeScript, Tailwind CSS, Supabase, and PostgreSQL for web. For mobile we use React Native and Flutter. We adapt to your requirements.',4),
('How do you handle project communication?','You get a dedicated project manager, weekly demo calls, a shared Slack channel, and full access to our project management board. No black boxes.',5),
('Do you sign NDAs?','Yes. We sign NDAs as standard before any detailed technical discussions. Your ideas and data stay confidential.',6),
('How is pricing structured?','We offer fixed-price project quotes for well-scoped work, and monthly retainers for ongoing development and support. Pricing is discussed transparently after a scoping call.',7),
('What happens after launch?','Every project includes a 30-day support window. Beyond that, we offer maintenance retainers for bug fixes, performance monitoring, and feature additions.',8),
('Do you have experience with my industry?','We''ve built products for FinTech, Healthcare, EdTech, E-commerce, Logistics, Real Estate, and more. We learn your domain deeply before starting.',9),
('How do I get started?','Fill out the contact form or send us a WhatsApp message. We''ll schedule a free 30-minute scoping call within 24 hours.',10)
on conflict do nothing;

-- =============================================================================
-- site_settings
-- =============================================================================
create table if not exists public.site_settings (
  id          uuid primary key default uuid_generate_v4(),
  key         text not null unique check (char_length(key) <= 100),
  value       text not null default '',
  type        text not null default 'text'
                check (type in ('text','textarea','json','url','email','boolean','number')),
  label       text check (char_length(label) <= 200),
  description text check (char_length(description) <= 500),
  group_name  text check (char_length(group_name) <= 100)
);

alter table public.site_settings enable row level security;

create policy "public_read" on public.site_settings
  for select using (true);

create policy "service_role_all" on public.site_settings
  using (auth.role() = 'service_role');

-- Seed site settings
insert into public.site_settings (key, value, type, label, group_name) values
('hero_badge','Trusted Engineering Partner','text','Hero Badge','hero'),
('hero_headline','Build. Scale. Innovate.','text','Hero Headline','hero'),
('hero_subheadline','We help startups, businesses, and enterprises design, develop, and deploy high-quality digital products — fast.','textarea','Hero Sub-headline','hero'),
('hero_cta_primary_label','Start a Project','text','Primary CTA Label','hero'),
('hero_cta_primary_href','/contact','url','Primary CTA URL','hero'),
('hero_cta_secondary_label','View Our Work','text','Secondary CTA Label','hero'),
('hero_cta_secondary_href','/portfolio','url','Secondary CTA URL','hero'),
('hero_stats','[{"value":"50+","label":"Projects Delivered"},{"value":"98%","label":"Client Satisfaction"},{"value":"12+","label":"Industries Served"},{"value":"5★","label":"Average Rating"}]','json','Hero Stats (JSON)','hero'),
('site_email','hello@sterova.tech','email','Contact Email','contact'),
('site_phone','','text','Phone Number','contact'),
('site_address','','text','Office Address','contact'),
('site_whatsapp','+919786475035','text','WhatsApp (with country code)','contact'),
('site_whatsapp_display','+91 97864 75035','text','WhatsApp Display Text','contact'),
('social_twitter','','url','Twitter / X URL','social'),
('social_linkedin','','url','LinkedIn URL','social'),
('social_github','','url','GitHub URL','social'),
('social_instagram','','url','Instagram URL','social')
on conflict (key) do nothing;

-- =============================================================================
-- navigation_items
-- =============================================================================
create table if not exists public.navigation_items (
  id            uuid primary key default uuid_generate_v4(),
  label         text not null check (char_length(label) <= 100),
  href          text not null check (char_length(href) <= 500),
  parent_id     uuid references public.navigation_items(id) on delete cascade,
  display_order integer not null default 0,
  is_active     boolean not null default true
);

alter table public.navigation_items enable row level security;

create policy "public_read_active" on public.navigation_items
  for select using (is_active = true);

create policy "service_role_all" on public.navigation_items
  using (auth.role() = 'service_role');

create index if not exists navigation_items_parent_order_idx
  on public.navigation_items (parent_id, display_order) where is_active = true;
