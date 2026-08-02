-- ─────────────────────────────────────────────────────────────────────────────
-- 0009_chatbot_events.sql — Chatbot analytics events
--
-- Creates public.chatbot_events plus the aggregate views the Chat Analytics dashboard reads.
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
-- chatbot_events — anonymous conversation analytics (no personal data)
-- ═══════════════════════════════════════════════════════════════════════════
create table if not exists public.chatbot_events (
  id         uuid primary key default gen_random_uuid(),
  session_id text        not null,
  event_type text        not null,
  value      text,
  page_url   text,
  created_at timestamptz not null default now()
);

grant insert on public.chatbot_events to anon;
grant select, insert, delete on public.chatbot_events to authenticated;
grant all on public.chatbot_events to service_role;

alter table public.chatbot_events enable row level security;

drop policy if exists "public records chatbot event" on public.chatbot_events;
create policy "public records chatbot event"
  on public.chatbot_events for insert
  to anon, authenticated
  with check (true);

drop policy if exists "admins read chatbot events" on public.chatbot_events;
create policy "admins read chatbot events"
  on public.chatbot_events for select
  to authenticated
  using (public.is_admin());

drop policy if exists "admins delete chatbot events" on public.chatbot_events;
create policy "admins delete chatbot events"
  on public.chatbot_events for delete
  to authenticated
  using (public.is_admin());

create index if not exists chatbot_events_session_idx    on public.chatbot_events (session_id);
create index if not exists chatbot_events_type_idx       on public.chatbot_events (event_type);
create index if not exists chatbot_events_created_at_idx on public.chatbot_events (created_at desc);

-- ═══════════════════════════════════════════════════════════════════════════
-- Aggregate views for the Chat Analytics dashboard
--
-- security_invoker keeps the caller's RLS in force, so only admins (who alone
-- hold SELECT on chatbot_events) can read them.
-- ═══════════════════════════════════════════════════════════════════════════

-- Daily activity: events and distinct conversations per day.
create or replace view public.chatbot_daily_activity
  with (security_invoker = true) as
select
  date_trunc('day', created_at)::date as day,
  count(*)                            as events,
  count(distinct session_id)          as sessions
from public.chatbot_events
group by 1
order by 1 desc;

-- Event-type breakdown: how often each tracked interaction happens.
create or replace view public.chatbot_event_totals
  with (security_invoker = true) as
select
  event_type,
  count(*)                   as events,
  count(distinct session_id) as sessions
from public.chatbot_events
group by 1
order by 2 desc;

-- Top values per event type — powers "top menu items", "top service",
-- "top CTA" and "FAQ popularity" without shipping every raw row.
create or replace view public.chatbot_top_values
  with (security_invoker = true) as
select
  event_type,
  value,
  count(*)                   as events,
  count(distinct session_id) as sessions
from public.chatbot_events
where value is not null and value <> ''
group by 1, 2
order by 3 desc;

-- Conversation funnel: one row per session with the signals the dashboard
-- turns into completion and drop-off rates.
create or replace view public.chatbot_session_summary
  with (security_invoker = true) as
select
  session_id,
  min(created_at)                                            as started_at,
  max(created_at)                                            as last_event_at,
  count(*)                                                   as events,
  count(*) filter (where event_type = 'node_viewed')         as nodes_viewed,
  count(*) filter (where event_type = 'form_started')  > 0   as started_form,
  count(*) filter (where event_type = 'form_submitted') > 0  as completed_form,
  count(*) filter (where event_type = 'cta_clicked')   > 0   as clicked_cta,
  count(*) filter (where event_type = 'fallback')            as fallbacks
from public.chatbot_events
group by 1;

grant select on public.chatbot_daily_activity  to authenticated;
grant select on public.chatbot_event_totals    to authenticated;
grant select on public.chatbot_top_values      to authenticated;
grant select on public.chatbot_session_summary to authenticated;
grant select on public.chatbot_daily_activity,
                public.chatbot_event_totals,
                public.chatbot_top_values,
                public.chatbot_session_summary to service_role;
