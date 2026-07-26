-- =============================================================================
-- Sterova — Full Reset & Schema
-- =============================================================================
-- Paste this entire script into the Supabase SQL Editor and run it.
-- It drops every existing table, recreates the schema, and seeds all content.
-- WARNING: All existing data will be permanently deleted.
-- =============================================================================


-- ─────────────────────────────────────────────────────────────────────────────
-- STEP 1: Drop everything (CASCADE removes FK dependencies automatically)
-- ─────────────────────────────────────────────────────────────────────────────
drop table if exists public.blog_posts             cascade;
drop table if exists public.blog_categories        cascade;
drop table if exists public.audit_logs             cascade;
drop table if exists public.admins                 cascade;
drop table if exists public.navigation_items       cascade;
drop table if exists public.site_settings          cascade;
drop table if exists public.faqs                   cascade;
drop table if exists public.testimonials           cascade;
drop table if exists public.portfolio_items        cascade;
drop table if exists public.services               cascade;
drop table if exists public.reviews                cascade;
drop table if exists public.job_applications       cascade;
drop table if exists public.newsletter_subscribers cascade;
drop table if exists public.contact_messages       cascade;

drop function if exists public.set_updated_at() cascade;


-- ─────────────────────────────────────────────────────────────────────────────
-- STEP 2: Extensions & shared trigger function
-- ─────────────────────────────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";

create function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;


-- ─────────────────────────────────────────────────────────────────────────────
-- contact_messages
-- Stores every contact form submission. Service-role only (no public read).
-- ─────────────────────────────────────────────────────────────────────────────
create table public.contact_messages (
  id          uuid        primary key default uuid_generate_v4(),
  created_at  timestamptz not null    default now(),
  name        text        not null    check (char_length(name)    <= 200),
  email       text        not null    check (char_length(email)   <= 320),
  company     text                    check (char_length(company) <= 200),
  service     text                    check (char_length(service) <= 200),
  budget      text                    check (char_length(budget)  <= 100),
  message     text        not null    check (char_length(message) <= 5000),
  status      text        not null    default 'new'
                check (status in ('new', 'read', 'replied', 'archived')),
  ip_address  text                    check (char_length(ip_address) <= 100),
  user_agent  text                    check (char_length(user_agent) <= 500)
);

alter table public.contact_messages enable row level security;
create policy "service_role_all" on public.contact_messages
  using (auth.role() = 'service_role');
create index contact_messages_created_at_idx on public.contact_messages (created_at desc);
create index contact_messages_status_idx     on public.contact_messages (status);
create index contact_messages_email_idx      on public.contact_messages (email);


-- ─────────────────────────────────────────────────────────────────────────────
-- newsletter_subscribers
-- ─────────────────────────────────────────────────────────────────────────────
create table public.newsletter_subscribers (
  id         uuid        primary key default uuid_generate_v4(),
  created_at timestamptz not null    default now(),
  email      text        not null    unique check (char_length(email) <= 320),
  active     boolean     not null    default true,
  source     text                    check (char_length(source) <= 100)
);

alter table public.newsletter_subscribers enable row level security;
create policy "service_role_all" on public.newsletter_subscribers
  using (auth.role() = 'service_role');
create index newsletter_subscribers_email_idx  on public.newsletter_subscribers (email);
create index newsletter_subscribers_active_idx on public.newsletter_subscribers (active);


-- ─────────────────────────────────────────────────────────────────────────────
-- job_applications
-- ─────────────────────────────────────────────────────────────────────────────
create table public.job_applications (
  id            uuid        primary key default uuid_generate_v4(),
  created_at    timestamptz not null    default now(),
  position      text        not null    check (char_length(position)      <= 200),
  name          text        not null    check (char_length(name)          <= 200),
  email         text        not null    check (char_length(email)         <= 320),
  phone         text                    check (char_length(phone)         <= 50),
  linkedin_url  text                    check (char_length(linkedin_url)  <= 500),
  portfolio_url text                    check (char_length(portfolio_url) <= 500),
  resume_url    text                    check (char_length(resume_url)    <= 500),
  cover_letter  text                    check (char_length(cover_letter)  <= 10000),
  status        text        not null    default 'new'
                  check (status in ('new', 'reviewing', 'interviewed', 'offered', 'rejected'))
);

