import AnimatedSection from "@/components/shared/AnimatedSection";
import SectionHeader from "@/components/shared/SectionHeader";
import { Rocket, Wrench, Star, ShieldCheck, Zap } from "lucide-react";

const CHANGELOG = [
  {
    version: "Q3 2025",
    date: "August 2025",
    type: "milestone" as const,
    icon: Star,
    entries: [
      {
        type: "new",
        title: "Admin CMS v2 launched",
        description:
          "Complete rebuild of the content management system with richer blog editing, media library, and granular SEO control per post and page.",
      },
      {
        type: "new",
        title: "Chatbot assistant",
        description:
          "Launched the Sterova AI assistant on the website — capable of answering service questions, guiding visitors to the right page, and capturing project leads.",
      },
      {
        type: "improvement",
        title: "SEO overhaul",
        description:
          "Structured data (JSON-LD), sitemap generation, canonical URLs, and OpenGraph metadata added across all public-facing pages.",
      },
    ],
  },
  {
    version: "Q2 2025",
    date: "May 2025",
    type: "release" as const,
    icon: Rocket,
    entries: [
      {
        type: "new",
        title: "Case Studies section",
        description:
          "Launched detailed case study pages with full Problem → Research → Design → Development → Results narrative structure.",
      },
      {
        type: "new",
        title: "Project estimation tool",
        description:
          "Interactive project scope and budget estimator — clients can configure their requirements and receive a ballpark range instantly.",
      },
      {
        type: "improvement",
        title: "Portfolio filter and search",
        description:
          "Portfolio page now supports filtering by category, technology, and industry — powered by admin-managed project metadata.",
      },
    ],
  },
  {
    version: "Q1 2025",
    date: "February 2025",
    type: "foundation" as const,
    icon: Wrench,
    entries: [
      {
        type: "new",
        title: "Website rebuilt on TanStack Start",
        description:
          "Migrated from a static site to a full-stack React application using TanStack Start, delivering SSR, prefetching, and server functions.",
      },
      {
        type: "new",
        title: "Supabase integration",
        description:
          "All dynamic content (blog posts, reviews, projects, team members) now pulled from Supabase with Row Level Security enforced.",
      },
      {
        type: "security",
        title: "Content Security Policy and security headers",
        description:
          "Implemented strict CSP headers, HSTS, and clickjacking protection across all routes.",
      },
    ],
  },
  {
    version: "Site Launch",
    date: "December 2024",
    type: "launch" as const,
    icon: Zap,
    entries: [
      {
        type: "new",
        title: "Sterova website goes live",
        description:
          "Initial public launch of sterova.tech with homepage, services, portfolio, contact form, and blog.",
      },
      {
        type: "new",
        title: "Privacy Policy and Terms of Service",
        description: "Legal pages drafted and published at launch.",
      },
    ],
  },
];

const TYPE_COLORS: Record<string, string> = {
  new: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
  improvement: "text-blue-500 bg-blue-500/10 border-blue-500/20",
  security: "text-amber-500 bg-amber-500/10 border-amber-500/20",
  fix: "text-rose-500 bg-rose-500/10 border-rose-500/20",
};

const TYPE_LABELS: Record<string, string> = {
  new: "New",
  improvement: "Improvement",
  security: "Security",
  fix: "Fix",
};

const MILESTONE_ICONS: Record<string, React.ElementType> = {
  milestone: Star,
  release: Rocket,
  foundation: Wrench,
  launch: Zap,
  security: ShieldCheck,
};

export default function ChangelogPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-surface pt-36 pb-20">
        <div
          className="pointer-events-none absolute inset-0 dot-grid opacity-40"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -top-1/3 left-1/2 aspect-square w-[60rem] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl"
          aria-hidden="true"
        />
        <div className="container-custom relative text-center max-w-3xl mx-auto">
          <AnimatedSection>
            <SectionHeader
              badge="Updates"
              title="Changelog"
              description="A running record of what's new at Sterova — service improvements, process updates, and notable milestones."
              centered
              size="page"
            />
          </AnimatedSection>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-y bg-background">
        <div className="container-custom max-w-3xl mx-auto">
          <div className="relative">
            {/* Vertical line */}
            <div
              className="absolute left-6 top-0 bottom-0 w-px bg-border hidden sm:block"
              aria-hidden="true"
            />

            <div className="flex flex-col gap-12">
              {CHANGELOG.map((block, bi) => {
                const BlockIcon = MILESTONE_ICONS[block.type] ?? Rocket;
                return (
                  <AnimatedSection key={block.version} delay={bi * 0.1}>
                    <div className="sm:pl-16 relative">
                      {/* Dot */}
                      <span className="hidden sm:flex absolute -left-0 top-0 h-12 w-12 items-center justify-center rounded-full border-2 border-primary/30 bg-background text-primary shadow-sm">
                        <BlockIcon className="h-5 w-5" />
                      </span>

                      <div className="mb-4">
                        <h2 className="font-display font-bold text-xl">{block.version}</h2>
                        <p className="text-sm text-muted-foreground">{block.date}</p>
                      </div>

                      <div className="flex flex-col gap-4">
                        {block.entries.map((entry) => (
                          <div key={entry.title} className="card-premium p-5">
                            <div className="flex items-start justify-between gap-4 mb-2">
                              <h3 className="font-semibold text-sm leading-snug">{entry.title}</h3>
                              <span
                                className={`shrink-0 text-[11px] font-medium border rounded-full px-2 py-0.5 ${TYPE_COLORS[entry.type] ?? ""}`}
                              >
                                {TYPE_LABELS[entry.type] ?? entry.type}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {entry.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </AnimatedSection>
                );
              })}
            </div>
          </div>

          <AnimatedSection delay={0.4} className="mt-16 text-center">
            <p className="text-sm text-muted-foreground">
              Follow product updates via the{" "}
              <a href="/newsletter" className="text-primary hover:underline font-medium">
                Sterova newsletter →
              </a>
            </p>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
