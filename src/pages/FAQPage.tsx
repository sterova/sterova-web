import { useLoaderData } from "@tanstack/react-router";
import SectionHeader from "@/components/shared/SectionHeader";
import CTASection from "@/components/sections/CTASection";
import FAQSection from "@/components/sections/FAQSection";
import AnimatedSection from "@/components/shared/AnimatedSection";
import type { FAQRow } from "@/types/database";

export default function FAQPage() {
  const faqs = useLoaderData({ from: "/faq" }) as FAQRow[];

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
              badge="FAQ"
              title="Frequently Asked Questions"
              description="Everything you need to know about how we work, what we charge, and what you can expect when partnering with us."
              centered
              size="page"
            />
          </AnimatedSection>
        </div>
      </section>

      {/* The FAQSection handles rendering the FAQs with an accordion */}
      <FAQSection faqs={faqs} showHeader={false} />

      <CTASection
        title="Still have questions?"
        description="Reach out to our team. We're happy to discuss your specific needs."
      />
    </>
  );
}
