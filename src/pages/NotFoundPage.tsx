import { useEffect, useMemo } from "react";
import { Link, useRouter, useRouterState } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  Briefcase,
  FileText,
  Home,
  Layers,
  MessageSquare,
  Route as RouteIcon,
  Search,
  Sparkles,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const DESTINATIONS = [
  {
    label: "Services",
    to: "/services",
    note: "What we build and how we scope it",
    icon: Layers,
    keywords: [
      "service",
      "services",
      "solution",
      "solutions",
      "capabilit",
      "software",
      "web",
      "mobile",
      "app",
      "saas",
      "design",
      "api",
    ],
  },
  {
    label: "Portfolio",
    to: "/portfolio",
    note: "Shipped work and measurable outcomes",
    icon: Briefcase,
    keywords: ["portfolio", "work", "case", "project", "projects", "client"],
  },

  {
    label: "Blog",
    to: "/blog",
    note: "Engineering notes from the team",
    icon: FileText,
    keywords: ["blog", "post", "posts", "article", "news", "insight"],
  },
  {
    label: "About",
    to: "/about",
    note: "The team and principles behind Sterova",
    icon: Users,
    keywords: ["about", "team", "company", "who", "story"],
  },
  {
    label: "Contact",
    to: "/contact",
    note: "Start a project or ask a question",
    icon: MessageSquare,
    keywords: ["contact", "quote", "hire", "talk", "email", "enquir", "inquir", "support"],
  },
] as const;

/** Best-guess destination for the mistyped path, or null when nothing matches. */
function suggestFor(pathname: string) {
  const needle = pathname.toLowerCase();
  return DESTINATIONS.find((d) => d.keywords.some((k) => needle.includes(k))) ?? null;
}

export default function NotFoundPage() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const suggestion = useMemo(() => suggestFor(pathname), [pathname]);

  // A 404 is a dead end, so every escape route must be instant. Warm each
  // destination chunk as soon as this page mounts — RoutePrefetcher's hover /
  // focus / viewport warming still layers on top for anything below the fold.
  useEffect(() => {
    let cancelled = false;
    const warm = async () => {
      for (const to of ["/", ...DESTINATIONS.map((d) => d.to)]) {
        if (cancelled) return;
        try {
          await router.preloadRoute({ to });
        } catch {
          /* preloading is best-effort */
        }
      }
    };
    const w = window as typeof window & {
      requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    if (typeof w.requestIdleCallback === "function") {
      const id = w.requestIdleCallback(warm, { timeout: 1200 });
      return () => {
        cancelled = true;
        w.cancelIdleCallback?.(id);
      };
    }
    const timer = window.setTimeout(warm, 200);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [router]);

  const reveal = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
      };

  return (
    <section className="relative overflow-hidden section-y">
      {/* Ambient background: dot texture + soft brand bloom, masked to the fold. */}
      <div
        className="pointer-events-none absolute inset-0 dot-grid radial-fade opacity-70"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[28rem] w-[52rem] -translate-x-1/2 -translate-y-1/3 rounded-full opacity-60 blur-3xl [background:radial-gradient(closest-side,color-mix(in_oklab,var(--primary)_18%,transparent),transparent)]"
        aria-hidden="true"
      />

      <motion.div {...reveal} className="container-custom relative">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Copy column */}
          <div className="lg:col-span-5">
            <span className="eyebrow">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
              Error 404
            </span>

            <p
              className="mt-6 font-display text-[clamp(4.5rem,12vw,8rem)] font-bold leading-[0.85] tracking-[-0.05em] gradient-text"
              aria-hidden="true"
            >
              404
            </p>

            <h1 className="mt-6 heading-1 font-semibold text-foreground">
              This page isn&apos;t here
            </h1>
            <p className="body-lead mt-4 max-w-md">
              The link may be outdated, mistyped, or the page has moved. Everything below is still
              live.
            </p>

            <p className="mt-6 flex items-center gap-2 overflow-hidden rounded-xl border border-border bg-surface px-3.5 py-2.5 font-mono text-caption text-muted-foreground">
              <Search className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span className="truncate">{pathname}</span>
            </p>

            {suggestion ? (
              <p className="mt-4 flex flex-wrap items-center gap-2 text-caption text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                <span>
                  Did you mean{" "}
                  <Link
                    to={suggestion.to}
                    preload="intent"
                    className="focus-ring rounded font-medium text-primary underline underline-offset-4 hover:text-primary-hover"
                  >
                    {suggestion.label}
                  </Link>
                  ?
                </span>
              </p>
            ) : null}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button asChild variant="gradient" size="lg">
                <Link to="/">
                  <Home className="h-4 w-4" aria-hidden="true" />
                  Go home
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  if (typeof window !== "undefined") window.history.back();
                }}
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Go back
              </Button>
              <Button asChild variant="ghost" size="lg">
                <Link to="/contact">
                  <MessageSquare className="h-4 w-4" aria-hidden="true" />
                  Contact us
                </Link>
              </Button>
            </div>
          </div>

          {/* Destinations column */}
          <div className="lg:col-span-7">
            <nav aria-label="Suggested pages" className="card-premium sheen overflow-hidden">
              <div className="flex items-center justify-between gap-4 border-b border-border px-6 py-4">
                <span className="font-mono text-eyebrow uppercase tracking-[0.18em] text-muted-foreground">
                  Where to next
                </span>
                <span className="font-mono text-eyebrow text-muted-foreground">
                  {String(DESTINATIONS.length).padStart(2, "0")}
                </span>
              </div>
              <ul className="divide-y divide-border">
                {DESTINATIONS.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.to}>
                      <Link
                        to={item.to}
                        preload="intent"
                        className="focus-ring group flex items-center gap-4 px-6 py-4 transition-colors hover:bg-accent/60 focus-visible:bg-accent/60"
                      >
                        <span className="font-mono text-eyebrow text-muted-foreground tabular-nums">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span
                          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border bg-primary/10 text-primary transition-colors group-hover:border-primary/40"
                          aria-hidden="true"
                        >
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block font-medium text-foreground">{item.label}</span>
                          <span className="block truncate text-caption text-muted-foreground">
                            {item.note}
                          </span>
                        </span>
                        <ArrowUpRight
                          className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary motion-reduce:transition-none"
                          aria-hidden="true"
                        />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
