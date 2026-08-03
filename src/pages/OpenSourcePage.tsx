import AnimatedSection from "@/components/shared/AnimatedSection";
import SectionHeader from "@/components/shared/SectionHeader";
import CTASection from "@/components/sections/CTASection";
import { Github, Star, GitFork, ExternalLink, Heart, ArrowRight } from "lucide-react";
import { SITE } from "@/data/constants";

const PROJECTS = [
  {
    name: "sterova-ui",
    description:
      "A collection of production-ready React components, hooks, and design primitives used across Sterova's client projects. Built on Radix UI and Tailwind CSS.",
    language: "TypeScript",
    stars: null,
    forks: null,
    status: "active" as const,
    topics: ["react", "tailwindcss", "radix-ui", "typescript"],
  },
  {
    name: "supabase-rls-helper",
    description:
      "Utilities and testing helpers for writing and verifying Supabase Row Level Security policies — bridging the gap between policy intent and runtime behavior.",
    language: "TypeScript",
    stars: null,
    forks: null,
    status: "active" as const,
    topics: ["supabase", "postgresql", "rls", "testing"],
  },
  {
    name: "tanstack-start-template",
    description:
      "An opinionated TanStack Start starter with Supabase, Tailwind CSS v4, shadcn/ui, type-safe environment variables, and a production-ready CI/CD setup.",
    language: "TypeScript",
    stars: null,
    forks: null,
    status: "coming-soon" as const,
    topics: ["tanstack", "vite", "typescript", "template"],
  },
];

const LANG_COLORS: Record<string, string> = {
  TypeScript: "bg-blue-500",
  JavaScript: "bg-yellow-400",
  Python: "bg-green-500",
  Rust: "bg-orange-500",
};

export default function OpenSourcePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-surface pt-36 pb-20">
        <div className="pointer-events-none absolute inset-0 dot-grid opacity-40" aria-hidden="true" />
        <div
          className="pointer-events-none absolute -top-1/3 left-1/2 aspect-square w-[60rem] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl"
          aria-hidden="true"
        />
        <div className="container-custom relative text-center max-w-4xl mx-auto">
          <AnimatedSection>
            <SectionHeader
              badge="Community"
              title="Open Source"
              description="Tools, libraries, and starter templates the Sterova engineering team maintains and contributes to publicly."
              centered
              size="page"
            />
          </AnimatedSection>
          <AnimatedSection delay={0.15}>
            <a
              href={SITE.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium hover:border-primary/40 hover:text-primary transition-colors"
            >
              <Github className="h-4 w-4" />
              @sterova on GitHub
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </AnimatedSection>
        </div>
      </section>

      {/* Projects */}
      <section className="section-y bg-background">
        <div className="container-custom max-w-4xl mx-auto">
          <div className="flex flex-col gap-5">
            {PROJECTS.map((project, i) => (
              <AnimatedSection key={project.name} delay={i * 0.08}>
                <div
                  className={`card-premium p-6 flex flex-col sm:flex-row gap-5 ${project.status === "coming-soon" ? "opacity-60" : "group hover:shadow-[var(--shadow-card-hover)] transition-shadow"}`}
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-surface text-foreground">
                    <Github className="h-5 w-5" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <h2 className="font-mono font-semibold text-base group-hover:text-primary transition-colors">
                          sterova/{project.name}
                        </h2>
                        {project.status === "coming-soon" && (
                          <span className="text-xs font-medium text-muted-foreground border border-border rounded-full px-2.5 py-0.5">
                            Coming soon
                          </span>
                        )}
                      </div>
                      {project.status !== "coming-soon" && (
                        <a
                          href={`${SITE.social.github}/${project.name}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          GitHub
                        </a>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                      {project.description}
                    </p>
                    <div className="flex items-center gap-4 flex-wrap">
                      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <span
                          className={`h-2.5 w-2.5 rounded-full ${LANG_COLORS[project.language] ?? "bg-zinc-400"}`}
                        />
                        {project.language}
                      </span>
                      {project.stars !== null && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Star className="h-3.5 w-3.5" />
                          {project.stars}
                        </span>
                      )}
                      {project.forks !== null && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <GitFork className="h-3.5 w-3.5" />
                          {project.forks}
                        </span>
                      )}
                      <div className="flex gap-1.5 flex-wrap">
                        {project.topics.map((t) => (
                          <span
                            key={t}
                            className="text-xs font-medium text-primary border border-primary/20 bg-primary/5 rounded-full px-2 py-0.5"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>

          {/* Contribute */}
          <AnimatedSection delay={0.3} className="mt-12 rounded-2xl border border-primary/20 bg-primary/5 p-8 text-center">
            <Heart className="h-8 w-8 text-primary mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Want to contribute?</h3>
            <p className="text-sm text-muted-foreground mb-5 max-w-md mx-auto">
              We welcome pull requests, bug reports, and feature suggestions. Check the issues tab on any repository for good first issues.
            </p>
            <a
              href={SITE.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Github className="h-4 w-4" />
              View on GitHub
              <ArrowRight className="h-4 w-4" />
            </a>
          </AnimatedSection>
        </div>
      </section>

      <CTASection />
    </>
  );
}
