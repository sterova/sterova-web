import type { ElementType } from "react";
import * as Icons from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";
import CTASection from "@/components/sections/CTASection";
import AnimatedSection from "@/components/shared/AnimatedSection";
import { INDUSTRY_SOLUTIONS } from "@/data/industry-solutions";

export default function IndustriesPage() {
  const industries = INDUSTRY_SOLUTIONS;

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
              title="Digital solutions for growing businesses"
              description="From simple websites and online stores to booking flows and business tools, we build practical digital experiences that help your business move forward."
              centered
              size="page"
            />
          </AnimatedSection>
        </div>
      </section>

      <section className="section-y bg-background">
        <div className="container-custom">
          <SectionHeader
            badge="Who we help"
            title="Built for the work you do every day"
            description="Choose the starting point that sounds like your business. We’ll shape the site, store, or tool around your goals and budget."
            centered
            className="mb-14"
          />

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {industries.map((industry, idx) => {
              const IconComponent =
                (Icons as unknown as Record<string, ElementType>)[industry.icon_key] ??
                Icons.Briefcase;

              return (
                <AnimatedSection key={industry.slug} delay={Math.min(idx, 8) * 0.06}>
                  <article className="card-premium group flex h-full flex-col p-7 transition-all duration-300 hover:-translate-y-1 hover:border-primary/35 hover:shadow-[var(--shadow-card-hover)]">
                    <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-surface text-primary transition-colors duration-300 group-hover:border-primary/30 group-hover:bg-primary group-hover:text-primary-foreground">
                      <IconComponent className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <h3 className="font-display text-xl font-semibold tracking-tight text-foreground">
                      {industry.name}
                    </h3>
                    <p className="mt-3 flex-1 leading-relaxed text-muted-foreground">
                      {industry.description}
                    </p>
                    {industry.solutions.length > 0 && (
                      <div className="mt-6 border-t border-border/60 pt-4">
                        <p className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                          Typical solutions
                        </p>
                        <ul
                          className="flex flex-wrap gap-1.5"
                          aria-label={`Typical solutions for ${industry.name}`}
                        >
                          {industry.solutions.map((solution) => (
                            <li
                              key={solution}
                              className="rounded-full border border-border bg-surface px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide text-foreground"
                            >
                              {solution}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </article>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
