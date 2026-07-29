# Sterova Web

The official website for **Sterova** — built with TanStack Start, React, TypeScript, and Tailwind CSS. Deployed on Cloudflare via Vercel.

## Development

You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd sterova-web
cp .env.example .env    # fill in your Supabase credentials
npm install
npm run dev
```

## Environment Variables

Copy `.env.example` to `.env` and fill in the values. See the file for documentation on which variables are client-safe vs server-only.

> **Important**: Never commit your `.env` file. It is gitignored by default.

## Scripts

| Command             | Description                            |
| ------------------- | -------------------------------------- |
| `npm run dev`       | Start development server               |
| `npm run build`     | Production build + SEO audit           |
| `npm run preview`   | Preview production build locally       |
| `npm run lint`      | Run ESLint                             |
| `npm run format`    | Format code with Prettier              |
| `npm run seo:check` | Run SEO audit against a running server |

## Built with

- [TanStack Start](https://tanstack.com/start) — Full-stack React framework
- [TypeScript](https://www.typescriptlang.org/)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Supabase](https://supabase.com/) — Database & Auth
- [Cloudflare Workers](https://workers.cloudflare.com/) — Edge deployment
