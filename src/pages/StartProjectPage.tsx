import { Check } from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";
import AnimatedSection from "@/components/shared/AnimatedSection";
import ContactLinksPanel from "@/components/shared/ContactLinksPanel";
import ServiceInquiryForm from "@/components/forms/ServiceInquiryForm";
import { SERVICES } from "@/data/constants";

interface Props {
  serviceSlug?: string;
}

export default function StartProjectPage({ serviceSlug = "" }: Props) {
  const service = SERVICES.find((s) => s.slug === serviceSlug && s.is_active);

  return (
    <section className="relative overflow-hidden pt-36 pb-24">
      <div
        className="pointer-events-none absolute inset-0 dot-grid opacity-30"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -top-1/3 left-1/2 aspect-square w-[55rem] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl"
        aria-hidden="true"
      />
      <div className="container-custom relative">
        <AnimatedSection>
          <SectionHeader
            badge={service ? service.title : "Start a project"}
            title={
              service
                ? `Let's scope your ${service.title.toLowerCase()}`
                : "Tell us about your project"
            }
            description={
              service
                ? service.short_description
                : "Share the essentials and we'll come back within 24 hours with questions, an approach and an indicative scope."
            }
            size="page"
          />
        </AnimatedSection>

        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left — form */}
          <AnimatedSection className="lg:col-span-7 xl:col-span-8" delay={0.05}>
            <div className="card-premium p-6 sm:p-8">
              <ServiceInquiryForm initialService={service?.slug ?? ""} />
            </div>
          </AnimatedSection>

          {/* Right — links, contact details and context */}
          <AnimatedSection className="lg:col-span-5 xl:col-span-4" delay={0.12} direction="right">
            {service && (
              <div className="card-premium mb-6 p-6">
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                  What&apos;s included
                </p>
                <ul className="mt-4 space-y-2">
                  {service.features.slice(0, 5).map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                      <span className="leading-snug">{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex flex-wrap gap-1.5 border-t border-border/70 pt-4">
                  {service.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 font-mono text-[10px] tracking-wide text-primary"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <ContactLinksPanel />
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
