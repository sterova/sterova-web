-- ============================================================================
-- Sterova CMS — Results (site_stats) + Team (team_members)
-- Same security model as 0001: RLS everywhere, anon reads only active rows,
-- every write requires public.is_admin().
-- ============================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- site_stats — the "Results that speak for themselves" metrics
-- ---------------------------------------------------------------------------
create table if not exists public.site_stats (
  id            uuid primary key default gen_random_uuid(),
  title         text not null check (char_length(trim(title)) between 2 and 120),
  value         text not null check (char_length(trim(value)) between 1 and 24),
  description   text check (char_length(description) <= 400),
  display_order integer not null default 0,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Duplicate detection at the database level (case-insensitive metric title).
create unique index if not exists site_stats_title_unique
  on public.site_stats (lower(trim(title)));

create index if not exists site_stats_public_idx
  on public.site_stats (is_active, display_order);

drop trigger if exists site_stats_updated_at on public.site_stats;
create trigger site_stats_updated_at
  before update on public.site_stats
  for each row execute function public.set_updated_at();

alter table public.site_stats enable row level security;

grant select on public.site_stats to anon;
grant select, insert, update, delete on public.site_stats to authenticated;

drop policy if exists "public reads active stats" on public.site_stats;
create policy "public reads active stats"
  on public.site_stats for select
  to anon, authenticated
  using (is_active);

drop policy if exists "admins read all stats" on public.site_stats;
create policy "admins read all stats"
  on public.site_stats for select
  to authenticated
  using (public.is_admin());

drop policy if exists "admins insert stats" on public.site_stats;
create policy "admins insert stats"
  on public.site_stats for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "admins update stats" on public.site_stats;
create policy "admins update stats"
  on public.site_stats for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "admins delete stats" on public.site_stats;
create policy "admins delete stats"
  on public.site_stats for delete
  to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- team_members — "The people behind the work"
-- links is a jsonb object: { "linkedin": "https://…", "email": "a@b.c", … }
-- plus an optional "custom" array of { label, url } entries.
-- ---------------------------------------------------------------------------
create table if not exists public.team_members (
  id            uuid primary key default gen_random_uuid(),
  full_name     text not null check (char_length(trim(full_name)) between 2 and 120),
  position      text not null check (char_length(trim(position)) between 2 and 120),
  bio           text check (char_length(bio) <= 800),
  photo_url     text,
  links         jsonb not null default '{}'::jsonb,
  display_order integer not null default 0,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  constraint team_members_links_is_object check (jsonb_typeof(links) = 'object')
);

create unique index if not exists team_members_name_unique
  on public.team_members (lower(trim(full_name)));

create index if not exists team_members_public_idx
  on public.team_members (is_active, display_order);

drop trigger if exists team_members_updated_at on public.team_members;
create trigger team_members_updated_at
  before update on public.team_members
  for each row execute function public.set_updated_at();

alter table public.team_members enable row level security;

grant select on public.team_members to anon;
grant select, insert, update, delete on public.team_members to authenticated;

drop policy if exists "public reads active team" on public.team_members;
create policy "public reads active team"
  on public.team_members for select
  to anon, authenticated
  using (is_active);

drop policy if exists "admins read all team" on public.team_members;
create policy "admins read all team"
  on public.team_members for select
  to authenticated
  using (public.is_admin());

drop policy if exists "admins insert team" on public.team_members;
create policy "admins insert team"
  on public.team_members for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "admins update team" on public.team_members;
create policy "admins update team"
  on public.team_members for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "admins delete team" on public.team_members;
create policy "admins delete team"
  on public.team_members for delete
  to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- Storage bucket for team photos (public read, admin-only writes — the
-- storage.objects policies from 0001 already cover admin writes for any
-- bucket, so only the bucket row is needed here).
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('team-media', 'team-media', true)
on conflict (id) do nothing;

-- Re-declare the media policies so they also cover 'team-media'.
drop policy if exists "public reads media" on storage.objects;
create policy "public reads media"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id in ('blog-media', 'project-media', 'team-media'));

drop policy if exists "admins upload media" on storage.objects;
create policy "admins upload media"
  on storage.objects for insert
  to authenticated
  with check (bucket_id in ('blog-media', 'project-media', 'team-media') and public.is_admin());

drop policy if exists "admins update media" on storage.objects;
create policy "admins update media"
  on storage.objects for update
  to authenticated
  using (bucket_id in ('blog-media', 'project-media', 'team-media') and public.is_admin());

drop policy if exists "admins delete media" on storage.objects;
create policy "admins delete media"
  on storage.objects for delete
  to authenticated
  using (bucket_id in ('blog-media', 'project-media', 'team-media') and public.is_admin());
