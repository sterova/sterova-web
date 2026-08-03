import { CheckCircle2 } from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";
import CTASection from "@/components/sections/CTASection";
import FAQSection from "@/components/sections/FAQSection";
import AnimatedSection from "@/components/shared/AnimatedSection";
import { FAQS } from "@/data/constants";
import { Link } from "@tanstack/react-router";

export default function PricingPage() {
  const tiers = [
    {
      name: "Dedicated Team",
      description: "An elite engineering squad fully integrated with your business.",
      features: [
        "Full-time dedicated engineers",
        "Direct communication channels",
        "Agile project management",
        "Weekly sprints & reporting",
        "Code quality guarantees",
        "Flexible scaling up/down",
      ],
      isPopular: true,
      cta: "Contact Us",
      href: "/contact",
    },
    {
      name: "Project Based",
      description: "End-to-end delivery of a fixed-scope product or feature set.",
      features: [
        "Clear scope and timeline",
        "Fixed budget delivery",
        "Dedicated project manager",
        "UI/UX Design included",
        "Quality assurance testing",
        "Post-launch support period",
      ],
      isPopular: false,
      cta: "Get an Estimate",
      href: "/estimate",
    },
  ];

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
        <div className="container-custom relative text-center max-w-4xl mx-auto">
          <AnimatedSection>
            <SectionHeader
              badge="Pricing"
              title="Transparent, value-driven engagement models"
              description="Whether you need an entire engineering team or a one-off product build, we offer flexible models tailored to your business needs."
              centered
              size="page"
            />
          </AnimatedSection>
        </div>
      </section>

      <section className="section-y bg-background">
        <div className="container-custom max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {tiers.map((tier, idx) => (
              <AnimatedSection key={tier.name} delay={idx * 0.1}>
                <div
                  className={`card-premium relative flex flex-col h-full p-8 md:p-10 ${
                    tier.isPopular ? "border-primary/50 shadow-primary/10 shadow-2xl" : ""
                  }`}
                >
                  {tier.isPopular && (
                    <div className="absolute top-0 right-8 -translate-y-1/2 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-3xl font-bold font-display mb-2">{tier.name}</h3>
                  <p className="text-muted-foreground mb-8 min-h-[48px]">{tier.description}</p>

                  <div className="space-y-4 flex-1 mb-8">
                    {tier.features.map((feature) => (
                      <div key={feature} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                        <span className="font-medium text-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Link
                    to={tier.href}
                    className={`inline-flex w-full items-center justify-center rounded-xl px-5 py-3.5 text-sm font-semibold transition-all ${
                      tier.isPopular
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "bg-surface hover:bg-muted text-foreground border border-border"
                    }`}
                  >
                    {tier.cta}
                  </Link>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <FAQSection faqs={FAQS} />
      <CTASection />
    </>
  );
}
