import { Link } from "@/lib/router-compat";
import AnimatedSection from "@/components/shared/AnimatedSection";
import SectionHeader from "@/components/shared/SectionHeader";
import CTASection from "@/components/sections/CTASection";
import { FileCode2, ArrowRight, BookOpen, Plug, Shield, Rocket, Settings, HelpCircle } from "lucide-react";

const DOC_SECTIONS = [
  {
    icon: Rocket,
    title: "Getting Started",
    description: "How to kick off your project with Sterova — from first call to signed scope.",
    articles: [
      "How the engagement process works",
      "What to prepare before the scoping call",
      "Understanding your project proposal",
      "Milestone and payment schedule",
    ],
  },
  {
    icon: Settings,
    title: "Project Management",
    description: "Day-to-day collaboration: sprint cadence, access, and communication.",
    articles: [
      "Sprint demo and review process",
      "How to give effective design feedback",
      "Code repository access and branching",
      "Escalation and change request process",
    ],
  },
  {
    icon: Plug,
    title: "Integrations & Handoff",
    description: "What we deliver and how we hand it over — fully documented and production-ready.",
    articles: [
      "What's included in a project handoff",
      "Infrastructure access and credentials",
      "CI/CD pipeline documentation",
      "Post-launch support process",
    ],
  },
  {
    icon: Shield,
    title: "Security & Compliance",
    description: "Our security standards, NDA process, and data handling policies.",
    articles: [
      "Signing NDAs and data agreements",
      "How we handle sensitive data",
      "Our security baseline for all projects",
      "GDPR and compliance considerations",
    ],
  },
  {
    icon: BookOpen,
    title: "Technical References",
    description: "Standards and patterns we apply to every project we build.",
    articles: [
      "Code style and review standards",
      "Testing requirements by project type",
      "Deployment and infrastructure defaults",
      "API design conventions",
    ],
  },
  {
    icon: HelpCircle,
    title: "Frequently Asked Questions",
    description: "Quick answers to the questions we hear most from new and returning clients.",
    articles: [
      "How long does a typical project take?",
      "How is pricing structured?",
      "Can you work with our existing codebase?",
      "What happens after launch?",
    ],
    href: "/faq",
  },
];

export default function DocsPage() {
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
              badge="Documentation"
              title="Client Documentation"
              description="Everything you need to work with Sterova effectively — from project kickoff to post-launch maintenance."
              centered
              size="page"
            />
          </AnimatedSection>
        </div>
      </section>

      {/* Docs grid */}
      <section className="section-y bg-background">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {DOC_SECTIONS.map((section, i) => {
              const Icon = section.icon;
              return (
                <AnimatedSection key={section.title} delay={i * 0.07}>
                  <div className="card-premium h-full p-6 flex flex-col group hover:shadow-[var(--shadow-card-hover)] transition-shadow">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-primary">
                        <Icon className="h-5 w-5" />
                      </span>
                      <h2 className="font-semibold text-base">{section.title}</h2>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                      {section.description}
                    </p>
                    <ul className="flex-1 space-y-2 mb-5">
                      {section.articles.map((article) => (
                        <li
                          key={article}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary/60 shrink-0" />
                          {article}
                        </li>
                      ))}
                    </ul>
                    {section.href ? (
                      <Link
                        href={section.href}
                        className="flex items-center gap-1 text-sm font-medium text-primary mt-auto"
                      >
                        View all
                        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                      </Link>
                    ) : (
                      <a
                        href={`mailto:hello@sterova.tech?subject=Documentation: ${section.title}`}
                        className="flex items-center gap-1 text-sm font-medium text-primary mt-auto"
                      >
                        Ask a question
                        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                      </a>
                    )}
                  </div>
                </AnimatedSection>
              );
            })}
          </div>

          <AnimatedSection delay={0.4} className="mt-12 rounded-2xl border border-border bg-card p-8 text-center">
            <FileCode2 className="h-8 w-8 text-primary mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Can't find what you're looking for?</h3>
            <p className="text-sm text-muted-foreground mb-5">
              Our team is happy to answer any questions about our process, standards, or how to work with us.
            </p>
            <a
              href="mailto:hello@sterova.tech"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Email us directly
              <ArrowRight className="h-4 w-4" />
            </a>
          </AnimatedSection>
        </div>
      </section>

      <CTASection />
    </>
  );
}
