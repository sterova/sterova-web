import { useLoaderData } from "@tanstack/react-router";
import { CheckCircle2, LayoutList } from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";
import CTASection from "@/components/sections/CTASection";
import FAQSection from "@/components/sections/FAQSection";
import AnimatedSection from "@/components/shared/AnimatedSection";
import { FAQS } from "@/data/constants";

export default function ServiceDetailsPage() {
  const service = useLoaderData({ from: "/services_/$slug" });

  if (!service) return null;

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-surface pt-36 pb-20">
        <div
          className="pointer-events-none absolute inset-0 dot-grid opacity-40"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -top-1/3 left-1/2 aspect-square w-[60rem] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl"
          aria-hidden="true"
        />
        <div className="container-custom relative text-center max-w-4xl mx-auto">
          <AnimatedSection>
            <SectionHeader
              badge="Service"
              title={service.title}
              description={service.overview}
              centered
              size="page"
            />
          </AnimatedSection>
        </div>
      </section>

      {/* Benefits */}
      {service.benefits && service.benefits.length > 0 && (
        <section className="section-y bg-background">
          <div className="container-custom max-w-5xl mx-auto">
            <SectionHeader
              title="Key Benefits"
              description="Why this service is critical to your digital strategy."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
              {service.benefits.map((benefit: string, idx: number) => (
                <AnimatedSection key={idx} delay={idx * 0.1}>
                  <div className="card-premium h-full p-6">
                    <CheckCircle2 className="h-6 w-6 text-primary mb-4" />
                    <p className="font-medium text-foreground">{benefit}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Process */}
      {service.process && service.process.length > 0 && (
        <section className="section-y bg-surface">
          <div className="container-custom max-w-5xl mx-auto">
            <SectionHeader
              title="Our Process"
              description="How we approach and deliver this service."
            />
            <div className="mt-12 space-y-6">
              {service.process.map((step: string, idx: number) => (
                <AnimatedSection key={idx} delay={idx * 0.1}>
                  <div className="flex gap-6 items-start group">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-background border border-border shadow-sm text-lg font-bold text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      {idx + 1}
                    </div>
                    <div className="pt-2">
                      <p className="text-lg font-medium text-foreground">{step}</p>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Pricing Approach */}
      {service.pricing_approach && (
        <section className="section-y bg-background">
          <div className="container-custom max-w-3xl mx-auto text-center">
            <AnimatedSection>
              <div className="card-premium p-10">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-6">
                  <LayoutList className="h-7 w-7" />
                </div>
                <h2 className="text-3xl font-bold mb-4 font-display text-foreground">
                  Pricing Approach
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {service.pricing_approach}
                </p>
              </div>
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* FAQ & CTA */}
      <FAQSection faqs={FAQS} limit={4} />
      <CTASection />
    </>
  );
}
