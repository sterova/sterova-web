-- =============================================================================
-- Sterova — Production CMS Full Reset
-- Complete replacement schema for dynamic Supabase-managed content only.
-- WARNING: Running this file drops and recreates all Sterova public tables.
-- =============================================================================

create extension if not exists "pgcrypto";

-- Drop obsolete/local-content tables first.
drop table if exists public.navigation_items cascade;
drop table if exists public.services cascade;
drop table if exists public.faqs cascade;
drop table if exists public.testimonials cascade;
drop table if exists public.site_settings cascade;
drop table if exists public.job_applications cascade;
drop table if exists public.blog_posts cascade;
drop table if exists public.blog_categories cascade;
drop table if exists public.product_images cascade;
drop table if exists public.products cascade;
drop table if exists public.project_images cascade;
drop table if exists public.portfolio_items cascade;
drop table if exists public.reviews cascade;
drop table if exists public.contact_messages cascade;
drop table if exists public.contact_information cascade;
drop table if exists public.newsletter_subscribers cascade;
drop table if exists public.audit_logs cascade;
drop table if exists public.admin_users cascade;
drop function if exists public.set_updated_at() cascade;
drop function if exists public.is_admin() cascade;

create function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.admin_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  email text not null unique check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  role text not null default 'admin' check (role in ('admin','super_admin')),
  created_at timestamptz not null default now()
);

create function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admin_users where user_id = auth.uid());
$$;

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  actor_id uuid references auth.users(id) on delete set null,
  actor_email text,
  action text not null check (char_length(action) <= 120),
  resource text check (char_length(resource) <= 120),
  resource_id text,
  metadata jsonb not null default '{}'::jsonb
);

create table public.portfolio_items (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  title text not null check (char_length(title) between 2 and 180),
  category text not null check (char_length(category) <= 120),
  description text not null check (char_length(description) between 20 and 2000),
  tags text[] not null default '{}',
  image_url text,
  live_url text,
  github_url text,
  is_featured boolean not null default false,
  is_active boolean not null default true,
  display_order integer not null default 0
);

create table public.project_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.portfolio_items(id) on delete cascade,
  storage_path text not null unique,
  alt text not null default '',
  width integer check (width is null or width > 0),
  height integer check (height is null or height > 0),
  created_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  name text not null check (char_length(name) between 2 and 180),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  excerpt text not null check (char_length(excerpt) <= 400),
  description text not null,
  cover_image_url text,
  website_url text,
  status text not null default 'active' check (status in ('draft','active','archived')),
  display_order integer not null default 0
);

create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  storage_path text not null unique,
  alt text not null default '',
  width integer check (width is null or width > 0),
  height integer check (height is null or height > 0),
  created_at timestamptz not null default now()
);

create table public.blog_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique check (char_length(name) between 2 and 80),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  description text check (char_length(description) <= 300)
);

create table public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  title text not null check (char_length(title) between 2 and 180),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  excerpt text not null check (char_length(excerpt) <= 400),
  content text not null,
  cover_image_url text,
  category text not null,
  category_id uuid references public.blog_categories(id) on delete set null,
  tags text[] not null default '{}',
  author_name text not null default 'Sterova Team',
  author_avatar_url text,
  published boolean not null default false,
  published_at timestamptz,
  read_time_minutes integer not null default 3 check (read_time_minutes > 0),
  views integer not null default 0 check (views >= 0)
);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null default 'Anonymous' check (char_length(name) <= 100),
  content text not null check (char_length(content) between 10 and 2000),
  rating integer not null check (rating between 1 and 5),
  approved boolean not null default false,
  ip_address text check (char_length(ip_address) <= 100)
);

create table public.contact_information (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  value text not null,
  href text,
  display_order integer not null default 0,
  is_active boolean not null default true
);

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) <= 200),
  email text not null check (char_length(email) <= 320),
  company text check (char_length(company) <= 200),
  service text check (char_length(service) <= 200),
  budget text check (char_length(budget) <= 100),
  message text not null check (char_length(message) between 10 and 5000),
  status text not null default 'new' check (status in ('new','read','replied','archived')),
  ip_address text,
  user_agent text
);

create table public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null unique check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  active boolean not null default true,
  source text check (char_length(source) <= 100)
);

-- Triggers
create trigger portfolio_items_updated_at before update on public.portfolio_items for each row execute function public.set_updated_at();
create trigger products_updated_at before update on public.products for each row execute function public.set_updated_at();
create trigger blog_posts_updated_at before update on public.blog_posts for each row execute function public.set_updated_at();