alter table public.job_applications enable row level security;
create policy "service_role_all" on public.job_applications
  using (auth.role() = 'service_role');
create index job_applications_created_at_idx on public.job_applications (created_at desc);
create index job_applications_status_idx     on public.job_applications (status);


-- ─────────────────────────────────────────────────────────────────────────────
-- reviews  (public star ratings, moderated)
-- ─────────────────────────────────────────────────────────────────────────────
create table public.reviews (
  id         uuid        primary key default uuid_generate_v4(),
  created_at timestamptz not null    default now(),
  name       text        not null    default 'Anonymous'
               check (char_length(name) <= 100),
  content    text        not null
               check (char_length(content) between 10 and 2000),
  rating     integer     not null    default 5
               check (rating between 1 and 5),
  approved   boolean     not null    default true,
  ip_address text                    check (char_length(ip_address) <= 100)
);

alter table public.reviews enable row level security;
create policy "public_read_approved" on public.reviews
  for select using (approved = true);
create policy "public_insert" on public.reviews
  for insert with check (true);
create policy "service_role_all" on public.reviews
  using (auth.role() = 'service_role');
create index reviews_created_at_idx
  on public.reviews (created_at desc) where approved = true;


-- ─────────────────────────────────────────────────────────────────────────────
-- services  (all 11 services from the website)
-- ─────────────────────────────────────────────────────────────────────────────
create table public.services (
  id                uuid        primary key default uuid_generate_v4(),
  created_at        timestamptz not null    default now(),
  updated_at        timestamptz not null    default now(),
  slug              text        not null    unique check (char_length(slug) <= 100),
  title             text        not null    check (char_length(title) <= 200),
  short_description text        not null    check (char_length(short_description) <= 500),
  description       text        not null,
  icon_name         text        not null    default 'Code2'
                      check (char_length(icon_name) <= 50),
  features          text[]      not null    default '{}',
  technologies      text[]      not null    default '{}',
  display_order     integer     not null    default 0,
  is_active         boolean     not null    default true
);

alter table public.services enable row level security;
create policy "public_read_active" on public.services
  for select using (is_active = true);
create policy "service_role_all" on public.services
  using (auth.role() = 'service_role');
create trigger services_updated_at before update on public.services
  for each row execute procedure public.set_updated_at();
create index services_display_order_idx
  on public.services (display_order) where is_active = true;

insert into public.services
  (slug, title, short_description, description, icon_name, features, technologies, display_order)
