-- =============================================================================
-- Admin Setup
-- =============================================================================
--
-- HOW TO CREATE YOUR ADMIN ACCOUNT
-- ─────────────────────────────────
-- Option 1 — Web UI (recommended, no SQL needed):
--   1. Make sure the app is running
--   2. Go to /admin/setup in your browser
--   3. Enter your email and a strong password
--   4. You are done — log in at /admin/login
--
-- Option 2 — Manual SQL:
--   1. Go to Supabase dashboard → Authentication → Users → Add user
--   2. Enter your email + password, click "Create user"
--   3. Copy the UUID shown for your new user
--   4. Replace the placeholders below and run this SQL:
--
-- INSERT INTO public.admins (user_id, email, role)
-- VALUES (
--   'PASTE-YOUR-UUID-HERE'::uuid,
--   'your-email@example.com',
--   'super_admin'
-- )
-- ON CONFLICT (user_id) DO NOTHING;
--
-- =============================================================================

-- Performance indexes on admins table
create index if not exists admins_email_idx   on public.admins (email);
create index if not exists admins_user_id_idx on public.admins (user_id);

-- Ensure audit_logs can be queried by action type
create index if not exists audit_logs_action_idx    on public.audit_logs (action);
create index if not exists audit_logs_resource_idx  on public.audit_logs (resource);
