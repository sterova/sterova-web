import type { Metadata } from "next";
import SectionHeader from "@/components/shared/SectionHeader";
import CTASection from "@/components/sections/CTASection";
import AnimatedSection from "@/components/shared/AnimatedSection";
import { ABOUT, SITE } from "@/data/constants";

export const metadata: Metadata = {
  title: "About",
  description: `${SITE.name} is a modern software development company. ${ABOUT.mission}`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-secondary/30">
        <div className="container-custom text-center">
          <AnimatedSection>
            <SectionHeader
              badge="About Sterova"
              title="Engineering-first software development"
              description={ABOUT.mission}
              centered
            />
          </AnimatedSection>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AnimatedSection delay={0.1}>
              <div className="rounded-2xl border bg-background p-8 h-full">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-5">
                  <span className="text-2xl" aria-hidden="true">🎯</span>
                </div>
                <h2 className="text-2xl font-semibold mb-3">Our Mission</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {ABOUT.mission}
                </p>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={0.15}>
              <div className="rounded-2xl border bg-background p-8 h-full">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-5">
                  <span className="text-2xl" aria-hidden="true">🌍</span>
                </div>
                <h2 className="text-2xl font-semibold mb-3">Our Vision</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {ABOUT.vision}
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-secondary/30">
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
                <div className="rounded-2xl border bg-background p-6 hover:border-primary/30 hover:shadow-sm transition-all h-full">
                  <h3 className="text-lg font-semibold mb-2 text-primary">
                    {value.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Work with a team that treats your product like their own"
        description="We're selective about the projects we take on so we can be fully invested in each one."
      />
    </>
  );
}
