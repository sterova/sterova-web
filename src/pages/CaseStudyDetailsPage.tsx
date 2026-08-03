import { useLoaderData } from "@tanstack/react-router";
import { ArrowRight, Target, Telescope, Lightbulb, Code2, Rocket, BarChart3 } from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";
import CTASection from "@/components/sections/CTASection";
import AnimatedSection from "@/components/shared/AnimatedSection";

export default function CaseStudyDetailsPage() {
  const study = useLoaderData({ from: "/case-studies_/$slug" });

  if (!study) return null;

  return (
    <>
      <section className="relative overflow-hidden border-b border-border bg-surface pt-36 pb-20">
        <div
          className="pointer-events-none absolute inset-0 dot-grid opacity-40"
          aria-hidden="true"
        />
        <div className="container-custom relative max-w-4xl mx-auto">
          <AnimatedSection>
            <div className="flex flex-col items-center text-center">
              <span className="eyebrow mb-6">Case Study — {study.client_name}</span>
              <h1 className="heading-1 mb-6">{study.title}</h1>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {study.cover_image && (
        <section className="bg-surface pb-12">
          <div className="container-custom max-w-5xl mx-auto">
            <AnimatedSection delay={0.1}>
              <div className="aspect-[21/9] w-full overflow-hidden rounded-3xl border border-border shadow-xl">
                <img
                  src={study.cover_image}
                  alt={study.title}
                  className="h-full w-full object-cover"
                />
              </div>
            </AnimatedSection>
          </div>
        </section>
      )}

      <section className="section-y bg-background">
        <div className="container-custom max-w-3xl mx-auto space-y-16">
          <AnimatedSection>
            <div className="card-premium p-8 md:p-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-destructive-soft text-destructive">
                  <Target className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold font-display">The Problem</h2>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed">{study.problem}</p>
            </div>
          </AnimatedSection>

          <AnimatedSection>
            <div className="card-premium p-8 md:p-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-info-soft text-info">
                  <Telescope className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold font-display">Research</h2>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed">{study.research}</p>
            </div>
          </AnimatedSection>

          <AnimatedSection>
            <div className="card-premium p-8 md:p-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-warning-soft text-warning">
                  <Lightbulb className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold font-display">Design</h2>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed">{study.design}</p>
            </div>
          </AnimatedSection>

          <AnimatedSection>
            <div className="card-premium p-8 md:p-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Code2 className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold font-display">Development</h2>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed">{study.development}</p>
            </div>
          </AnimatedSection>

          <AnimatedSection>
            <div className="card-premium p-8 md:p-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-violet/10 text-brand-violet">
                  <Rocket className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold font-display">Deployment</h2>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed">{study.deployment}</p>
            </div>
          </AnimatedSection>

          <AnimatedSection>
            <div className="card-premium border-success/30 bg-success-soft/30 p-8 md:p-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-success-soft text-success">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold font-display">Results</h2>
              </div>
              <p className="text-lg text-foreground leading-relaxed font-medium">{study.results}</p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <CTASection />
    </>
  );
}
