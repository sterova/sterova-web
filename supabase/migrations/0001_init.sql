-- ============================================================================
-- Sterova CMS — initial schema
-- Tables: admin_users, contact_messages, reviews, projects,
--         blog_categories, blog_posts
-- Security model: RLS on every table. Public (anon) gets narrow read access to
-- published content and insert-only access to the two public forms. Everything
-- else requires an authenticated user present in admin_users.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------

-- Generic updated_at maintenance
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- admin_users — allowlist of auth.users permitted into the CMS
-- ---------------------------------------------------------------------------
create table if not exists public.admin_users (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  email      text not null,
  full_name  text,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

-- SECURITY DEFINER so the function can read admin_users without tripping that
-- table's own RLS policies (which would otherwise recurse infinitely).
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.admin_users where user_id = auth.uid()
  );
$$;

revoke execute on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- An admin may read the admin list (used to render "who has access").
drop policy if exists "admins read admin_users" on public.admin_users;
create policy "admins read admin_users"
  on public.admin_users for select
  to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- contact_messages — submissions from the public contact form
-- ---------------------------------------------------------------------------
create table if not exists public.contact_messages (
  id         uuid primary key default gen_random_uuid(),
  name       text not null check (char_length(trim(name)) between 2 and 120),
  email      text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  subject    text check (char_length(subject) <= 200),
  message    text not null check (char_length(trim(message)) between 10 and 5000),
  status     text not null default 'new'
             check (status in ('new', 'read', 'replied', 'archived')),
  admin_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists contact_messages_created_at_idx
  on public.contact_messages (created_at desc);
create index if not exists contact_messages_status_idx
  on public.contact_messages (status);

drop trigger if exists contact_messages_updated_at on public.contact_messages;
create trigger contact_messages_updated_at
  before update on public.contact_messages
  for each row execute function public.set_updated_at();

alter table public.contact_messages enable row level security;

-- Anyone may submit. Nobody but an admin may ever read one back.
drop policy if exists "public submits contact message" on public.contact_messages;
create policy "public submits contact message"
  on public.contact_messages for insert
  to anon, authenticated
  with check (true);

drop policy if exists "admins read contact messages" on public.contact_messages;
create policy "admins read contact messages"
  on public.contact_messages for select
  to authenticated
  using (public.is_admin());

drop policy if exists "admins update contact messages" on public.contact_messages;
create policy "admins update contact messages"
  on public.contact_messages for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "admins delete contact messages" on public.contact_messages;
create policy "admins delete contact messages"
  on public.contact_messages for delete
  to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- reviews — client reviews, admin-moderated before they appear publicly
-- ---------------------------------------------------------------------------
create table if not exists public.reviews (
  id            uuid primary key default gen_random_uuid(),
  name          text not null check (char_length(trim(name)) between 2 and 120),
  email         text check (email is null or email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  role          text check (char_length(role) <= 120),
  company       text check (char_length(company) <= 120),
  content       text not null check (char_length(trim(content)) between 20 and 1000),
  rating        smallint not null check (rating between 1 and 5),
  status        text not null default 'pending'
                check (status in ('pending', 'approved', 'rejected')),
  is_featured   boolean not null default false,
  display_order integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists reviews_status_idx on public.reviews (status);
create index if not exists reviews_public_idx
  on public.reviews (status, display_order, created_at desc);

drop trigger if exists reviews_updated_at on public.reviews;
create trigger reviews_updated_at
  before update on public.reviews
  for each row execute function public.set_updated_at();

alter table public.reviews enable row level security;

-- Public submissions are forced to land as 'pending' and unfeatured, so a
-- crafted request cannot self-approve a review onto the live site.
drop policy if exists "public submits review" on public.reviews;
create policy "public submits review"
  on public.reviews for insert
  to anon, authenticated
  with check (status = 'pending' and is_featured = false);

drop policy if exists "public reads approved reviews" on public.reviews;
create policy "public reads approved reviews"
  on public.reviews for select
  to anon, authenticated
  using (status = 'approved');

drop policy if exists "admins read all reviews" on public.reviews;
create policy "admins read all reviews"
  on public.reviews for select
  to authenticated
  using (public.is_admin());

drop policy if exists "admins update reviews" on public.reviews;
create policy "admins update reviews"
  on public.reviews for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "admins delete reviews" on public.reviews;
create policy "admins delete reviews"
  on public.reviews for delete
  to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- projects — portfolio / capability examples
-- ---------------------------------------------------------------------------
create table if not exists public.projects (
  id            uuid primary key default gen_random_uuid(),
  title         text not null check (char_length(trim(title)) between 2 and 200),
  slug          text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  category      text not null default 'General',
  description   text not null default '',
  tags          text[] not null default '{}',
  image_url     text,
  live_url      text,
  github_url    text,
  is_featured   boolean not null default false,
  is_active     boolean not null default true,
  display_order integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists projects_public_idx
  on public.projects (is_active, display_order);

drop trigger if exists projects_updated_at on public.projects;
create trigger projects_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

alter table public.projects enable row level security;

drop policy if exists "public reads active projects" on public.projects;
create policy "public reads active projects"
  on public.projects for select
  to anon, authenticated
  using (is_active = true);

drop policy if exists "admins read all projects" on public.projects;
create policy "admins read all projects"
  on public.projects for select
  to authenticated
  using (public.is_admin());

drop policy if exists "admins insert projects" on public.projects;
create policy "admins insert projects"
  on public.projects for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "admins update projects" on public.projects;
create policy "admins update projects"
  on public.projects for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "admins delete projects" on public.projects;
create policy "admins delete projects"
  on public.projects for delete
  to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- blog_categories
-- ---------------------------------------------------------------------------
create table if not exists public.blog_categories (
  id            uuid primary key default gen_random_uuid(),
  name          text not null unique check (char_length(trim(name)) between 2 and 60),
  slug          text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  description   text,
  display_order integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

drop trigger if exists blog_categories_updated_at on public.blog_categories;
create trigger blog_categories_updated_at
  before update on public.blog_categories
  for each row execute function public.set_updated_at();

alter table public.blog_categories enable row level security;

drop policy if exists "public reads blog categories" on public.blog_categories;
create policy "public reads blog categories"
  on public.blog_categories for select
  to anon, authenticated
  using (true);

drop policy if exists "admins insert blog categories" on public.blog_categories;
create policy "admins insert blog categories"
  on public.blog_categories for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "admins update blog categories" on public.blog_categories;
create policy "admins update blog categories"
  on public.blog_categories for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "admins delete blog categories" on public.blog_categories;
create policy "admins delete blog categories"
  on public.blog_categories for delete
  to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- blog_posts
-- ---------------------------------------------------------------------------
create table if not exists public.blog_posts (
  id                uuid primary key default gen_random_uuid(),
  title             text not null check (char_length(trim(title)) between 2 and 200),
  slug              text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  excerpt           text not null default '',
  content           text not null default '',
  cover_image_url   text,
  category_id       uuid references public.blog_categories (id) on delete set null,
  tags              text[] not null default '{}',
  author_name       text not null default 'Sterova Team',
  author_avatar_url text,
  published         boolean not null default false,
  published_at      timestamptz,
  read_time_minutes integer not null default 1 check (read_time_minutes > 0),
  views             integer not null default 0,
  seo_title         text check (char_length(seo_title) <= 200),
  seo_description   text check (char_length(seo_description) <= 400),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists blog_posts_public_idx
  on public.blog_posts (published, published_at desc);
create index if not exists blog_posts_category_idx
  on public.blog_posts (category_id);

drop trigger if exists blog_posts_updated_at on public.blog_posts;
create trigger blog_posts_updated_at
  before update on public.blog_posts
  for each row execute function public.set_updated_at();

alter table public.blog_posts enable row level security;

-- Drafts are invisible to the public at the database level, not just the UI.
drop policy if exists "public reads published posts" on public.blog_posts;
create policy "public reads published posts"
  on public.blog_posts for select
  to anon, authenticated
  using (published = true);

drop policy if exists "admins read all posts" on public.blog_posts;
create policy "admins read all posts"
  on public.blog_posts for select
  to authenticated
  using (public.is_admin());

drop policy if exists "admins insert posts" on public.blog_posts;
create policy "admins insert posts"
  on public.blog_posts for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "admins update posts" on public.blog_posts;
create policy "admins update posts"
  on public.blog_posts for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "admins delete posts" on public.blog_posts;
create policy "admins delete posts"
  on public.blog_posts for delete
  to authenticated
  using (public.is_admin());

-- View counter. Anon has no UPDATE grant on blog_posts, so incrementing runs
-- through this narrowly-scoped SECURITY DEFINER function instead.
create or replace function public.increment_post_views(p_slug text)
returns void
language sql
security definer
set search_path = public
as $$
  update public.blog_posts
     set views = views + 1
   where slug = p_slug
     and published = true;
$$;

revoke execute on function public.increment_post_views(text) from public;
grant execute on function public.increment_post_views(text) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Storage buckets — public read, admin-only write
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('blog-media', 'blog-media', true)
on conflict (id) do update set public = true;

insert into storage.buckets (id, name, public)
values ('project-media', 'project-media', true)
on conflict (id) do update set public = true;

drop policy if exists "public reads media" on storage.objects;
create policy "public reads media"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id in ('blog-media', 'project-media'));

drop policy if exists "admins upload media" on storage.objects;
create policy "admins upload media"
  on storage.objects for insert
  to authenticated
  with check (bucket_id in ('blog-media', 'project-media') and public.is_admin());

drop policy if exists "admins update media" on storage.objects;
create policy "admins update media"
  on storage.objects for update
  to authenticated
  using (bucket_id in ('blog-media', 'project-media') and public.is_admin());

drop policy if exists "admins delete media" on storage.objects;
create policy "admins delete media"
  on storage.objects for delete
  to authenticated
  using (bucket_id in ('blog-media', 'project-media') and public.is_admin());