values
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
),
(
  'saas',
  'SaaS Product Development',
  'End-to-end product engineering for scalable SaaS platforms.',
  'We partner with founders and product teams to design, build, and launch SaaS products — from MVP to enterprise scale.',
  'Layers',
  array['Product architecture and technical strategy','Multi-tenant data isolation','Subscription billing integrations','Role-based access control','Admin dashboard and analytics','Feature flagging and gradual rollouts'],
  array['Next.js','Supabase','PostgreSQL','Stripe','Vercel'],
  4
),
(
  'design',
  'UI/UX Design',
  'User-centered design that balances beauty with usability.',
  'Our design process is research-driven and conversion-focused — creating interfaces that are intuitive, accessible, and on-brand.',
  'Palette',
  array['User research and persona development','Information architecture and wireframing','High-fidelity UI design in Figma','Design system creation','Usability testing and iteration','Handoff-ready developer specifications'],
  array['Figma','Tailwind CSS','shadcn/ui','Framer Motion'],
  5
),
(
  'ai-automation',
  'AI & Automation Solutions',
  'Intelligent systems that reduce manual work and surface insights.',
  'We integrate AI and automation into your products and workflows — from LLM-powered features to intelligent process automation.',
  'Bot',
  array['LLM integration and prompt engineering','AI-powered search and recommendations','Workflow automation pipelines','Data processing and enrichment','Custom ML model integration','Monitoring and cost control'],
  array['Python','OpenAI','LangChain','PostgreSQL','Node.js'],
  6
),
(
  'cloud-devops',
  'Cloud & DevOps',
  'Infrastructure that is secure, cost-efficient, and production-ready.',
  'We design and manage cloud infrastructure that scales with your product — reliable, observable, and built for zero-downtime deployments.',
  'Cloud',
  array['Cloud architecture design on Vercel, Supabase, Cloudflare','CI/CD pipeline setup with GitHub Actions','Containerization and orchestration','Infrastructure-as-code','Monitoring, alerting, and observability','Cost optimization reviews'],
  array['Vercel','Supabase','Cloudflare','GitHub Actions','Docker'],
  7
),
(
  'cybersecurity',
  'Cybersecurity Consulting',
  'Security built in from day one, not bolted on at the end.',
  'We help businesses identify vulnerabilities, implement security best practices, and build defensible systems from the ground up.',
  'Shield',
  array['Security architecture review','Penetration testing','Row Level Security and access control design','Compliance readiness (GDPR, SOC 2 basics)','Threat modeling','Security code review'],
  array['Supabase RLS','OWASP','CSP','JWT','PostgreSQL'],
  8
),
(
  'api-integration',
  'API Development & Integration',
  'Seamless integrations that connect your systems and unlock data flow.',
  'From REST APIs to event-driven architectures, we design robust integrations that connect your stack and power your product.',
  'Plug',
  array['RESTful and GraphQL API design','Third-party API integrations','Webhook systems','API documentation with OpenAPI','Rate limiting and caching','SDK and client library development'],
  array['Node.js','Express','TypeScript','PostgreSQL','Redis'],
  9
),
(
  'maintenance',
  'Software Maintenance & Support',
  'Ongoing engineering support to keep your product running at its best.',
  'We provide retainer-based engineering support — bug fixes, performance tuning, dependency updates, and feature additions on your schedule.',
  'Wrench',
  array['Bug tracking and resolution SLAs','Dependency and security updates','Performance monitoring and optimization','Feature development on retainer','Documentation and knowledge transfer','Emergency on-call support'],
  array['TypeScript','Node.js','React','PostgreSQL','Next.js'],
  10
),
(
  'it-consulting',
  'IT Consulting',
  'Strategic technology advice from engineers who build for a living.',
  'We help leadership teams make better technology decisions — from vendor selection to architecture reviews to build-vs-buy analysis.',
  'MessageSquare',
  array['Technology stack assessment','Build vs. buy analysis','Vendor evaluation','Technical roadmap planning','CTO-as-a-service for early-stage startups','Engineering team structure and hiring guidance'],
  array['Strategy','Architecture','Cloud','AI','Security'],
  11
)
on conflict (slug) do nothing;


-- ─────────────────────────────────────────────────────────────────────────────
-- portfolio_items
-- ─────────────────────────────────────────────────────────────────────────────
create table public.portfolio_items (
  id            uuid        primary key default uuid_generate_v4(),
  created_at    timestamptz not null    default now(),
  updated_at    timestamptz not null    default now(),
  title         text        not null    check (char_length(title) <= 300),
  category      text        not null    check (char_length(category) <= 200),
  description   text        not null,
  tags          text[]      not null    default '{}',
  image_url     text                    check (char_length(image_url)   <= 500),
  live_url      text                    check (char_length(live_url)    <= 500),
  github_url    text                    check (char_length(github_url)  <= 500),
  is_featured   boolean     not null    default false,
  is_active     boolean     not null    default true,
  display_order integer     not null    default 0
);

alter table public.portfolio_items enable row level security;
create policy "public_read_active" on public.portfolio_items
  for select using (is_active = true);
create policy "service_role_all" on public.portfolio_items
  using (auth.role() = 'service_role');
create trigger portfolio_items_updated_at before update on public.portfolio_items
  for each row execute procedure public.set_updated_at();
create index portfolio_items_display_order_idx
  on public.portfolio_items (display_order) where is_active = true;
create index portfolio_items_featured_idx
  on public.portfolio_items (is_featured)    where is_active = true;

insert into public.portfolio_items
  (title, category, description, tags, is_featured, is_active, display_order)
