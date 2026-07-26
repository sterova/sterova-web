# Sterova — Company Website

**Build. Scale. Innovate.**

Production-ready company website for Sterova — a modern software development company. Built with Next.js 14, TypeScript, Tailwind CSS, Supabase, and Resend.

---

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS + shadcn/ui components |
| Animation | Framer Motion |
| Forms | React Hook Form + Zod |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (ready, not yet active) |
| Email | Resend (graceful fallback if key missing) |
| Deployment | Vercel |
| CDN/DNS | Cloudflare (recommended) |

---

## Folder Structure

```
sterova/
├── data/
│   └── constants.tsx          # All site content — edit this to update the website
├── src/
│   ├── app/                   # Next.js App Router pages and API routes
│   │   ├── api/
│   │   │   ├── contact/       # Contact form API
│   │   │   ├── newsletter/    # Newsletter subscription API
│   │   │   └── health/        # Health check endpoint
│   │   ├── about/
│   │   ├── services/
│   │   ├── portfolio/
│   │   ├── process/
│   │   ├── blog/
│   │   ├── contact/
│   │   ├── careers/
│   │   ├── privacy/
│   │   ├── terms/
│   │   ├── sitemap.ts         # Auto-generated sitemap.xml
│   │   ├── robots.ts          # robots.txt
│   │   └── layout.tsx         # Root layout with SEO metadata
│   ├── components/
│   │   ├── ui/                # Primitive UI components (Button, Badge, etc.)
│   │   ├── layout/            # Navbar, Footer
│   │   ├── sections/          # Page sections (Hero, Services, FAQ, etc.)
│   │   ├── forms/             # ContactForm
│   │   └── shared/            # Reusable helpers (SectionHeader, WhatsApp, etc.)
│   ├── hooks/
│   │   └── use-toast.ts       # Toast notification hook
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts      # Browser Supabase client
│   │   │   └── server.ts      # Server Supabase client + service client
│   │   ├── email.ts           # Resend email helpers (graceful degradation)
│   │   ├── rate-limit.ts      # In-memory rate limiter
│   │   └── utils.ts           # General utilities
│   ├── middleware.ts           # Next.js middleware
│   └── types/
│       └── index.ts           # TypeScript types for DB tables and forms
├── supabase/
│   ├── migrations/
│   │   └── 001_initial_schema.sql  # All tables, RLS, indexes, triggers
│   └── README.md              # Supabase setup guide
├── public/                    # Static assets
├── .env.example               # Required environment variables (no real values)
├── next.config.ts             # Next.js config + security headers
├── tailwind.config.ts         # Tailwind + custom Sterova design tokens
└── tsconfig.json              # Strict TypeScript config
```

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Add the following to Replit Secrets (or `.env.local` for local development):

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Optional — email works without these, forms still save to Supabase
RESEND_API_KEY=re_your-key
CONTACT_EMAIL=hello@sterova.tech
FROM_EMAIL=hello@sterova.tech

NEXT_PUBLIC_SITE_URL=https://sterova.tech
```

See `.env.example` for the full list.

### 3. Run the database migration

Open your Supabase project → SQL Editor → run `supabase/migrations/001_initial_schema.sql`.

### 4. Start the development server

```bash
npm run dev
```

The app runs on port 5000.

---

## Updating Content

All website content lives in **`data/constants.tsx`**:

- Navigation links → `NAV_LINKS`
- Hero section → `HERO`
- Services → `SERVICES`
- Portfolio items → `PORTFOLIO_ITEMS`
- Testimonials → `TESTIMONIALS`
- FAQs → `FAQS`
- Process steps → `PROCESS_STEPS`
- Industries → `INDUSTRIES`
- Tech stack → `TECH_STACK`
- Footer links → `FOOTER_LINKS`
- Contact details → `SITE`

**To add a service:** add an object to `SERVICES`. It automatically appears everywhere.
**To add a portfolio item:** add an object to `PORTFOLIO_ITEMS`.
**To update contact info:** edit the `SITE` object.

---

## Supabase Setup

See `supabase/README.md` for the full setup guide including storage bucket configuration.

**Tables created by the migration:**
- `contact_messages` — Contact form submissions
- `newsletter_subscribers` — Newsletter sign-ups
- `job_applications` — Career applications
- `blog_categories` — Blog taxonomy
- `blog_posts` — Published articles
- `admins` — Admin users
- `audit_logs` — Admin action trail

All tables have **Row Level Security (RLS) enabled**. Private tables are only accessible via the service role key (server-side only).

---

## Deployment to Vercel

1. Push to your GitHub repository
2. Import the project in Vercel
3. Add environment variables under **Settings → Environment Variables** — set to **Production** only
4. Deploy

**Important:**
- Never sync `SUPABASE_SERVICE_ROLE_KEY` to Preview or Development environments
- Keep the `NEXT_PUBLIC_` prefix for client-safe variables
- Set `NEXT_PUBLIC_SITE_URL` to your production domain

---

## Email (Resend)

Email is **fully implemented but disabled by default** until you add `RESEND_API_KEY`.

Without the key:
- Contact form submissions are saved to Supabase ✓
- No email notification is sent (logged to console)
- No errors are thrown

With the key:
- Admin receives a notification email for every submission
- Submitter receives a confirmation email
- No code changes needed — just add the secret

---

## Security Features

- CSP, HSTS, X-Frame-Options, and other security headers via `next.config.ts`
- Input validation and sanitization with Zod
- Rate limiting on all API routes (in-memory; upgrade to Redis at scale)
- RLS on every Supabase table
- Service role key never exposed to the browser
- No secrets in source code

---

## Placeholder Values

The following fields in `data/constants.tsx` are currently placeholders. Update them before launch:

- `SITE.phone` — company phone number
- `SITE.address` — office address
- `SITE.social.twitter/linkedin/github/instagram` — social media URLs
- `TEAM_MEMBERS` — add real team member data
- `OPEN_POSITIONS` — add job listings when ready
