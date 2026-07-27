import type { BlogPost } from "@/types";

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "1",
    title: "Why We Chose TypeScript for Every New Project",
    slug: "why-typescript-every-project",
    excerpt:
      "TypeScript has moved from a nice-to-have to a non-negotiable for us. Here's the honest reasoning behind that decision — including the tradeoffs.",
    content: `<p>When we started Sterova, we debated this a lot. JavaScript's flexibility is its greatest asset. TypeScript's constraints are its greatest asset. Turns out both are true, and over the last three years of building production systems, we've landed firmly on TypeScript for everything.</p>

<h2>The refactoring argument</h2>
<p>The biggest win isn't catching bugs at compile time (though that's real). It's the ability to refactor with confidence. When you rename a field on a database entity, TypeScript tells you everywhere the old name was used. In a large codebase, this is the difference between a confident one-hour refactor and a three-day debugging session.</p>

<h2>Documentation that stays in sync</h2>
<p>Types are documentation that never goes out of date. When a new engineer joins and opens a function, they immediately know what it accepts and returns — without having to trace through the entire codebase or find a comment that was written two years ago and may no longer be accurate.</p>

<h2>The tradeoffs we accept</h2>
<p>TypeScript does slow you down in the early stages of a project. When you're prototyping, fighting the type system is genuinely frustrating. Our approach: <code>as unknown as T</code> early, tighten types during the review phase. Perfect types on the first pass are the enemy of shipping.</p>

<h2>Where we draw the line</h2>
<p>We don't use strict null checks on frontend-only utility scripts. We do use them on API boundaries and database models — exactly where null bugs cause production incidents.</p>`,
    cover_image_url: null,
    category: "Engineering",
    tags: ["TypeScript", "Engineering", "Best Practices"],
    author_name: "Sterova Team",
    author_avatar_url: null,
    published: true,
    published_at: "2024-10-15T09:00:00Z",
    read_time_minutes: 5,
    views: 1240,
  },
  {
    id: "2",
    title: "Building Multi-Tenant SaaS on Supabase: Lessons from the Field",
    slug: "multi-tenant-saas-supabase",
    excerpt:
      "Row Level Security is powerful but sharp. After building three multi-tenant platforms on Supabase, here's what we wish we'd known from the start.",
    content: `<p>Multi-tenant SaaS sounds straightforward until you're three months in and your RLS policies have grown to 400 lines of SQL. Here's what we learned building production multi-tenant systems on Supabase.</p>

<h2>The org_id pattern</h2>
<p>Every table gets an <code>org_id uuid not null</code> column. Every RLS policy checks <code>auth.jwt() ->> 'org_id' = org_id::text</code>. This is boring, and that's a feature. Boring is good in security.</p>

<h2>Service role vs. anon role</h2>
<p>Your backend API routes should always use the service role client. Never expose service role credentials to the frontend. The anon client belongs in client-side code only, with RLS as the safety net.</p>

<h2>Testing RLS policies</h2>
<p>We test RLS policies with separate Supabase clients authenticated as different test users. An automated test suite that verifies tenant isolation is not optional — it's the only way to ship with confidence.</p>

<h2>The N+1 problem with RLS</h2>
<p>RLS adds overhead to every query. In our analytics dashboards, we saw 3× query times after enabling RLS on large tables. The fix: materialized views for read-heavy analytics, computed nightly with a service role script.</p>`,
    cover_image_url: null,
    category: "Engineering",
    tags: ["Supabase", "SaaS", "PostgreSQL", "Security"],
    author_name: "Sterova Team",
    author_avatar_url: null,
    published: true,
    published_at: "2024-09-28T09:00:00Z",
    read_time_minutes: 7,
    views: 2180,
  },
  {
    id: "3",
    title: "The Startup Technical Scope Mistake That Costs 3 Months",
    slug: "startup-scope-mistake",
    excerpt:
      "The most common mistake early-stage founders make when scoping their MVP — and the simple framework we use to avoid it.",
    content: `<p>When scoping an MVP, the single most expensive mistake — in time, money, and morale — is conflating the MVP with the vision product.</p>

<h2>Vision product vs. MVP</h2>
<p>The vision product is what you want to build. The MVP is the smallest thing that answers your riskiest assumption. These are almost never the same thing, and confusing them leads to 6-month builds of features nobody uses.</p>

<h2>The riskiest assumption framework</h2>
<p>Before we scope anything, we ask: what is the one assumption, if wrong, would make this entire product pointless? Build only what's needed to test that assumption. Everything else is premature.</p>

<h2>The scope creep mechanism</h2>
<p>Scope creep on MVPs rarely comes from adding new features. It comes from adding "just in case" robustness: admin dashboards for data you could manage in a SQL editor, role systems for a single-user MVP, email templating systems for a handful of transactional emails. Cut these first.</p>

<h2>Our rule of thumb</h2>
<p>If you can do it manually for your first 10 users, don't automate it in the MVP. Automate after you've validated that 10 → 100 → 1000 users want it.</p>`,
    cover_image_url: null,
    category: "Startup",
    tags: ["Startup", "Product", "MVP", "Engineering"],
    author_name: "Sterova Team",
    author_avatar_url: null,
    published: true,
    published_at: "2024-09-10T09:00:00Z",
    read_time_minutes: 6,
    views: 3450,
  },
  {
    id: "4",
    title: "React Native vs. Flutter in 2024: An Agency Perspective",
    slug: "react-native-vs-flutter-2024",
    excerpt:
      "We've shipped production apps in both. Here's the honest comparison — not the blog post comparison, but the one from real client projects.",
    content: `<p>The React Native vs. Flutter debate has been settled for many developers, but as an agency that ships both, we have a different perspective than solo developers writing comparison blog posts.</p>

<h2>Team composition matters more than tech</h2>
<p>If you have React engineers, React Native wins on speed-to-market. If you're starting fresh with no mobile experience, Flutter's single-language model (Dart) has a shallower learning curve than juggling JavaScript, Java/Kotlin, and Swift mental models simultaneously.</p>

<h2>Where Flutter genuinely wins</h2>
<p>Custom animations and pixel-perfect UI. Flutter's rendering engine is separate from the platform UI, which means your design ships exactly as designed on both platforms. With React Native, platform-specific quirks are a real debugging cost.</p>

<h2>Where React Native genuinely wins</h2>
<p>Web code sharing and team velocity for JavaScript shops. With Expo, the deployment story has dramatically improved. And the library ecosystem, while uneven, covers 90% of what production apps need.</p>

<h2>Our recommendation</h2>
<p>Default to React Native with Expo if you have web developers. Default to Flutter if you're hiring mobile specialists or if pixel-perfect custom UI is a core requirement.</p>`,
    cover_image_url: null,
    category: "Engineering",
    tags: ["React Native", "Flutter", "Mobile", "Engineering"],
    author_name: "Sterova Team",
    author_avatar_url: null,
    published: true,
    published_at: "2024-08-22T09:00:00Z",
    read_time_minutes: 8,
    views: 4120,
  },
  {
    id: "5",
    title: "Integrating OpenAI into Production Apps: What the Docs Don't Tell You",
    slug: "openai-production-integration",
    excerpt:
      "Rate limits, cost control, prompt injection, and hallucination mitigation — the real challenges of shipping LLM features to production users.",
    content: `<p>The OpenAI quickstart takes 10 minutes. The production integration takes 3 weeks. Here's what fills that gap.</p>

<h2>Rate limiting is your first problem</h2>
<p>GPT-4 rate limits are per-minute and per-day. At scale, you'll hit them. Our approach: implement exponential backoff, queue non-urgent requests, and maintain separate API keys per product environment.</p>

<h2>Cost control from day one</h2>
<p>Set up billing alerts. Implement per-user token budgets. Cache responses for identical prompts (a Redis cache with a 24-hour TTL on prompt hash → response pairs cut our API costs by 40% on one project). Log every token used to a database — you'll need this data for billing and debugging.</p>

<h2>Prompt injection is real</h2>
<p>If your app lets users input text that gets embedded in a system prompt, test prompt injection from day one. The mitigation isn't perfect, but sanitizing inputs, using clear delimiters, and structuring prompts defensively reduces the attack surface significantly.</p>

<h2>Hallucination mitigation</h2>
<p>For factual domains (legal, medical, financial), always pair LLM output with retrieval-augmented generation (RAG). Don't ask the model to make things up — ask it to summarize documents you provide. The quality improvement is dramatic.</p>`,
    cover_image_url: null,
    category: "Engineering",
    tags: ["OpenAI", "AI", "Production", "Engineering"],
    author_name: "Sterova Team",
    author_avatar_url: null,
    published: true,
    published_at: "2024-08-05T09:00:00Z",
    read_time_minutes: 9,
    views: 5680,
  },
  {
    id: "6",
    title: "Designing for Developers: The Craft Behind Our Design System",
    slug: "design-system-craft",
    excerpt:
      "How we built an internal design system that makes developers happy and keeps design consistent across every client project.",
    content: `<p>A design system is only useful if engineers actually use it. Here's how we built ours so that the path of least resistance is also the right path.</p>

<h2>Tokens, not magic numbers</h2>
<p>Every color, spacing value, and radius in our system is a named token. There are no hardcoded hex values in component code. This means our entire visual identity can be updated by changing a handful of variables — which has saved us enormous time on client rebrands.</p>

<h2>Components encode decisions</h2>
<p>A Button component shouldn't just render a button. It should make the wrong choices hard. Our Button has five variants, three sizes, and loads and disabled states — all pre-built. The engineer reaching for Button doesn't need to remember to add aria-disabled when the button is loading. The component does it.</p>

<h2>Dark mode from the start</h2>
<p>Building dark mode in after the fact is brutal. Every project we start, dark mode is a first-class requirement. CSS custom properties (HSL values) make this manageable — one set of variables for light, one for dark, and Tailwind's dark: prefix handles the rest.</p>

<h2>Documentation that serves two audiences</h2>
<p>Design system docs need to serve both designers (who care about visual spec) and engineers (who care about API). We keep both in Storybook: designers see visual examples, engineers see prop tables and usage code.</p>`,
    cover_image_url: null,
    category: "Design",
    tags: ["Design System", "Design", "Frontend", "Engineering"],
    author_name: "Sterova Team",
    author_avatar_url: null,
    published: true,
    published_at: "2024-07-18T09:00:00Z",
    read_time_minutes: 7,
    views: 2890,
  },
];