values
(
  'FinTech Analytics Dashboard',
  'SaaS · FinTech',
  'A real-time financial analytics platform processing millions of transactions with sub-second query performance and role-based access for enterprise teams.',
  array['Next.js','Supabase','TypeScript','PostgreSQL'],
  true, true, 1
),
(
  'Healthcare Patient Portal',
  'Web App · Healthcare',
  'A HIPAA-aligned patient management system with appointment booking, secure messaging, and EHR integration for a regional clinic network.',
  array['React','Node.js','PostgreSQL','Cloudflare'],
  true, true, 2
),
(
  'Multi-Vendor E-commerce Platform',
  'SaaS · E-commerce',
  'A scalable marketplace platform supporting 200+ vendors with automated payouts, inventory management, and a mobile-first storefront.',
  array['Next.js','Stripe','Supabase','React Native'],
  true, true, 3
),
(
  'Logistics Tracking System',
  'Web App · Logistics',
  'End-to-end shipment tracking with real-time driver location, automated notifications, and a carrier partner integration layer.',
  array['React','Node.js','WebSockets','PostgreSQL'],
  false, true, 4
),
(
  'EdTech Learning Management System',
  'SaaS · Education',
  'A feature-complete LMS with video streaming, progress tracking, quiz engine, and certificate generation for 10,000+ learners.',
  array['Next.js','Supabase','Cloudflare','TypeScript'],
  false, true, 5
),
(
  'AI-Powered Content Platform',
  'SaaS · AI',
  'A content generation SaaS with LLM integrations, usage-based billing, and a multi-tenant architecture serving B2B customers.',
  array['Next.js','OpenAI','Stripe','Supabase'],
  false, true, 6
);


-- ─────────────────────────────────────────────────────────────────────────────
-- testimonials
-- ─────────────────────────────────────────────────────────────────────────────
create table public.testimonials (
  id            uuid        primary key default uuid_generate_v4(),
  created_at    timestamptz not null    default now(),
  name          text        not null    check (char_length(name)    <= 200),
  role          text        not null    check (char_length(role)    <= 200),
  company       text                    check (char_length(company) <= 200),
  content       text        not null,
  rating        integer     not null    default 5 check (rating between 1 and 5),
  avatar_url    text                    check (char_length(avatar_url) <= 500),
  is_active     boolean     not null    default true,
  display_order integer     not null    default 0
);

alter table public.testimonials enable row level security;
create policy "public_read_active" on public.testimonials
  for select using (is_active = true);
create policy "service_role_all" on public.testimonials
  using (auth.role() = 'service_role');
create index testimonials_display_order_idx
  on public.testimonials (display_order) where is_active = true;

insert into public.testimonials
  (name, role, company, content, rating, display_order)
values
(
  'Sarah Chen', 'CEO', 'NexaPay',
  'Sterova delivered our FinTech dashboard ahead of schedule and well within budget. Their technical depth is impressive — they flagged architecture risks before they became problems. Highly recommend for any serious product build.',
  5, 1
),
(
  'Marcus Okonkwo', 'CTO', 'MedBridge Health',
  'We''ve worked with multiple development agencies. Sterova stands out because they think like engineers, not just executors. The patient portal they built is rock-solid and has handled 3× projected load without issues.',
  5, 2
),
(
  'Priya Nair', 'Founder', 'CartNest',
  'Building a multi-vendor marketplace is complex. Sterova made it look easy. They asked the right questions, documented every decision, and delivered a platform we''re proud to run. The post-launch support was equally excellent.',
  5, 3
),
(
  'James Whitfield', 'Head of Engineering', 'LogiTrack',
  'The Sterova team integrated into our processes seamlessly. Daily standups, clean commits, clear communication — and the quality of their TypeScript code is exceptional. We''ve extended the engagement twice.',
  5, 4
),
(
  'Aisha Mohammed', 'Product Lead', 'LearnSphere',
  'Our LMS handles 10,000+ concurrent learners with zero downtime since launch. Sterova''s architecture choices are battle-tested. They are the kind of engineering partner that makes a real difference.',
  5, 5
);


-- ─────────────────────────────────────────────────────────────────────────────
-- faqs
-- ─────────────────────────────────────────────────────────────────────────────
create table public.faqs (
  id            uuid        primary key default uuid_generate_v4(),
  created_at    timestamptz not null    default now(),
  updated_at    timestamptz not null    default now(),
  question      text        not null    check (char_length(question) <= 500),
  answer        text        not null,
  category      text                    check (char_length(category) <= 100),
  display_order integer     not null    default 0,
  is_active     boolean     not null    default true
);

