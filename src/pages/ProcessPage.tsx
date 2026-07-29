import ProcessSection from "@/components/sections/ProcessSection";
import CTASection from "@/components/sections/CTASection";
import AnimatedSection from "@/components/shared/AnimatedSection";
import SectionHeader from "@/components/shared/SectionHeader";

export default function ProcessPage() {
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
