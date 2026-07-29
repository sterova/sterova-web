import PortfolioSection from "@/components/sections/PortfolioSection";
import CTASection from "@/components/sections/CTASection";
import AnimatedSection from "@/components/shared/AnimatedSection";
import SectionHeader from "@/components/shared/SectionHeader";

export default function PortfolioPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-border bg-surface pt-36 pb-16">
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
              badge="Portfolio"
              title="What we can build for you"
              description="Illustrative examples of the platforms and integrations we engineer. Every engagement is a partnership — we stay involved from concept through post-launch support."
              centered
              size="page"
            />
          </AnimatedSection>
        </div>
      </section>
      <PortfolioSection showCta={false} showHeader={false} />
      <CTASection title="Your product could be next" />
    </>
  );
}
