-- =============================================================================
-- Sterova — Initial Schema Migration
-- =============================================================================
-- Run this against your Supabase project via the SQL editor or CLI.
-- All tables have Row Level Security enabled with appropriate policies.
-- =============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- =============================================================================
-- contact_messages
-- =============================================================================
create table if not exists public.contact_messages (
  id           uuid primary key default uuid_generate_v4(),
  created_at   timestamptz not null default now(),
  name         text not null check (char_length(name) <= 200),
  email        text not null check (char_length(email) <= 320),
  company      text check (char_length(company) <= 200),
  service      text check (char_length(service) <= 200),
  budget       text check (char_length(budget) <= 100),
  message      text not null check (char_length(message) <= 5000),
  status       text not null default 'new'
                 check (status in ('new', 'read', 'replied', 'archived')),
  ip_address   text check (char_length(ip_address) <= 100),
  user_agent   text check (char_length(user_agent) <= 500)
);

alter table public.contact_messages enable row level security;

-- Service role (backend) can do everything. Public has no access.
create policy "service_role_all" on public.contact_messages
  using (auth.role() = 'service_role');

-- Indexes
create index if not exists contact_messages_created_at_idx
  on public.contact_messages (created_at desc);

create index if not exists contact_messages_status_idx
  on public.contact_messages (status);

create index if not exists contact_messages_email_idx
  on public.contact_messages (email);

-- =============================================================================
-- newsletter_subscribers
-- =============================================================================
create table if not exists public.newsletter_subscribers (
  id         uuid primary key default uuid_generate_v4(),
  created_at timestamptz not null default now(),
  email      text not null unique check (char_length(email) <= 320),
  active     boolean not null default true,
  source     text check (char_length(source) <= 100)
);

alter table public.newsletter_subscribers enable row level security;

create policy "service_role_all" on public.newsletter_subscribers
  using (auth.role() = 'service_role');

create index if not exists newsletter_subscribers_email_idx
  on public.newsletter_subscribers (email);

create index if not exists newsletter_subscribers_active_idx
  on public.newsletter_subscribers (active);

-- =============================================================================
-- job_applications
-- =============================================================================
create table if not exists public.job_applications (
  id             uuid primary key default uuid_generate_v4(),
  created_at     timestamptz not null default now(),
  position       text not null check (char_length(position) <= 200),
  name           text not null check (char_length(name) <= 200),
  email          text not null check (char_length(email) <= 320),
  phone          text check (char_length(phone) <= 50),
  linkedin_url   text check (char_length(linkedin_url) <= 500),
  portfolio_url  text check (char_length(portfolio_url) <= 500),
  resume_url     text check (char_length(resume_url) <= 500),
  cover_letter   text check (char_length(cover_letter) <= 10000),
  status         text not null default 'new'
                   check (status in ('new', 'reviewing', 'interviewed', 'offered', 'rejected'))
);

alter table public.job_applications enable row level security;

create policy "service_role_all" on public.job_applications
  using (auth.role() = 'service_role');

create index if not exists job_applications_created_at_idx
  on public.job_applications (created_at desc);

create index if not exists job_applications_status_idx
  on public.job_applications (status);

-- =============================================================================
-- blog_categories
-- =============================================================================
create table if not exists public.blog_categories (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null unique check (char_length(name) <= 100),
  slug        text not null unique check (char_length(slug) <= 100),
  description text check (char_length(description) <= 500)
);

alter table public.blog_categories enable row level security;

-- Public can read categories
create policy "public_read" on public.blog_categories
  for select using (true);

-- Service role can write
create policy "service_role_all" on public.blog_categories
  using (auth.role() = 'service_role');

-- Seed initial categories
insert into public.blog_categories (name, slug) values
  ('Engineering',     'engineering'),
  ('Product',         'product'),
  ('AI & Automation', 'ai-automation'),
  ('Design',          'design'),
  ('Startup',         'startup'),
  ('Security',        'security')
on conflict (slug) do nothing;

-- =============================================================================
-- blog_posts
-- =============================================================================
create table if not exists public.blog_posts (
  id                  uuid primary key default uuid_generate_v4(),
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  title               text not null check (char_length(title) <= 500),
  slug                text not null unique check (char_length(slug) <= 500),
  excerpt             text not null check (char_length(excerpt) <= 1000),
  content             text not null,
  cover_image_url     text check (char_length(cover_image_url) <= 500),
  category            text not null references public.blog_categories(name),
  tags                text[] not null default '{}',
  author_name         text not null check (char_length(author_name) <= 200),
  author_avatar_url   text check (char_length(author_avatar_url) <= 500),
  published           boolean not null default false,
  published_at        timestamptz,
  read_time_minutes   integer check (read_time_minutes > 0),
  views               integer not null default 0 check (views >= 0)
);

alter table public.blog_posts enable row level security;

-- Public can read published posts only
create policy "public_read_published" on public.blog_posts
  for select using (published = true);

-- Service role can do everything
create policy "service_role_all" on public.blog_posts
  using (auth.role() = 'service_role');

-- Indexes
create index if not exists blog_posts_slug_idx
  on public.blog_posts (slug);

create index if not exists blog_posts_published_at_idx
  on public.blog_posts (published_at desc)
  where published = true;

create index if not exists blog_posts_category_idx
  on public.blog_posts (category);

-- Auto-update updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger blog_posts_updated_at
  before update on public.blog_posts
  for each row execute procedure public.set_updated_at();

-- =============================================================================
-- admins
-- =============================================================================
create table if not exists public.admins (
  id         uuid primary key default uuid_generate_v4(),
  created_at timestamptz not null default now(),
  user_id    uuid not null unique references auth.users(id) on delete cascade,
  email      text not null unique,
  role       text not null default 'admin'
               check (role in ('admin', 'super_admin'))
);

alter table public.admins enable row level security;

-- Admins can read their own record
create policy "self_read" on public.admins
  for select using (auth.uid() = user_id);

-- Service role can do everything
create policy "service_role_all" on public.admins
  using (auth.role() = 'service_role');

-- =============================================================================
-- audit_logs
-- =============================================================================
create table if not exists public.audit_logs (
  id          uuid primary key default uuid_generate_v4(),
  created_at  timestamptz not null default now(),
  actor_id    uuid references auth.users(id) on delete set null,
  actor_email text check (char_length(actor_email) <= 320),
  action      text not null check (char_length(action) <= 200),
  resource    text check (char_length(resource) <= 200),
  resource_id text check (char_length(resource_id) <= 200),
  metadata    jsonb
);

alter table public.audit_logs enable row level security;

-- Service role only
create policy "service_role_all" on public.audit_logs
  using (auth.role() = 'service_role');

create index if not exists audit_logs_created_at_idx
  on public.audit_logs (created_at desc);

create index if not exists audit_logs_actor_id_idx
  on public.audit_logs (actor_id);
