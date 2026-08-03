import { useLoaderData } from "@tanstack/react-router";
import { Link } from "@/lib/router-compat";
import { CheckCircle2, ArrowRight, Sparkles, MessageSquare } from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";
import CTASection from "@/components/sections/CTASection";
import AnimatedSection from "@/components/shared/AnimatedSection";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ServiceDetailsPage() {
  const service = useLoaderData({ from: "/services_/$slug" });

  if (!service) return null;

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-surface pt-36 pb-24">
        <div
          className="pointer-events-none absolute inset-0 dot-grid opacity-40"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -top-1/3 left-1/2 aspect-square w-[60rem] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 h-px w-3/4 bg-gradient-to-r from-transparent via-primary/30 to-transparent"
          aria-hidden="true"
        />
        <div className="container-custom relative max-w-4xl mx-auto text-center">
          <AnimatedSection>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary uppercase tracking-wider mb-6">
              <Sparkles className="h-3.5 w-3.5" />
              Service
            </span>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground mb-6 leading-[1.1]">
              {service.title}
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-10">
              {service.overview}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button asChild variant="gradient" size="lg" className="group rounded-full px-8">
                <Link href={`/start-project?service=${service.slug}`}>
                  Get a Quote for {service.title.split(" ")[0]}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full px-8">
                <Link href="/portfolio">View Our Work</Link>
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Benefits */}
      {service.benefits && service.benefits.length > 0 && (
        <section className="section-y bg-background">
          <div className="container-custom max-w-6xl mx-auto">
            <AnimatedSection>
              <SectionHeader
                badge="What You Get"
                title="Key capabilities & deliverables"
                description="Every engagement is scoped to your exact requirements. Here's what this service typically includes."
                centered
                className="mb-16"
              />
            </AnimatedSection>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {service.benefits.map((benefit: string, idx: number) => (
                <AnimatedSection key={idx} delay={idx * 0.06}>
                  <div className="group card-premium h-full p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <p className="font-medium text-foreground leading-relaxed">{benefit}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Process Timeline */}
      {service.process && service.process.length > 0 && (
        <section className="section-y bg-surface">
          <div className="container-custom max-w-4xl mx-auto">
            <AnimatedSection>
              <SectionHeader
                badge="Methodology"
                title="How we deliver this service"
                description="A structured, transparent process from discovery through deployment."
                centered
                className="mb-16"
              />
            </AnimatedSection>
            <div className="relative">
              {/* Vertical connecting line */}
              <div
                className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-primary/40 via-primary/20 to-transparent hidden md:block"
                aria-hidden="true"
              />
              <div className="space-y-0">
                {service.process.map((step: string, idx: number) => (
                  <AnimatedSection key={idx} delay={idx * 0.08}>
                    <div className="relative flex gap-6 items-start group pb-10 last:pb-0">
                      {/* Step number node */}
                      <div
                        className={cn(
                          "relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2 text-lg font-bold transition-all duration-300",
                          "bg-background border-border text-muted-foreground",
                          "group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-lg group-hover:shadow-primary/20",
                        )}
                      >
                        {String(idx + 1).padStart(2, "0")}
                      </div>
                      {/* Step content */}
                      <div className="pt-2 flex-1 min-w-0">
                        <div className="card-premium p-5 transition-all duration-300 group-hover:shadow-[var(--shadow-card-hover)] group-hover:-translate-y-0.5">
                          <p className="text-lg font-semibold text-foreground">{step}</p>
                        </div>
                      </div>
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <CTASection
        title={`Ready to build your ${service.title.toLowerCase().replace(/ (development|engineering|design)/i, "")}?`}
        description="Tell us about your project and we'll come back with a scope and timeline."
      />
    </>
  );
}
