-- ─────────────────────────────────────────────────────────────────────────────
-- 0008_estimator_submissions.sql — Project Estimator (/estimate) submissions
--
-- Same conventions as 0001_init.sql / 0006_chatbot_leads.sql:
--   • anyone may INSERT (the estimator is public)
--   • only admins (public.is_admin()) may read, update or delete
--
-- HOW TO RUN
--   Supabase dashboard → SQL Editor → paste this file → Run.
--   Safe to re-run: every statement is idempotent.
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.estimator_submissions (
  id             uuid primary key default gen_random_uuid(),
  name           text,
  email          text        not null,
  phone          text,
  project_type   text        not null,
  features       text[]      not null default '{}',
  design_need    text,
  timeline_pref  text,
  estimate_cost  text,
  estimate_weeks text,
  page_url       text,
  status         text        not null default 'new'
                 check (status in ('new','contacted','qualified','won','lost','spam')),
  admin_notes    text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

grant insert on public.estimator_submissions to anon;
grant select, insert, update, delete on public.estimator_submissions to authenticated;
grant all on public.estimator_submissions to service_role;

alter table public.estimator_submissions enable row level security;

drop policy if exists "public submits estimate" on public.estimator_submissions;
create policy "public submits estimate"
  on public.estimator_submissions for insert
  to anon, authenticated
  with check (true);

drop policy if exists "admins read estimates" on public.estimator_submissions;
create policy "admins read estimates"
  on public.estimator_submissions for select
  to authenticated
  using (public.is_admin());

drop policy if exists "admins update estimates" on public.estimator_submissions;
create policy "admins update estimates"
  on public.estimator_submissions for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "admins delete estimates" on public.estimator_submissions;
create policy "admins delete estimates"
  on public.estimator_submissions for delete
  to authenticated
  using (public.is_admin());

create index if not exists estimator_submissions_created_at_idx
  on public.estimator_submissions (created_at desc);
create index if not exists estimator_submissions_status_idx
  on public.estimator_submissions (status);

drop trigger if exists estimator_submissions_set_updated_at on public.estimator_submissions;
create trigger estimator_submissions_set_updated_at
  before update on public.estimator_submissions
  for each row execute function public.set_updated_at();
