-- =============================================================================
-- Reviews table
-- =============================================================================
-- Run this in your Supabase SQL Editor after 001_initial_schema.sql

create table if not exists public.reviews (
  id           uuid primary key default uuid_generate_v4(),
  created_at   timestamptz not null default now(),
  name         text not null default 'Anonymous' check (char_length(name) <= 100),
  content      text not null check (char_length(content) between 10 and 2000),
  rating       integer not null default 5 check (rating between 1 and 5),
  approved     boolean not null default true,
  ip_address   text check (char_length(ip_address) <= 100)
);

alter table public.reviews enable row level security;

-- Public can read approved reviews
create policy "public_read_approved" on public.reviews
  for select using (approved = true);

-- Public can insert (rate-limited at API level)
create policy "public_insert" on public.reviews
  for insert with check (
    char_length(name) <= 100 and
    char_length(content) between 10 and 2000 and
    rating between 1 and 5
  );

-- Service role can do everything (moderation via Supabase dashboard)
create policy "service_role_all" on public.reviews
  using (auth.role() = 'service_role');

create index if not exists reviews_created_at_idx
  on public.reviews (created_at desc)
  where approved = true;
