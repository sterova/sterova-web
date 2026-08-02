-- ─────────────────────────────────────────────────────────────────────────────
-- 0007_consultation_bookings.sql — Consultation bookings
--
-- Creates public.consultation_bookings (preferred date/time, meeting status).
--
-- Conventions match supabase/migrations/0001_init.sql:
--   • anyone may INSERT (these surfaces are public)
--   • only admins (public.is_admin()) may read, update or delete
--
-- HOW TO RUN
--   Supabase dashboard → SQL Editor → paste this file → Run.
--   Safe to re-run: every statement is idempotent.
-- ─────────────────────────────────────────────────────────────────────────────

-- ═══════════════════════════════════════════════════════════════════════════
-- consultation_bookings — free 30-minute consultation requests
-- ═══════════════════════════════════════════════════════════════════════════
create table if not exists public.consultation_bookings (
  id             uuid primary key default gen_random_uuid(),
  name           text        not null,
  email          text        not null,
  phone          text        not null,
  topic          text,
  preferred_date date,
  preferred_time text,
  notes          text,
  page_url       text,
  session_id     text,
  status         text        not null default 'pending'
                 check (status in ('pending','confirmed','completed','cancelled','no_show')),
  admin_notes    text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

grant insert on public.consultation_bookings to anon;
grant select, insert, update, delete on public.consultation_bookings to authenticated;
grant all on public.consultation_bookings to service_role;

alter table public.consultation_bookings enable row level security;

drop policy if exists "public books consultation" on public.consultation_bookings;
create policy "public books consultation"
  on public.consultation_bookings for insert
  to anon, authenticated
  with check (true);

drop policy if exists "admins read consultations" on public.consultation_bookings;
create policy "admins read consultations"
  on public.consultation_bookings for select
  to authenticated
  using (public.is_admin());

drop policy if exists "admins update consultations" on public.consultation_bookings;
create policy "admins update consultations"
  on public.consultation_bookings for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "admins delete consultations" on public.consultation_bookings;
create policy "admins delete consultations"
  on public.consultation_bookings for delete
  to authenticated
  using (public.is_admin());

create index if not exists consultation_created_at_idx on public.consultation_bookings (created_at desc);
create index if not exists consultation_status_idx     on public.consultation_bookings (status);

drop trigger if exists consultation_bookings_set_updated_at on public.consultation_bookings;
create trigger consultation_bookings_set_updated_at
  before update on public.consultation_bookings
  for each row execute function public.set_updated_at();