-- Indexes tuned for public reads and CMS lists.
create index portfolio_active_order_idx on public.portfolio_items (display_order, created_at desc) where is_active;
create index portfolio_featured_idx on public.portfolio_items (display_order) where is_active and is_featured;
create index products_active_order_idx on public.products (display_order, created_at desc) where status = 'active';
create index blog_published_idx on public.blog_posts (published_at desc) where published;
create index blog_category_idx on public.blog_posts (category_id) where published;
create index reviews_approved_newest_idx on public.reviews (created_at desc) where approved;
create index contact_messages_status_idx on public.contact_messages (status, created_at desc);
create index audit_logs_created_idx on public.audit_logs (created_at desc);

-- RLS
alter table public.admin_users enable row level security;
alter table public.audit_logs enable row level security;
alter table public.portfolio_items enable row level security;
alter table public.project_images enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.blog_categories enable row level security;
alter table public.blog_posts enable row level security;
alter table public.reviews enable row level security;
alter table public.contact_information enable row level security;
alter table public.contact_messages enable row level security;
alter table public.newsletter_subscribers enable row level security;

create policy admin_users_admin_read on public.admin_users for select using (public.is_admin());
create policy admin_users_service_all on public.admin_users using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

create policy admin_all_audit on public.audit_logs using (public.is_admin() or auth.role() = 'service_role') with check (public.is_admin() or auth.role() = 'service_role');

create policy public_read_projects on public.portfolio_items for select using (is_active);
create policy admin_all_projects on public.portfolio_items using (public.is_admin() or auth.role() = 'service_role') with check (public.is_admin() or auth.role() = 'service_role');
create policy public_read_project_images on public.project_images for select using (true);
create policy admin_all_project_images on public.project_images using (public.is_admin() or auth.role() = 'service_role') with check (public.is_admin() or auth.role() = 'service_role');

create policy public_read_products on public.products for select using (status = 'active');
create policy admin_all_products on public.products using (public.is_admin() or auth.role() = 'service_role') with check (public.is_admin() or auth.role() = 'service_role');
create policy public_read_product_images on public.product_images for select using (true);
create policy admin_all_product_images on public.product_images using (public.is_admin() or auth.role() = 'service_role') with check (public.is_admin() or auth.role() = 'service_role');

create policy public_read_blog_categories on public.blog_categories for select using (true);
create policy admin_all_blog_categories on public.blog_categories using (public.is_admin() or auth.role() = 'service_role') with check (public.is_admin() or auth.role() = 'service_role');
create policy public_read_published_blogs on public.blog_posts for select using (published);
create policy admin_all_blogs on public.blog_posts using (public.is_admin() or auth.role() = 'service_role') with check (public.is_admin() or auth.role() = 'service_role');

create policy public_read_approved_reviews on public.reviews for select using (approved);
create policy public_insert_reviews on public.reviews for insert with check (true);
create policy admin_all_reviews on public.reviews using (public.is_admin() or auth.role() = 'service_role') with check (public.is_admin() or auth.role() = 'service_role');

create policy public_read_contact_info on public.contact_information for select using (is_active);
create policy admin_all_contact_info on public.contact_information using (public.is_admin() or auth.role() = 'service_role') with check (public.is_admin() or auth.role() = 'service_role');
create policy service_all_contact_messages on public.contact_messages using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy service_all_newsletter on public.newsletter_subscribers using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

-- Storage bucket and policies for CMS uploads.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('cms-images', 'cms-images', true, 5242880, array['image/jpeg','image/png','image/webp','image/gif'])
on conflict (id) do update set public = true, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists public_read_cms_images on storage.objects;
drop policy if exists admin_insert_cms_images on storage.objects;
drop policy if exists admin_update_cms_images on storage.objects;
drop policy if exists admin_delete_cms_images on storage.objects;
create policy public_read_cms_images on storage.objects for select using (bucket_id = 'cms-images');
create policy admin_insert_cms_images on storage.objects for insert with check (bucket_id = 'cms-images' and public.is_admin());
create policy admin_update_cms_images on storage.objects for update using (bucket_id = 'cms-images' and public.is_admin()) with check (bucket_id = 'cms-images' and public.is_admin());
create policy admin_delete_cms_images on storage.objects for delete using (bucket_id = 'cms-images' and public.is_admin());
