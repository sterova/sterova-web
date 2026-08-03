import AnimatedSection from "@/components/shared/AnimatedSection";
import SectionHeader from "@/components/shared/SectionHeader";
import CTASection from "@/components/sections/CTASection";
import { BookOpen, ArrowRight, Clock, Tag } from "lucide-react";

const WHITEPAPERS = [
  {
    title: "Choosing a Database Architecture for SaaS Products",
    description:
      "A practical guide to selecting between multi-tenant shared schemas, row-level security, and fully isolated databases — with tradeoffs mapped to scale and compliance requirements.",
    topics: ["Architecture", "SaaS", "PostgreSQL"],
    readTime: "15 min read",
    status: "published" as const,
  },
  {
    title: "The Modern API Design Playbook",
    description:
      "Patterns for designing REST and GraphQL APIs that are intuitive to consume, easy to version, and ready to scale — including error handling, pagination, and auth strategies.",
    topics: ["API Design", "REST", "GraphQL"],
    readTime: "12 min read",
    status: "published" as const,
  },
  {
    title: "React Native vs Flutter: An Engineering-First Comparison",
    description:
      "Beyond the marketing — a head-to-head technical comparison from teams who have shipped production apps with both frameworks, covering performance, DX, and long-term maintenance.",
    topics: ["Mobile", "React Native", "Flutter"],
    readTime: "10 min read",
    status: "published" as const,
  },
  {
    title: "Security-First Development: Practical Principles for SaaS",
    description:
      "A pragmatic checklist and architectural guide for building SaaS products that are defensible by default — covering auth, data isolation, secrets management, and vulnerability handling.",
    topics: ["Security", "SaaS", "Best Practices"],
    readTime: "18 min read",
    status: "published" as const,
  },
  {
    title: "Building Maintainable Frontend Codebases",
    description:
      "Patterns and conventions the Sterova team applies to keep large React codebases navigable, testable, and refactorable as products grow.",
    topics: ["Frontend", "React", "TypeScript"],
    readTime: "14 min read",
    status: "published" as const,
  },
  {
    title: "From MVP to Scale: Engineering Decisions That Age Well",
    description:
      "A framework for making technical decisions early in a product's life that don't become expensive liabilities six months later.",
    topics: ["Architecture", "Startups", "Scalability"],
    readTime: "11 min read",
    status: "coming-soon" as const,
  },
];

export default function WhitepapersPage() {
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
              badge="Research"
              title="Whitepapers & Technical Guides"
              description="In-depth technical research, architectural decision frameworks, and engineering playbooks authored by the Sterova team."
              centered
              size="page"
            />
          </AnimatedSection>
        </div>
      </section>

      {/* Whitepapers list */}
      <section className="section-y bg-background">
        <div className="container-custom max-w-4xl mx-auto">
          <div className="flex flex-col gap-5">
            {WHITEPAPERS.map((paper, i) => (
              <AnimatedSection key={paper.title} delay={i * 0.07}>
                <div
                  className={`card-premium p-6 sm:p-8 flex flex-col sm:flex-row sm:items-start gap-6 ${paper.status === "coming-soon" ? "opacity-60" : "group hover:shadow-[var(--shadow-card-hover)] transition-shadow"}`}
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-border bg-surface text-primary">
                    <BookOpen className="h-5 w-5" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h2 className="text-lg font-semibold leading-snug group-hover:text-primary transition-colors">
                        {paper.title}
                      </h2>
                      {paper.status === "coming-soon" && (
                        <span className="shrink-0 text-xs font-medium text-muted-foreground border border-border rounded-full px-2.5 py-0.5">
                          Coming soon
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                      {paper.description}
                    </p>
                    <div className="flex items-center gap-4 flex-wrap">
                      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        {paper.readTime}
                      </span>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <Tag className="h-3.5 w-3.5 text-muted-foreground" />
                        {paper.topics.map((t) => (
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
                  {paper.status === "published" && (
                    <div className="shrink-0 flex items-center gap-1 text-sm font-medium text-primary">
                      Read
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </div>
                  )}
                </div>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection delay={0.4} className="mt-12 text-center">
            <p className="text-sm text-muted-foreground">
              New whitepapers are published quarterly.{" "}
              <a href="/newsletter" className="text-primary hover:underline font-medium">
                Subscribe to be notified →
              </a>
            </p>
          </AnimatedSection>
        </div>
      </section>

      <CTASection />
    </>
  );
}
