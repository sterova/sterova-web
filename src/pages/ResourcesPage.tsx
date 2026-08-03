import { Link } from "@/lib/router-compat";
import AnimatedSection from "@/components/shared/AnimatedSection";
import SectionHeader from "@/components/shared/SectionHeader";
import CTASection from "@/components/sections/CTASection";
import {
  PenLine,
  HelpCircle,
  Star,
  BookOpen,
  FileCode2,
  ListChecks,
  Newspaper,
  Github,
  ArrowRight,
  Mail,
} from "lucide-react";

const RESOURCES = [
  {
    icon: PenLine,
    label: "Blog",
    href: "/blog",
    description:
      "Engineering insights, product thinking, and lessons from building software at scale. Written by the Sterova delivery team.",
    badge: "Content",
    color: "from-violet-500/10 to-purple-500/10 border-violet-500/20",
    iconColor: "text-violet-500",
  },
  {
    icon: HelpCircle,
    label: "FAQ",
    href: "/faq",
    description:
      "Answers to the most common questions about working with Sterova — process, pricing, timelines, and technology.",
    badge: "Help",
    color: "from-blue-500/10 to-cyan-500/10 border-blue-500/20",
    iconColor: "text-blue-500",
  },
  {
    icon: Star,
    label: "Client Testimonials",
    href: "/testimonials",
    description:
      "Real feedback from the startups and enterprises we've partnered with. Reviews, ratings, and success stories.",
    badge: "Social Proof",
    color: "from-amber-500/10 to-yellow-500/10 border-amber-500/20",
    iconColor: "text-amber-500",
  },
  {
    icon: BookOpen,
    label: "Whitepapers",
    href: "/whitepapers",
    description:
      "In-depth technical research, architectural guides, and engineering playbooks authored by our team.",
    badge: "Research",
    color: "from-emerald-500/10 to-teal-500/10 border-emerald-500/20",
    iconColor: "text-emerald-500",
  },
  {
    icon: FileCode2,
    label: "Documentation",
    href: "/docs",
    description:
      "Onboarding guides, integration references, and technical documentation for clients and partners.",
    badge: "Guides",
    color: "from-sky-500/10 to-blue-500/10 border-sky-500/20",
    iconColor: "text-sky-500",
  },
  {
    icon: ListChecks,
    label: "Changelog",
    href: "/changelog",
    description:
      "A running record of what's new at Sterova — service improvements, process updates, and notable milestones.",
    badge: "Updates",
    color: "from-indigo-500/10 to-violet-500/10 border-indigo-500/20",
    iconColor: "text-indigo-500",
  },
  {
    icon: Newspaper,
    label: "Press Kit",
    href: "/press-kit",
    description:
      "Official logos, brand assets, boilerplate copy, leadership bios, and media contact information.",
    badge: "Media",
    color: "from-rose-500/10 to-pink-500/10 border-rose-500/20",
    iconColor: "text-rose-500",
  },
  {
    icon: Github,
    label: "Open Source",
    href: "/open-source",
    description:
      "Tools, libraries, and projects the Sterova team contributes to and maintains publicly on GitHub.",
    badge: "Community",
    color: "from-zinc-500/10 to-gray-500/10 border-zinc-500/20",
    iconColor: "text-zinc-400",
  },
];

export default function ResourcesPage() {
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
        <div className="container-custom relative text-center max-w-4xl mx-auto">
          <AnimatedSection>
            <SectionHeader
              badge="Knowledge Hub"
              title="Resources"
              description="Everything you need to learn about software engineering, understand how Sterova works, and get the most from your engagement with us."
              centered
              size="page"
            />
          </AnimatedSection>
        </div>
      </section>

      {/* Resources grid */}
      <section className="section-y bg-background">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {RESOURCES.map((item, i) => {
              const Icon = item.icon;
              return (
                <AnimatedSection key={item.href} delay={i * 0.05}>
                  <Link
                    href={item.href}
                    className={`group flex flex-col h-full rounded-2xl border bg-gradient-to-br p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)] ${item.color}`}
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <span
                        className={`flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-background/60 backdrop-blur-sm ${item.iconColor}`}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="text-xs font-medium text-muted-foreground border border-border/50 rounded-full px-2.5 py-0.5 bg-background/60">
                        {item.badge}
                      </span>
                    </div>
                    <h2 className="text-base font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {item.label}
                    </h2>
                    <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                      {item.description}
                    </p>
                    <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary">
                      Explore
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </div>
                  </Link>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="section-y bg-surface border-t border-border">
        <div className="container-custom max-w-2xl text-center">
          <AnimatedSection>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground mb-6">
              <Mail className="h-3.5 w-3.5" />
              Stay updated
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-4">
              Subscribe to our newsletter
            </h2>
            <p className="text-muted-foreground mb-8">
              Engineering insights and industry updates, once a month. No spam.
            </p>
            <Link
              href="/newsletter"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Subscribe free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </AnimatedSection>
        </div>
      </section>

      <CTASection />
    </>
  );
}
