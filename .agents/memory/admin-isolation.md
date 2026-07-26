---
name: Admin route isolation
description: How /admin paths hide the public Navbar, Footer, and WhatsApp button without route groups
---

## Rule
Instead of restructuring into Next.js route groups `(public)` / `(admin)`, the middleware injects `x-pathname` into request headers. The root `layout.tsx` reads this header via `headers()` and conditionally skips `<NavbarWrapper>`, `<Footer>`, and `<WhatsAppButton>` for `/admin/**` paths.

**Why:** The project was imported without route groups. Restructuring into groups is a large refactor that touches every page import and can break things. The header injection approach is surgical and reversible.

**How to apply:**
- `src/middleware.ts`: `requestHeaders.set("x-pathname", request.nextUrl.pathname)`
- `src/app/layout.tsx`: `const pathname = (await headers()).get("x-pathname") ?? "/"; const isAdmin = pathname.startsWith("/admin");`
- Admin pages get their own shell via `src/app/admin/_components/AdminShell.tsx` (sidebar + top bar).
- Admin layout (`src/app/admin/layout.tsx`) delegates to `AdminShell`.