alter table public.faqs enable row level security;
create policy "public_read_active" on public.faqs
  for select using (is_active = true);
create policy "service_role_all" on public.faqs
  using (auth.role() = 'service_role');
create trigger faqs_updated_at before update on public.faqs
  for each row execute procedure public.set_updated_at();
create index faqs_display_order_idx
  on public.faqs (display_order) where is_active = true;

insert into public.faqs (question, answer, display_order) values
(
  'How long does a typical project take?',
  'It depends on scope. A focused MVP typically takes 6–10 weeks. A full-featured SaaS platform can take 3–6 months. We always start with a scoping call to give you an accurate timeline based on your specific requirements.',
  1
),
(
  'Do you work with early-stage startups?',
  'Absolutely. We work with founders from idea stage through to post-Series A. We understand early-stage constraints and can help you prioritize ruthlessly to hit your first milestone with the right technical foundation.',
  2
),
(
  'Can you work with our existing codebase?',
  'Yes. We frequently take over existing projects, perform code audits, refactor legacy systems, and add new features. We''ll do an honest technical assessment before committing to anything.',
  3
),
(
  'What is your tech stack?',
  'Our primary stack is Next.js, TypeScript, Tailwind CSS, Supabase, and PostgreSQL for web. For mobile we use React Native and Flutter. For backend services, Node.js and Python. We adapt to your requirements — we''re not stack-locked.',
  4
),
(
  'How do you handle project communication?',
  'You get a dedicated project manager, weekly demo calls, a shared Slack channel, and full access to our project management board. No black boxes — you always know what we''re working on.',
  5
),
(
  'Do you sign NDAs?',
  'Yes. We sign NDAs as standard before any detailed technical discussions. Your ideas and data stay confidential.',
  6
),
(
  'How is pricing structured?',
  'We offer fixed-price project quotes for well-scoped work, and monthly retainers for ongoing development and support. We discuss pricing transparently after a scoping call — no surprise invoices.',
  7
),
(
  'What happens after launch?',
  'Every project includes a 30-day support window. Beyond that, we offer maintenance retainers for bug fixes, performance monitoring, dependency updates, and feature additions. We don''t disappear after delivery.',
  8
),
(
  'Do you have experience with my industry?',
  'We''ve built products for FinTech, Healthcare, EdTech, E-commerce, Logistics, Real Estate, and more. We learn your domain deeply before starting. Check our portfolio for examples.',
  9
),
(
  'How do I get started?',
  'Fill out the contact form or send us a WhatsApp message describing your project. We''ll schedule a free 30-minute scoping call within 24 hours.',
  10
);


-- ─────────────────────────────────────────────────────────────────────────────
-- site_settings  (key-value store for editable site content)
-- ─────────────────────────────────────────────────────────────────────────────
create table public.site_settings (
  id          uuid        primary key default uuid_generate_v4(),
  key         text        not null    unique check (char_length(key) <= 100),
  value       text        not null    default '',
  type        text        not null    default 'text'
                check (type in ('text','textarea','json','url','email','boolean','number')),
  label       text                    check (char_length(label) <= 200),
  description text                    check (char_length(description) <= 500),
  group_name  text                    check (char_length(group_name) <= 100),
  updated_at  timestamptz not null    default now()
);

alter table public.site_settings enable row level security;
create policy "public_read" on public.site_settings
  for select using (true);
create policy "service_role_all" on public.site_settings
  using (auth.role() = 'service_role');
create trigger site_settings_updated_at before update on public.site_settings
  for each row execute procedure public.set_updated_at();

