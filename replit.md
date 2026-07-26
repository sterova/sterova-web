# Sterova Website

## Project overview

Production-ready company website for **Sterova** — a software development company.

**Stack:** Next.js 15 (App Router) · TypeScript (strict) · Tailwind CSS · Framer Motion · React Hook Form + Zod · Supabase · Resend

**Run command:** `npm run dev` (port 5000)

## Replit setup

### How to run

1. Install dependencies: `npm install`
2. Add the required secrets via Replit Secrets (see below)
3. Start the workflow: **Start application** (`npm run dev`)
4. App is available on port 5000

### Required secrets (Replit Secrets)

| Secret | Where to find it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API → anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API → service_role key |

### Optional secrets

| Secret | Purpose |
|---|---|
| `RESEND_API_KEY` | Email notifications for contact form (app works without this; submissions still saved to Supabase) |

### Non-secret env vars (already set in .replit)

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://sterova.tech` |

### Database setup

Run `supabase/migrations/001_initial_schema.sql` against your Supabase project to create all tables and RLS policies. See `supabase/README.md` for step-by-step instructions.

## Architecture

- All site content lives in `data/constants.tsx` — edit that file to update any text, services, portfolio items, FAQs, etc.
- Pages are in `src/app/` using Next.js App Router
- UI components are in `src/components/` split by `ui/`, `layout/`, `sections/`, `forms/`, and `shared/`
- API routes at `src/app/api/` handle contact forms and newsletter subscriptions
- Supabase client in `src/lib/supabase/` (separate browser and server clients)
- Email via Resend in `src/lib/email.ts` — gracefully disabled when `RESEND_API_KEY` is not set

## Replit setup status (as of 2026-07-26)

- Dependencies installed (`npm install` — node_modules present)
- All required secrets configured: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- Optional secrets not yet added: `RESEND_API_KEY` (email notifications)
- **Start application** workflow running on port 5000 — app verified working
- Database migrations not yet applied — run `supabase/migrations/` SQL files against the Supabase project before contact forms and blog will persist data

## User preferences

- Contact email: hello@sterova.tech
- WhatsApp: +91 9786475035
- Phone, address, and social links are placeholders — ask before inserting real values
- All credentials must use environment variables — never hardcoded
- Resend integration is optional at launch; forms degrade gracefully without it
- Treat as a real production project — no placeholder implementations
