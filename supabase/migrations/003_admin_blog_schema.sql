-- =============================================================================
-- Sterova — Admin & Blog Schema (003)
-- =============================================================================
-- Run AFTER 002_content_schema.sql
-- Creates: admins, audit_logs, blog_posts
-- =============================================================================

-- =============================================================================
-- admins  (links Supabase Auth users to admin role)
-- =============================================================================
create table if not exists public.admins (
  id         uuid primary key default uuid_generate_v4(),
  created_at timestamptz not null default now(),
  user_id    uuid not null unique references auth.users(id) on delete cascade,
  email      text not null check (char_length(email) <= 320),
  role       text not null default 'admin'
               check (role in ('admin', 'super_admin')),
  is_active  boolean not null default true
);

-- Only service_role can read/write admins — no public RLS
alter table public.admins enable row level security;

create policy "service_role_all" on public.admins
  using (auth.role() = 'service_role');

create index if not exists admins_user_id_idx
  on public.admins (user_id) where is_active = true;

-- =============================================================================
-- audit_logs  (append-only admin action log)
-- =============================================================================
create table if not exists public.audit_logs (
  id          uuid primary key default uuid_generate_v4(),
  created_at  timestamptz not null default now(),
  actor_id    uuid references auth.users(id) on delete set null,
  actor_email text check (char_length(actor_email) <= 320),
  action      text not null check (char_length(action) <= 200),
  resource    text check (char_length(resource) <= 100),
  resource_id text check (char_length(resource_id) <= 100),
  metadata    jsonb
);

alter table public.audit_logs enable row level security;

create policy "service_role_all" on public.audit_logs
  using (auth.role() = 'service_role');

create index if not exists audit_logs_created_at_idx
  on public.audit_logs (created_at desc);

create index if not exists audit_logs_resource_idx
  on public.audit_logs (resource, resource_id);

-- =============================================================================
-- blog_posts
-- =============================================================================
create table if not exists public.blog_posts (
  id                uuid primary key default uuid_generate_v4(),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  title             text not null check (char_length(title) <= 500),
  slug              text not null unique check (char_length(slug) <= 200),
  excerpt           text not null check (char_length(excerpt) <= 1000),
  content           text not null default '',
  cover_image_url   text check (char_length(cover_image_url) <= 500),
  category          text not null default 'Engineering'
                      check (char_length(category) <= 100),
  tags              text[] not null default '{}',
  author_name       text not null default 'Sterova Team'
                      check (char_length(author_name) <= 200),
  author_avatar_url text check (char_length(author_avatar_url) <= 500),
  published         boolean not null default false,
  published_at      timestamptz,
  read_time_minutes integer not null default 5,
  views             integer not null default 0
);

alter table public.blog_posts enable row level security;

create policy "public_read_published" on public.blog_posts
  for select using (published = true);

create policy "service_role_all" on public.blog_posts
  using (auth.role() = 'service_role');

create trigger blog_posts_updated_at
  before update on public.blog_posts
  for each row execute procedure public.set_updated_at();

create index if not exists blog_posts_slug_idx
  on public.blog_posts (slug) where published = true;

create index if not exists blog_posts_published_at_idx
  on public.blog_posts (published_at desc) where published = true;