insert into public.site_settings (key, value, type, label, description, group_name) values
('site_name',                'Sterova',                          'text',     'Site Name',             'Company name used across the site',                              'general'),
('site_tagline',             'Build. Scale. Innovate.',          'text',     'Tagline',               'Main tagline shown in hero and browser tab',                     'general'),
('site_url',                 'https://sterova.tech',             'url',      'Site URL',              'Production site URL',                                            'general'),
('hero_badge',               'Trusted Engineering Partner',      'text',     'Hero Badge',            'Small badge text above the hero headline',                       'hero'),
('hero_headline',            'Build. Scale. Innovate.',          'text',     'Hero Headline',         'Large headline in the hero section',                             'hero'),
('hero_subheadline',         'We help startups, businesses, and enterprises design, develop, and deploy high-quality digital products — fast.','textarea','Hero Sub-headline','Paragraph beneath the hero headline','hero'),
('hero_cta_primary_label',   'Start a Project',                  'text',     'Primary CTA Label',     'Label on the main hero button',                                  'hero'),
('hero_cta_primary_href',    '/contact',                         'url',      'Primary CTA URL',       'URL for the main hero button',                                   'hero'),
('hero_cta_secondary_label', 'View Our Work',                    'text',     'Secondary CTA Label',   'Label on the secondary hero button',                             'hero'),
('hero_cta_secondary_href',  '/portfolio',                       'url',      'Secondary CTA URL',     'URL for the secondary hero button',                              'hero'),
('hero_stats',               '[{"value":"50+","label":"Projects Delivered"},{"value":"98%","label":"Client Satisfaction"},{"value":"12+","label":"Industries Served"},{"value":"5★","label":"Average Rating"}]','json','Hero Stats (JSON)','JSON array of {value, label} objects shown below the hero CTA','hero'),
('site_email',               'hello@sterova.tech',               'email',    'Contact Email',         'Primary contact email shown on the site',                        'contact'),
('contact_email',            'hello@sterova.tech',               'email',    'Form Submissions Email','Email address that receives contact form submissions',            'contact'),
('from_email',               'hello@sterova.tech',               'email',    'From Email (Resend)',    'Sender address for outgoing emails — must be verified in Resend','contact'),
('site_phone',               '',                                 'text',     'Phone Number',          'Phone number shown in the contact section',                      'contact'),
('site_address',             '',                                 'text',     'Office Address',        'Physical office address',                                        'contact'),
('site_whatsapp',            '+919786475035',                    'text',     'WhatsApp (no spaces)',  'WhatsApp number with country code, no spaces',                   'contact'),
('site_whatsapp_display',    '+91 97864 75035',                  'text',     'WhatsApp Display Text', 'Formatted WhatsApp number shown to visitors',                    'contact'),
('social_twitter',           '',                                 'url',      'Twitter / X URL',       'Full URL to the Twitter/X profile',                              'social'),
('social_linkedin',          '',                                 'url',      'LinkedIn URL',          'Full URL to the LinkedIn company page',                          'social'),
('social_github',            '',                                 'url',      'GitHub URL',            'Full URL to the GitHub organisation',                            'social'),
('social_instagram',         '',                                 'url',      'Instagram URL',         'Full URL to the Instagram profile',                              'social')
on conflict (key) do update set value = excluded.value, updated_at = now();


-- ─────────────────────────────────────────────────────────────────────────────
-- navigation_items  (dynamic nav, optional — site uses static constants.tsx)
-- ─────────────────────────────────────────────────────────────────────────────
create table public.navigation_items (
  id            uuid    primary key default uuid_generate_v4(),
  label         text    not null check (char_length(label) <= 100),
  href          text    not null check (char_length(href)  <= 500),
  parent_id     uuid    references public.navigation_items(id) on delete cascade,
  display_order integer not null default 0,
  is_active     boolean not null default true
);

alter table public.navigation_items enable row level security;
create policy "public_read_active" on public.navigation_items
  for select using (is_active = true);
create policy "service_role_all" on public.navigation_items
  using (auth.role() = 'service_role');
create index navigation_items_parent_order_idx
  on public.navigation_items (parent_id, display_order) where is_active = true;


-- ─────────────────────────────────────────────────────────────────────────────
-- blog_categories
-- ─────────────────────────────────────────────────────────────────────────────
create table public.blog_categories (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null unique check (char_length(name) <= 100),
  slug        text not null unique check (char_length(slug) <= 100),
  description text            check (char_length(description) <= 500)
);

alter table public.blog_categories enable row level security;
create policy "public_read"      on public.blog_categories for select using (true);
create policy "service_role_all" on public.blog_categories using (auth.role() = 'service_role');

