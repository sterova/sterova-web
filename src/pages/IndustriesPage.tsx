import { useLoaderData } from "@tanstack/react-router";
import * as Icons from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";
import CTASection from "@/components/sections/CTASection";
import AnimatedSection from "@/components/shared/AnimatedSection";
import type { IndustryRow } from "@/types/database";

export default function IndustriesPage() {
  const industries = useLoaderData({ from: "/industries" }) as IndustryRow[];

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
              badge="Industries"
              title="Tailored solutions for your sector"
              description="We understand that every industry has unique challenges, compliance requirements, and user expectations."
              centered
              size="page"
            />
          </AnimatedSection>
        </div>
      </section>

      <section className="section-y bg-background">
        <div className="container-custom">
          {industries.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              No industries configured yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {industries.map((industry, idx) => {
                const IconComponent =
                  industry.icon_key &&
                  (Icons as unknown as Record<string, React.ElementType>)[industry.icon_key]
                    ? (Icons as unknown as Record<string, React.ElementType>)[industry.icon_key]
                    : Icons.Briefcase;

                return (
                  <AnimatedSection key={industry.id} delay={idx * 0.1}>
                    <div className="card-premium h-full p-8 flex flex-col items-start transition-all hover:border-primary/50">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-6">
                        <IconComponent className="h-7 w-7" />
                      </div>
                      <h3 className="text-xl font-bold font-display mb-3">{industry.name}</h3>
                      <p className="text-muted-foreground leading-relaxed flex-1">
                        {industry.description}
                      </p>
                    </div>
                  </AnimatedSection>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <CTASection />
    </>
  );
}
