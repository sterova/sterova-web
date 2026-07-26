-- =============================================================================
-- Sterova — Navigation Items Seed (005)
-- =============================================================================
-- Seeds the navigation_items table with the default top-level nav structure.
-- Run AFTER 002_content_schema.sql (which creates the navigation_items table).
-- Safe to re-run — uses ON CONFLICT DO NOTHING.
-- =============================================================================

insert into public.navigation_items (label, href, parent_id, display_order, is_active)
values
  ('Home',      '/',            null, 10, true),
  ('About',     '/about',       null, 20, true),
  ('Services',  '/services',    null, 30, true),
  ('Products',  '/#portfolio',  null, 40, true),
  ('Portfolio', '/portfolio',   null, 50, true),
  ('Process',   '/process',     null, 60, true),
  ('Blog',      '/blog',        null, 70, true),
  ('Contact',   '/contact',     null, 80, true)
on conflict do nothing;
