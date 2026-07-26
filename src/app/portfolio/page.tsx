import type { Metadata } from "next";
import PortfolioSection from "@/components/sections/PortfolioSection";
import CTASection from "@/components/sections/CTASection";
import AnimatedSection from "@/components/shared/AnimatedSection";
import SectionHeader from "@/components/shared/SectionHeader";
import { SITE } from "@/data/constants";

export const metadata: Metadata = {
  title: "Portfolio",
  description: `Case studies and projects by ${SITE.name} — FinTech dashboards, healthcare portals, SaaS platforms, e-commerce, and more.`,
  alternates: { canonical: "/portfolio" },
};

export default function PortfolioPage() {
  return (
    <>
      <section className="pt-32 pb-8 bg-secondary/30">
        <div className="container-custom text-center">
          <AnimatedSection>
            <SectionHeader
              badge="Portfolio"
              title="Products we've built"
              description="A selection of client projects across industries. Every project is a partnership — we stay engaged from concept to post-launch."
              centered
            />
          </AnimatedSection>
        </div>
      </section>
      <PortfolioSection showCta={false} />
      <CTASection title="Your product could be next" />
    </>
  );
}