insert into public.blog_categories (name, slug) values
('Engineering',     'engineering'),
('Product',         'product'),
('AI & Automation', 'ai-automation'),
('Design',          'design'),
('Startup',         'startup'),
('Security',        'security')
on conflict (slug) do nothing;


-- ─────────────────────────────────────────────────────────────────────────────
-- admins  (links Supabase Auth users to admin role)
-- ─────────────────────────────────────────────────────────────────────────────
create table public.admins (
  id         uuid        primary key default uuid_generate_v4(),
  created_at timestamptz not null    default now(),
  user_id    uuid        not null    unique references auth.users(id) on delete cascade,
  email      text        not null    unique check (char_length(email) <= 320),
  role       text        not null    default 'admin'
               check (role in ('admin', 'super_admin')),
  is_active  boolean     not null    default true
);

alter table public.admins enable row level security;
create policy "service_role_all" on public.admins
  using (auth.role() = 'service_role');
create index admins_email_idx   on public.admins (email);
create index admins_user_id_idx on public.admins (user_id) where is_active = true;


-- ─────────────────────────────────────────────────────────────────────────────
-- audit_logs  (append-only admin action log)
-- ─────────────────────────────────────────────────────────────────────────────
create table public.audit_logs (
  id          uuid        primary key default uuid_generate_v4(),
  created_at  timestamptz not null    default now(),
  actor_id    uuid        references auth.users(id) on delete set null,
  actor_email text                    check (char_length(actor_email) <= 320),
  action      text        not null    check (char_length(action)      <= 200),
  resource    text                    check (char_length(resource)    <= 100),
  resource_id text                    check (char_length(resource_id) <= 100),
  metadata    jsonb
);

alter table public.audit_logs enable row level security;
create policy "service_role_all" on public.audit_logs
  using (auth.role() = 'service_role');
create index audit_logs_created_at_idx on public.audit_logs (created_at desc);
create index audit_logs_actor_id_idx   on public.audit_logs (actor_id);
create index audit_logs_action_idx     on public.audit_logs (action);
create index audit_logs_resource_idx   on public.audit_logs (resource, resource_id);


-- ─────────────────────────────────────────────────────────────────────────────
-- blog_posts
-- ─────────────────────────────────────────────────────────────────────────────
create table public.blog_posts (
  id                uuid        primary key default uuid_generate_v4(),
  created_at        timestamptz not null    default now(),
  updated_at        timestamptz not null    default now(),
  title             text        not null    check (char_length(title)   <= 500),
  slug              text        not null    unique check (char_length(slug) <= 200),
  excerpt           text        not null    check (char_length(excerpt) <= 1000),
  content           text        not null    default '',
  cover_image_url   text                    check (char_length(cover_image_url) <= 500),
  category          text        not null    default 'Engineering'
                      check (char_length(category) <= 100),
  tags              text[]      not null    default '{}',
  author_name       text        not null    default 'Sterova Team'
                      check (char_length(author_name) <= 200),
  author_avatar_url text                    check (char_length(author_avatar_url) <= 500),
  published         boolean     not null    default false,
  published_at      timestamptz,
  read_time_minutes integer     not null    default 5,
  views             integer     not null    default 0
);

alter table public.blog_posts enable row level security;
create policy "public_read_published" on public.blog_posts
  for select using (published = true);
create policy "service_role_all" on public.blog_posts
  using (auth.role() = 'service_role');
create trigger blog_posts_updated_at before update on public.blog_posts
  for each row execute procedure public.set_updated_at();
create index blog_posts_slug_idx
  on public.blog_posts (slug)             where published = true;
create index blog_posts_published_at_idx
  on public.blog_posts (published_at desc) where published = true;
create index blog_posts_category_idx
  on public.blog_posts (category);


-- =============================================================================
-- DONE. All tables created and seed data loaded.
--
-- Next step — create your admin account:
--   Option A (recommended): visit /admin/setup in your browser.
--   Option B (manual SQL):
--     1. Supabase → Authentication → Users → Add user (email + password)
--     2. Copy the new user's UUID, then run:
--
--        INSERT INTO public.admins (user_id, email, role)
--        VALUES ('PASTE-UUID-HERE'::uuid, 'you@example.com', 'super_admin')
--        ON CONFLICT (user_id) DO NOTHING;
-- =============================================================================
