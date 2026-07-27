import PortfolioSection from "@/components/sections/PortfolioSection";
import CTASection from "@/components/sections/CTASection";
import AnimatedSection from "@/components/shared/AnimatedSection";
import SectionHeader from "@/components/shared/SectionHeader";
import { PORTFOLIO_ITEMS } from "@/data/constants";

export default function PortfolioPage() {
  return (
    <>
      <section className="pt-32 pb-8 bg-secondary/30">
        <div className="container-custom text-center">
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
      <PortfolioSection items={PORTFOLIO_ITEMS} showCta={false} />
      <CTASection title="Your product could be next" />
    </>
  );
}
