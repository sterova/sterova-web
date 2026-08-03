import SectionHeader from "@/components/shared/SectionHeader";
import CTASection from "@/components/sections/CTASection";
import ProcessSection from "@/components/sections/ProcessSection";
import AnimatedSection from "@/components/shared/AnimatedSection";

export default function ProcessPage() {
  return (
    <>
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
              badge="Our Process"
              title="How we build digital products"
              description="A proven methodology focused on clear communication, rapid iteration, and delivering measurable business value."
              centered
              size="page"
            />
          </AnimatedSection>
        </div>
      </section>

      <ProcessSection />

      <CTASection
        title="Ready to start your project?"
        description="Our team is ready to help you define, design, and develop your next big idea."
      />
    </>
  );
}
