import {
  ArrowRight,
  Check,
  Compass,
  Eye,
  HeartHandshake,
  Lightbulb,
  MessageSquare,
  Search,
  ShieldCheck,
  Target,
  Telescope,
  Workflow,
} from "lucide-react";
import { Link } from "@/lib/router-compat";
import { Button } from "@/components/ui/button";
import SectionHeader from "@/components/shared/SectionHeader";
import CTASection from "@/components/sections/CTASection";
import AnimatedSection from "@/components/shared/AnimatedSection";
import StatsSection from "@/components/sections/StatsSection";
import TeamSection from "@/components/sections/TeamSection";
import { ABOUT } from "@/data/constants";

const valueIcons = [Lightbulb, Target, MessageSquare, ShieldCheck, HeartHandshake, Compass];

const credibilityPoints = [
  {
    title: "Start with the real problem",
    description:
      "We take time to understand your customer, workflow, and priorities before proposing a solution.",
    icon: Search,
  },
  {
    title: "A plan you can follow",
    description:
      "You get a clear scope, sensible milestones, and direct communication throughout the project.",
    icon: Workflow,
  },
  {
    title: "Built for everyday use",
    description:
      "We balance polished design with performance, accessibility, and the practical details that keep a product useful.",
    icon: Check,
  },
  {
    title: "A partner beyond launch",
    description:
      "Launching is a beginning, not a hand-off. We stay available for improvements, support, and the next phase.",
    icon: HeartHandshake,
  },
];

const journey = [
  {
    stage: "The starting point",
    title: "A better standard for growing businesses",
    description:
      "Sterova exists because capable businesses deserve more than a generic website or a confusing software process.",
  },
  {
    stage: "The belief",
    title: "Good digital work should feel clear",
    description:
      "The best products make life simpler for the people using them—and make the path to building them easier to understand.",
  },
  {
    stage: "Today",
    title: "Focused, practical digital products",
    description:
      "We help founders and teams turn ideas into websites, online stores, and software that earns its place in the business.",
  },
  {
    stage: "What is next",
    title: "Growing alongside the businesses we serve",
    description:
      "Our ambition is to be the dependable long-term partner clients call when they are ready for the next meaningful step.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-border bg-surface pb-20 pt-36 sm:pb-24">
        <div
          className="pointer-events-none absolute inset-0 dot-grid opacity-40"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -top-1/3 left-1/2 aspect-square w-[60rem] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl"
          aria-hidden="true"
        />
        <div className="container-custom relative text-center">
          <AnimatedSection>
            <SectionHeader
              badge="About Sterova"
              title="The digital partner for businesses building what’s next"
              description={ABOUT.heroDescription}
              centered
              size="page"
            />
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild variant="gradient" size="lg" className="group">
                <Link href="/contact">
                  Start a conversation
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/services">Explore our services</Link>
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="section-y bg-background">
        <div className="container-custom grid gap-12 lg:grid-cols-12 lg:items-start lg:gap-20">
          <AnimatedSection className="lg:col-span-5">
            <span className="eyebrow">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
              Why Sterova exists
            </span>
            <h2 className="mt-6 font-display text-h2 font-semibold text-balance">
              Digital work should make your business feel more capable.
            </h2>
          </AnimatedSection>
          <AnimatedSection
            delay={0.08}
            className="space-y-5 text-lg leading-relaxed text-muted-foreground lg:col-span-7"
          >
            <p>
              Too many growing businesses are asked to choose between an inexpensive template that
              cannot keep up and a complex agency process that feels out of reach. Sterova was
              created to close that gap.
            </p>
            <p>
              We bring together strategy, design, and engineering to create digital products that
              are useful from day one—whether that is a confident new website, a straightforward
              online store, or a focused tool that removes friction from the way your team works.
            </p>
            <p className="font-medium text-foreground">
              Our job is not to add technology for its own sake. It is to help you make the next
              business decision with more clarity and confidence.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="border-y border-border bg-surface py-16 sm:py-20">
        <div className="container-custom grid gap-px overflow-hidden rounded-3xl border border-border bg-border md:grid-cols-2">
          <AnimatedSection className="bg-card p-8 sm:p-10">
            <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Target className="h-6 w-6" aria-hidden="true" />
            </div>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
              Our mission
            </p>
            <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight">
              Make useful digital products easier to build.
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">{ABOUT.mission}</p>
          </AnimatedSection>
          <AnimatedSection delay={0.08} className="bg-card p-8 sm:p-10">
            <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Telescope className="h-6 w-6" aria-hidden="true" />
            </div>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
              Our vision
            </p>
            <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight">
              Be the team clients rely on as they grow.
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">{ABOUT.vision}</p>
          </AnimatedSection>
        </div>
      </section>

      <section className="section-y bg-background">
        <div className="container-custom">
          <SectionHeader
            badge="Core values"
            title="How we show up for the work"
            description="Our principles are simple: listen closely, make thoughtful choices, and take responsibility for the result."
            centered
            className="mb-14"
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {ABOUT.values.map((value, index) => {
              const Icon = valueIcons[index] ?? Compass;
              return (
                <AnimatedSection key={value.title} delay={index * 0.06}>
                  <article className="card-premium group h-full p-7 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[var(--shadow-card-hover)]">
                    <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                    <h3 className="mt-5 font-display text-lg font-semibold tracking-tight text-foreground">
                      {value.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {value.description}
                    </p>
                  </article>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-y border-y border-border bg-surface">
        <div className="container-custom">
          <SectionHeader
            badge="Why choose Sterova"
            title="A calm, capable way to build"
            description="You should never have to guess where a project stands or why a decision was made."
            centered
            className="mb-14"
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {credibilityPoints.map((point, index) => {
              const Icon = point.icon;
              return (
                <AnimatedSection key={point.title} delay={index * 0.06}>
                  <article className="h-full rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <h3 className="mt-5 font-display text-base font-semibold tracking-tight">
                      {point.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {point.description}
                    </p>
                  </article>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-y bg-background">
        <div className="container-custom">
          <SectionHeader
            badge="Our journey"
            title="How Sterova is being built"
            description="The direction has stayed consistent: make excellent digital work more accessible, more understandable, and more accountable."
            centered
            className="mb-14"
          />
          <ol className="mx-auto max-w-4xl border-l border-border pl-6 sm:pl-10">
            {journey.map((step, index) => (
              <li key={step.stage} className="relative pb-10 last:pb-0">
                <span
                  className="absolute -left-[1.95rem] top-1 grid h-6 w-6 place-items-center rounded-full border-4 border-background bg-primary sm:-left-[2.7rem]"
                  aria-hidden="true"
                />
                <AnimatedSection delay={index * 0.07}>
                  <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
                    {step.stage}
                  </p>
                  <h3 className="mt-2 font-display text-xl font-semibold tracking-tight">
                    {step.title}
                  </h3>
                  <p className="mt-2 max-w-2xl leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </AnimatedSection>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <StatsSection />
      <TeamSection />

      <CTASection
        title="Have something important to move forward?"
        description="Tell us where your business is today and where you want it to go. We’ll give you a clear, practical next step."
      />
    </>
  );
}
