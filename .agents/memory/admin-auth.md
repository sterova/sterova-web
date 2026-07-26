---
name: Admin auth pattern
description: How admin authentication works — Supabase Auth + admins table + service client
---

## Rule
All admin API routes and server pages call `verifyAdminRequest()` from `src/lib/admin-auth.ts` before doing anything. It returns `null` if the user is not authenticated or not in the `admins` table.

**Why:** Supabase Auth alone doesn't restrict who is an admin. The `admins` table is the authoritative list.

**How to apply:**
- API routes: return 401 if `verifyAdminRequest()` returns null.
- Server pages: `redirect("/admin/login")` if null.
- The `admins` table only has a `service_role_all` RLS policy — never accessible via anon or user JWTs.
- First admin is created via `/api/admin/setup` (POST), which checks the table is empty first.
- Subsequent admins must be added manually or via an admin UI (not yet built).

## Middleware
`src/middleware.ts` redirects unauthenticated users away from `/admin/**` (except `/admin/login` and `/admin/setup`) at the edge — before any server component runs.
