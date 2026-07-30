-- ─────────────────────────────────────────────────────────────────────────────
-- 0005 · Brand links — social, contact, and professional links managed via CMS
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.brand_links (
  id            uuid primary key default gen_random_uuid(),
  category      text not null check (category in ('social', 'contact')),
  key           text not null unique,
  label         text not null,
  value         text not null default '',
  href          text,
  description   text,
  icon_key      text,
  display_order integer not null default 0,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

comment on table  public.brand_links is 'Social and contact links for the Sterova brand — editable from the CMS.';
comment on column public.brand_links.category is 'social | contact';
comment on column public.brand_links.key      is 'Unique slug-style identifier, e.g. "linkedin", "email", "whatsapp"';
comment on column public.brand_links.value    is 'Display value: handle, email address, phone number, etc.';
comment on column public.brand_links.href     is 'Full URL or mailto:/tel: link. NULL for non-linkable entries like address.';
comment on column public.brand_links.icon_key is 'Key that maps to an icon component on the frontend.';

-- Auto-update updated_at
create or replace function public.brand_links_set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_brand_links_updated_at
  before update on public.brand_links
  for each row execute function public.brand_links_set_updated_at();

-- ─────────────────────────────────────────────────────────────────────────────
-- RLS
-- ─────────────────────────────────────────────────────────────────────────────
alter table public.brand_links enable row level security;

-- Public: read active links only
create policy "brand_links_public_read"
  on public.brand_links for select
  using (is_active = true);

-- Admin: full access
create policy "brand_links_admin_all"
  on public.brand_links for all
  using (public.is_admin())
  with check (public.is_admin());

-- Grant access to roles
grant all privileges on table public.brand_links to anon, authenticated, service_role;

-- ─────────────────────────────────────────────────────────────────────────────
-- Seed data — current hardcoded values from constants.ts
-- ─────────────────────────────────────────────────────────────────────────────

-- Social links
insert into public.brand_links (category, key, label, value, href, icon_key, display_order) values
  ('social', 'linkedin',  'LinkedIn',      '/company/sterova',  'https://www.linkedin.com/company/sterova', 'linkedin',  0),
  ('social', 'github',    'GitHub',        '@sterova',          'https://github.com/sterova',               'github',    1),
  ('social', 'x',         'X (Twitter)',   '@sterova',          'https://x.com/sterova',                    'x',         2),
  ('social', 'instagram', 'Instagram',     '@sterova',          'https://instagram.com/sterova',            'instagram', 3),
  ('social', 'dribbble',  'Dribbble',      '@sterova',          'https://dribbble.com/sterova',             'dribbble',  4),
  ('social', 'behance',   'Behance',       '@sterova',          'https://www.behance.net/sterova',          'behance',   5)
on conflict (key) do nothing;

-- Contact details
insert into public.brand_links (category, key, label, value, href, icon_key, display_order) values
  ('contact', 'email',    'Email',    'hello@sterova.tech',  'mailto:hello@sterova.tech',              'mail',           0),
  ('contact', 'whatsapp', 'WhatsApp', '+91 97864 75035',     'https://wa.me/919786475035',             'message-circle', 1),
  ('contact', 'phone',    'Phone',    '+91 97864 75035',     'tel:+919786475035',                      'phone',          2)
on conflict (key) do nothing;


