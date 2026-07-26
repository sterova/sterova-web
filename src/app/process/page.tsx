import type { Metadata } from "next";
import ProcessSection from "@/components/sections/ProcessSection";
import CTASection from "@/components/sections/CTASection";
import AnimatedSection from "@/components/shared/AnimatedSection";
import SectionHeader from "@/components/shared/SectionHeader";
import { SITE } from "@/data/constants";

export const metadata: Metadata = {
  title: "Process",
  description: `How ${SITE.name} works — from discovery and scoping through architecture, development sprints, QA, launch, and post-launch support.`,
  alternates: { canonical: "/process" },
};

export default function ProcessPage() {
  return (
    <>
      <section className="pt-32 pb-8 bg-secondary/30">
        <div className="container-custom text-center">
          <AnimatedSection>
            <SectionHeader
              badge="How We Work"
              title="A process that minimizes risk"
              description="We follow a structured, transparent six-stage process so you always know what's happening, what comes next, and why."
              centered
            />
          </AnimatedSection>
        </div>
      </section>
      <ProcessSection />
      <CTASection title="Ready to start the process?" />
    </>
  );
}
