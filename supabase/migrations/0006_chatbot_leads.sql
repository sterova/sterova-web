-- ─────────────────────────────────────────────────────────────────────────────
-- 0006_chatbot_leads.sql — Chatbot quote requests
--
-- Creates public.chatbot_leads (status + internal notes).
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
-- chatbot_leads — quote requests captured in the chat
-- ═══════════════════════════════════════════════════════════════════════════
create table if not exists public.chatbot_leads (
  id          uuid primary key default gen_random_uuid(),
  name        text        not null,
  email       text        not null,
  phone       text,
  company     text,
  service     text,
  timeline    text,
  message     text        not null,
  source_node text,
  page_url    text,
  session_id  text,
  status      text        not null default 'new'
              check (status in ('new','contacted','qualified','won','lost','spam')),
  admin_notes text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

grant insert on public.chatbot_leads to anon;
grant select, insert, update, delete on public.chatbot_leads to authenticated;
grant all on public.chatbot_leads to service_role;

alter table public.chatbot_leads enable row level security;

-- Anyone may submit. Nobody but an admin may ever read one back.
drop policy if exists "public submits chatbot lead" on public.chatbot_leads;
create policy "public submits chatbot lead"
  on public.chatbot_leads for insert
  to anon, authenticated
  with check (true);

drop policy if exists "admins read chatbot leads" on public.chatbot_leads;
create policy "admins read chatbot leads"
  on public.chatbot_leads for select
  to authenticated
  using (public.is_admin());

drop policy if exists "admins update chatbot leads" on public.chatbot_leads;
create policy "admins update chatbot leads"
  on public.chatbot_leads for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "admins delete chatbot leads" on public.chatbot_leads;
create policy "admins delete chatbot leads"
  on public.chatbot_leads for delete
  to authenticated
  using (public.is_admin());

create index if not exists chatbot_leads_created_at_idx on public.chatbot_leads (created_at desc);
create index if not exists chatbot_leads_status_idx     on public.chatbot_leads (status);

drop trigger if exists chatbot_leads_set_updated_at on public.chatbot_leads;
create trigger chatbot_leads_set_updated_at
  before update on public.chatbot_leads
  for each row execute function public.set_updated_at();
