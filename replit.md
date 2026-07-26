# Sterova Website

## Project overview

Production-ready company website for **Sterova** — a software development company.

**Stack:** Next.js 14 (App Router) · TypeScript (strict) · Tailwind CSS · Framer Motion · React Hook Form + Zod · Supabase · Resend

**Run command:** `npm run dev` (port 5000)

## Architecture

- All site content lives in `data/constants.tsx` — edit that file to update any text, services, portfolio items, FAQs, etc.
- Pages are in `src/app/` using Next.js App Router
- UI components are in `src/components/` split by `ui/`, `layout/`, `sections/`, `forms/`, and `shared/`
- API routes at `src/app/api/` handle contact forms and newsletter subscriptions
- Supabase client in `src/lib/supabase/` (separate browser and server clients)
- Email via Resend in `src/lib/email.ts` — gracefully disabled when `RESEND_API_KEY` is not set

## Required environment variables (Replit Secrets)

- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon/public key
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase service role key (server-side only)
- `RESEND_API_KEY` — Resend email API key (optional, add later)

See `.env.example` for the full list.

## Database

Run `supabase/migrations/001_initial_schema.sql` against the Supabase project to create all tables and RLS policies.

## User preferences

- Contact email: hello@sterova.tech
- WhatsApp: +91 9786475035
- Phone, address, and social links are placeholders — ask before inserting real values
- All credentials must use environment variables — never hardcoded
- Resend integration is optional at launch; forms degrade gracefully without it
- Treat as a real production project — no placeholder implementations
