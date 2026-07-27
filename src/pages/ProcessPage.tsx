import ProcessSection from "@/components/sections/ProcessSection";
import CTASection from "@/components/sections/CTASection";
import AnimatedSection from "@/components/shared/AnimatedSection";
import SectionHeader from "@/components/shared/SectionHeader";

export default function ProcessPage() {
  return (
    <>
      <section className="pt-32 pb-8 bg-secondary/30">
        <div className="container-custom text-center">
          <AnimatedSection>
            <SectionHeader
              badge="How We Work"
              title="A process built to remove risk"
              description="We follow a structured, transparent six-stage process so you always know what's happening, what comes next, and why."
              centered
              size="page"
            />
          </AnimatedSection>
        </div>
      </section>
      <ProcessSection />
      <CTASection title="Ready to start the process?" />
    </>
  );
}
