-- ============================================================================
-- Sterova CMS — admin session management
--
-- Tracks one row per Supabase auth session belonging to a CMS administrator so
-- the panel can list who is currently signed in and remotely revoke access.
--
-- Enforcement is server-side: is_admin() (used by every CMS RLS policy) now
-- returns false for a revoked session, so a revoked browser instantly loses
-- read/write access even before its access token expires.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- admin_sessions
-- ---------------------------------------------------------------------------
create table if not exists public.admin_sessions (
  session_id   uuid primary key,
  user_id      uuid not null references auth.users (id) on delete cascade,
  email        text not null,
  user_agent   text,
  created_at   timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  revoked_at   timestamptz,
  revoked_by   uuid references auth.users (id) on delete set null
);

create index if not exists admin_sessions_user_id_idx on public.admin_sessions (user_id);
create index if not exists admin_sessions_last_seen_idx on public.admin_sessions (last_seen_at desc);

-- PostgREST needs explicit grants; writes only ever happen through the
-- SECURITY DEFINER functions below, so authenticated gets SELECT only.
grant select on public.admin_sessions to authenticated;
grant all on public.admin_sessions to service_role;

alter table public.admin_sessions enable row level security;

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------

-- The Supabase access token carries the session it was minted for.
create or replace function public.current_session_id()
returns uuid
language sql
stable
as $$
  select nullif(auth.jwt() ->> 'session_id', '')::uuid;
$$;

-- Raw allowlist membership, independent of session state. Kept separate so
-- is_admin() can layer revocation on top without recursing.
create or replace function public.is_admin_user()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (select 1 from public.admin_users where user_id = auth.uid());
$$;

revoke execute on function public.is_admin_user() from public;
grant execute on function public.is_admin_user() to authenticated;

-- is_admin() now also fails closed for a revoked session. Every CMS policy
-- already calls this, so revocation applies to the whole panel at once.
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (select 1 from public.admin_users where user_id = auth.uid())
     and not exists (
       select 1
       from public.admin_sessions
       where session_id = public.current_session_id()
         and revoked_at is not null
     );
$$;

revoke execute on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Policies — admins read the session list; all writes go through RPCs
-- ---------------------------------------------------------------------------
drop policy if exists "admins read admin_sessions" on public.admin_sessions;
create policy "admins read admin_sessions"
  on public.admin_sessions for select
  to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- record_admin_session — heartbeat called by the CMS on sign-in and on an
-- interval. Returns false once the session has been revoked, which is the
-- signal for the browser to sign itself out.
-- ---------------------------------------------------------------------------
create or replace function public.record_admin_session(p_user_agent text default null)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_session uuid := public.current_session_id();
  v_user    uuid := auth.uid();
  v_revoked timestamptz;
begin
  if v_user is null or v_session is null then
    return false;
  end if;

  if not public.is_admin_user() then
    return false;
  end if;

  insert into public.admin_sessions (session_id, user_id, email, user_agent)
  values (
    v_session,
    v_user,
    coalesce((select email from public.admin_users where user_id = v_user), ''),
    left(coalesce(p_user_agent, ''), 400)
  )
  on conflict (session_id) do update
    -- Never resurrect a revoked session.
    set last_seen_at = case when public.admin_sessions.revoked_at is null
                            then now() else public.admin_sessions.last_seen_at end,
        user_agent   = coalesce(excluded.user_agent, public.admin_sessions.user_agent)
  returning revoked_at into v_revoked;

  return v_revoked is null;
end;
$$;

revoke execute on function public.record_admin_session(text) from public;
grant execute on function public.record_admin_session(text) to authenticated;

-- ---------------------------------------------------------------------------
-- revoke_admin_session — remote logout of a single session
-- ---------------------------------------------------------------------------
create or replace function public.revoke_admin_session(p_session_id uuid)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count integer;
begin
  if not public.is_admin() then
    raise exception 'not authorised';
  end if;

  update public.admin_sessions
     set revoked_at = now(),
         revoked_by = auth.uid()
   where session_id = p_session_id
     and revoked_at is null;

  get diagnostics v_count = row_count;
  return v_count;
end;
$$;

revoke execute on function public.revoke_admin_session(uuid) from public;
grant execute on function public.revoke_admin_session(uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- revoke_admin_user_sessions — remote logout of every session for an account,
-- optionally keeping the caller's own session alive.
-- ---------------------------------------------------------------------------
create or replace function public.revoke_admin_user_sessions(
  p_user_id uuid,
  p_keep_current boolean default false
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count integer;
begin
  if not public.is_admin() then
    raise exception 'not authorised';
  end if;

  update public.admin_sessions
     set revoked_at = now(),
         revoked_by = auth.uid()
   where user_id = p_user_id
     and revoked_at is null
     and (not p_keep_current or session_id is distinct from public.current_session_id());

  get diagnostics v_count = row_count;
  return v_count;
end;
$$;

revoke execute on function public.revoke_admin_user_sessions(uuid, boolean) from public;
grant execute on function public.revoke_admin_user_sessions(uuid, boolean) to authenticated;

-- ---------------------------------------------------------------------------
-- prune_admin_sessions — housekeeping for stale rows (safe to call anytime)
-- ---------------------------------------------------------------------------
create or replace function public.prune_admin_sessions()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count integer;
begin
  if not public.is_admin() then
    raise exception 'not authorised';
  end if;

  delete from public.admin_sessions
   where last_seen_at < now() - interval '30 days';

  get diagnostics v_count = row_count;
  return v_count;
end;
$$;

revoke execute on function public.prune_admin_sessions() from public;
grant execute on function public.prune_admin_sessions() to authenticated;
