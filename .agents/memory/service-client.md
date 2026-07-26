---
name: Service client pattern
description: When to use createServiceClient() vs createClient() in Supabase server code
---

## Rule
- `createServiceClient()` — uses `SUPABASE_SERVICE_ROLE_KEY`; bypasses ALL RLS policies; use in admin API routes and server-side admin pages only.
- `createClient()` — uses `NEXT_PUBLIC_SUPABASE_ANON_KEY` + SSR cookie auth; respects RLS; use in public pages, user-facing server components, and the session middleware.

**Why:** Public tables (services, portfolio, testimonials, faqs, site_settings) have RLS policies that allow public reads. Admin tables (admins, audit_logs) only allow service_role. Using the wrong client either leaks data or fails silently with a permission denied error.

**How to apply:**
- Admin CRUD routes in `src/app/api/admin/` always use `createServiceClient()`.
- Public review submission (`src/app/api/reviews/route.ts`) uses `createServiceClient()` because the `public_insert` RLS policy allows anon inserts, but we use service role for consistency and to avoid edge cases.
- `src/lib/admin-auth.ts#verifyAdminRequest()` uses `createClient()` for `getUser()` (needs session) then `createServiceClient()` for the `admins` table lookup (needs service role).
