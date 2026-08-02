-- ─────────────────────────────────────────────────────────────────────────────
-- 0011_phase2.sql — Sterova CMS Phase 2
--
-- Creates: site_settings, testimonials, job_openings, job_applications,
--          admin_notifications, user_roles (+ app_role enum, has_role()),
--          audit_logs
--
-- Conventions follow supabase/migrations/0001_init.sql:
--   • table → GRANTs → enable RLS → policies
--   • public/anon access is read-only (published rows) or INSERT-only
--   • admins are identified by the existing public.is_admin()
--
-- HOW TO RUN
--   Supabase dashboard → SQL Editor → paste this file → Run.
--   Safe to re-run: every statement is idempotent.
-- ─────────────────────────────────────────────────────────────────────────────

-- ═══════════════════════════════════════════════════════════════════════════
-- user_roles — roles live in their own table, never on a profile row
-- ═══════════════════════════════════════════════════════════════════════════
do $$
begin
  if not exists (select 1 from pg_type where typname = 'app_role') then
    create type public.app_role as enum ('super_admin', 'admin', 'editor');
  end if;
end
$$;

create table if not exists public.user_roles (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  role       public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;

alter table public.user_roles enable row level security;

-- Security definer so policies can call it without recursing into user_roles.
create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

revoke execute on function public.has_role(uuid, public.app_role) from public;
grant execute on function public.has_role(uuid, public.app_role) to anon, authenticated;

drop policy if exists "users read own roles" on public.user_roles;
create policy "users read own roles"
  on public.user_roles for select
  to authenticated
  using (user_id = auth.uid() or public.is_admin());

drop policy if exists "super admins manage roles" on public.user_roles;
create policy "super admins manage roles"
  on public.user_roles for all
  to authenticated
  using (public.has_role(auth.uid(), 'super_admin'))
  with check (public.has_role(auth.uid(), 'super_admin'));

-- Grant writes only once a super admin exists; service_role seeds the first one.
grant insert, update, delete on public.user_roles to authenticated;

-- ═══════════════════════════════════════════════════════════════════════════
-- site_settings — one row per settings group, value is JSON
--   groups: 'company' | 'website' | 'features'
-- ═══════════════════════════════════════════════════════════════════════════
create table if not exists public.site_settings (
  key        text primary key,
  value      jsonb       not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

grant select on public.site_settings to anon;
grant select, insert, update on public.site_settings to authenticated;
grant all on public.site_settings to service_role;

alter table public.site_settings enable row level security;

-- Settings drive the public site (maintenance mode, feature toggles), so reads
-- are public. Writes stay admin-only.
drop policy if exists "public reads site settings" on public.site_settings;
create policy "public reads site settings"
  on public.site_settings for select
  to anon, authenticated
  using (true);

drop policy if exists "admins upsert site settings" on public.site_settings;
create policy "admins upsert site settings"
  on public.site_settings for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "admins update site settings" on public.site_settings;
create policy "admins update site settings"
  on public.site_settings for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop trigger if exists site_settings_updated_at on public.site_settings;
create trigger site_settings_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();

insert into public.site_settings (key, value) values
  ('company', '{}'::jsonb),
  ('website', '{"maintenance_mode": false, "maintenance_message": "Sterova is undergoing scheduled maintenance. We will be back shortly."}'::jsonb),
  ('features', '{"chatbot": true, "estimator": true, "reviews": true, "blog": true, "careers": true}'::jsonb)
on conflict (key) do nothing;

-- ═══════════════════════════════════════════════════════════════════════════
-- testimonials — curated client quotes (separate from public `reviews`)
-- ═══════════════════════════════════════════════════════════════════════════
create table if not exists public.testimonials (
  id            uuid primary key default gen_random_uuid(),
  name          text        not null,
  role          text,
  company       text,
  content       text        not null,
  rating        int         not null default 5 check (rating between 1 and 5),
  avatar_url    text,
  is_published  boolean     not null default false,
  is_featured   boolean     not null default false,
  display_order int         not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

grant select on public.testimonials to anon;
grant select, insert, update, delete on public.testimonials to authenticated;
grant all on public.testimonials to service_role;

alter table public.testimonials enable row level security;

drop policy if exists "public reads published testimonials" on public.testimonials;
create policy "public reads published testimonials"
  on public.testimonials for select
  to anon, authenticated
  using (is_published or public.is_admin());

drop policy if exists "admins insert testimonials" on public.testimonials;
create policy "admins insert testimonials"
  on public.testimonials for insert
  to authenticated with check (public.is_admin());

drop policy if exists "admins update testimonials" on public.testimonials;
create policy "admins update testimonials"
  on public.testimonials for update
  to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admins delete testimonials" on public.testimonials;
create policy "admins delete testimonials"
  on public.testimonials for delete
  to authenticated using (public.is_admin());

drop trigger if exists testimonials_updated_at on public.testimonials;
create trigger testimonials_updated_at
  before update on public.testimonials
  for each row execute function public.set_updated_at();

-- ═══════════════════════════════════════════════════════════════════════════
-- job_openings + job_applications
-- ═══════════════════════════════════════════════════════════════════════════
create table if not exists public.job_openings (
  id             uuid primary key default gen_random_uuid(),
  title          text        not null,
  slug           text        not null unique,
  department     text,
  location       text,
  employment_type text       not null default 'full_time'
                 check (employment_type in ('full_time','part_time','contract','internship')),
  experience     text,
  description    text        not null default '',
  requirements   text[]      not null default '{}',
  is_open        boolean     not null default true,
  display_order  int         not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

grant select on public.job_openings to anon;
grant select, insert, update, delete on public.job_openings to authenticated;
grant all on public.job_openings to service_role;

alter table public.job_openings enable row level security;

drop policy if exists "public reads open roles" on public.job_openings;
create policy "public reads open roles"
  on public.job_openings for select
  to anon, authenticated
  using (is_open or public.is_admin());

drop policy if exists "admins insert job openings" on public.job_openings;
create policy "admins insert job openings"
  on public.job_openings for insert
  to authenticated with check (public.is_admin());

drop policy if exists "admins update job openings" on public.job_openings;
create policy "admins update job openings"
  on public.job_openings for update
  to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admins delete job openings" on public.job_openings;
create policy "admins delete job openings"
  on public.job_openings for delete
  to authenticated using (public.is_admin());

drop trigger if exists job_openings_updated_at on public.job_openings;
create trigger job_openings_updated_at
  before update on public.job_openings
  for each row execute function public.set_updated_at();

create table if not exists public.job_applications (
  id          uuid primary key default gen_random_uuid(),
  job_id      uuid references public.job_openings(id) on delete set null,
  job_title   text,
  name        text        not null,
  email       text        not null,
  phone       text,
  portfolio_url text,
  resume_url  text,
  cover_letter text       not null default '',
  status      text        not null default 'new'
              check (status in ('new','screening','interview','offer','hired','rejected')),
  admin_notes text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

grant insert on public.job_applications to anon;
grant select, insert, update, delete on public.job_applications to authenticated;
grant all on public.job_applications to service_role;

alter table public.job_applications enable row level security;

drop policy if exists "public submits application" on public.job_applications;
create policy "public submits application"
  on public.job_applications for insert
  to anon, authenticated with check (true);

drop policy if exists "admins read applications" on public.job_applications;
create policy "admins read applications"
  on public.job_applications for select
  to authenticated using (public.is_admin());

drop policy if exists "admins update applications" on public.job_applications;
create policy "admins update applications"
  on public.job_applications for update
  to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admins delete applications" on public.job_applications;
create policy "admins delete applications"
  on public.job_applications for delete
  to authenticated using (public.is_admin());

drop trigger if exists job_applications_updated_at on public.job_applications;
create trigger job_applications_updated_at
  before update on public.job_applications
  for each row execute function public.set_updated_at();

create index if not exists job_applications_status_idx on public.job_applications (status, created_at desc);

-- ═══════════════════════════════════════════════════════════════════════════
-- admin_notifications — in-CMS notification feed
-- ═══════════════════════════════════════════════════════════════════════════
create table if not exists public.admin_notifications (
  id         uuid primary key default gen_random_uuid(),
  kind       text        not null default 'info'
             check (kind in ('info','lead','booking','estimate','application','review','message','system')),
  title      text        not null,
  body       text,
  link       text,
  is_read    boolean     not null default false,
  created_at timestamptz not null default now()
);

grant insert on public.admin_notifications to anon;
grant select, insert, update, delete on public.admin_notifications to authenticated;
grant all on public.admin_notifications to service_role;

alter table public.admin_notifications enable row level security;

-- Public write is needed so anonymous submissions can raise a notification;
-- reads stay admin-only.
drop policy if exists "public raises notification" on public.admin_notifications;
create policy "public raises notification"
  on public.admin_notifications for insert
  to anon, authenticated with check (true);

drop policy if exists "admins read notifications" on public.admin_notifications;
create policy "admins read notifications"
  on public.admin_notifications for select
  to authenticated using (public.is_admin());

drop policy if exists "admins update notifications" on public.admin_notifications;
create policy "admins update notifications"
  on public.admin_notifications for update
  to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admins delete notifications" on public.admin_notifications;
create policy "admins delete notifications"
  on public.admin_notifications for delete
  to authenticated using (public.is_admin());

create index if not exists admin_notifications_created_idx on public.admin_notifications (created_at desc);
create index if not exists admin_notifications_unread_idx  on public.admin_notifications (is_read, created_at desc);

-- ═══════════════════════════════════════════════════════════════════════════
-- audit_logs — append-only record of admin actions
-- ═══════════════════════════════════════════════════════════════════════════
create table if not exists public.audit_logs (
  id          uuid primary key default gen_random_uuid(),
  actor_id    uuid,
  actor_email text,
  action      text        not null,
  entity      text        not null,
  entity_id   text,
  summary     text,
  created_at  timestamptz not null default now()
);

grant select, insert on public.audit_logs to authenticated;
grant all on public.audit_logs to service_role;

alter table public.audit_logs enable row level security;

drop policy if exists "admins read audit logs" on public.audit_logs;
create policy "admins read audit logs"
  on public.audit_logs for select
  to authenticated using (public.is_admin());

drop policy if exists "admins write audit logs" on public.audit_logs;
create policy "admins write audit logs"
  on public.audit_logs for insert
  to authenticated with check (public.is_admin());

create index if not exists audit_logs_created_idx on public.audit_logs (created_at desc);
create index if not exists audit_logs_entity_idx  on public.audit_logs (entity, created_at desc);
