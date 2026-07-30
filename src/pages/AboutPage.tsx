import { Target, Telescope } from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";
import CTASection from "@/components/sections/CTASection";
import AnimatedSection from "@/components/shared/AnimatedSection";
import StatsSection from "@/components/sections/StatsSection";
import TeamSection from "@/components/sections/TeamSection";
import { ABOUT } from "@/data/constants";

export default function AboutPage() {
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
        <div className="container-custom relative text-center">
          <AnimatedSection>
            <SectionHeader
              badge="About Sterova"
              title="Engineering-first software development"
              description={ABOUT.heroDescription}
              centered
              size="page"
            />
          </AnimatedSection>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-y">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AnimatedSection delay={0.1}>
              <div className="card-premium h-full p-8">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 text-primary mb-5">
                  <Target className="h-6 w-6" aria-hidden="true" />
                </div>
                <h2 className="text-2xl font-semibold mb-3">Our Mission</h2>
                <p className="text-muted-foreground leading-relaxed">{ABOUT.mission}</p>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={0.15}>
              <div className="card-premium h-full p-8">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 text-primary mb-5">
                  <Telescope className="h-6 w-6" aria-hidden="true" />
                </div>
                <h2 className="text-2xl font-semibold mb-3">Our Vision</h2>
                <p className="text-muted-foreground leading-relaxed">{ABOUT.vision}</p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-y bg-surface">
        <div className="container-custom">
          <SectionHeader
            badge="Our Values"
            title="What we stand for"
            description="Every decision we make is guided by these principles."
            centered
            className="mb-16"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ABOUT.values.map((value, i) => (
              <AnimatedSection key={value.title} delay={i * 0.07}>
                <div className="card-premium h-full p-6">
                  <h3 className="text-lg font-semibold mb-2 text-primary">{value.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <StatsSection />
      <TeamSection />

      <CTASection
        title="Work with a team that treats your product like their own"
        description="We're selective about the projects we take on so we can be fully invested in each one."
      />
    </>
  );
}
