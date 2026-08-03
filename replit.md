# Sterova Web

The official website for **Sterova** — a custom software engineering agency. Built with TanStack Start, React 19, TypeScript, and Tailwind CSS v4. Targets Cloudflare Workers for production deployment.

## Running on Replit

```sh
npm run dev -- --port 5000
```

The **Start application** workflow runs this automatically. The dev server serves on port 5000 (required for the Replit webview).

**Node.js 22 is required.** The project uses `@supabase/supabase-js`, which depends on the native WebSocket API introduced in Node 22. The `.replit` file is configured accordingly.

## Environment Variables / Secrets

All Supabase credentials are stored as Replit Secrets. See `.env.example` for the full list:

| Variable | Side | Purpose |
|---|---|---|
| `VITE_SUPABASE_URL` | Client | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Client | Anon/public key (RLS-protected) |
| `SUPABASE_URL` | Server | Supabase project URL (server functions) |
| `SUPABASE_PUBLISHABLE_KEY` | Server | Publishable key |
| `SUPABASE_SECRET_KEY` | Server | Service role key — keep secret |
| `SUPABASE_JWKS_URL` | Server | JWKS endpoint for JWT verification |
| `POSTGRES_URL` | Server | Pooled Postgres connection |
| `POSTGRES_URL_NON_POOLING` | Server | Direct Postgres connection |
| `DIRECT_URL` | Server | Prisma direct URL |

## Stack

- [TanStack Start](https://tanstack.com/start) — Full-stack React framework
- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS v4](https://tailwindcss.com/) via `@tailwindcss/vite`
- [Supabase](https://supabase.com/) — Database & Auth
- [Cloudflare Workers](https://workers.cloudflare.com/) — Edge deployment target
- [Radix UI](https://www.radix-ui.com/) + [shadcn/ui](https://ui.shadcn.com/) components

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build + SEO audit |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run format` | Format with Prettier |
| `npm run seo:check` | SEO audit against a running server |

## User Preferences

- Keep the existing project structure — do not restructure or migrate.
