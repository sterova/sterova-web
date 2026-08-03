import { useLoaderData } from "@tanstack/react-router";
import { Link } from "@/lib/router-compat";
import { ArrowRight, BookOpen } from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";
import CTASection from "@/components/sections/CTASection";
import AnimatedSection from "@/components/shared/AnimatedSection";
import type { CaseStudyRow } from "@/types/database";

export default function CaseStudiesPage() {
  const caseStudies = useLoaderData({ from: "/case-studies/" }) as CaseStudyRow[];

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
              badge="Case Studies"
              title="How we solve complex problems"
              description="Deep dives into the challenges our clients faced and the solutions we engineered."
              centered
              size="page"
            />
          </AnimatedSection>
        </div>
      </section>

      <section className="section-y bg-background">
        <div className="container-custom">
          {caseStudies.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              No case studies available yet. Check back soon!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {caseStudies.map((study, idx) => (
                <AnimatedSection key={study.id} delay={idx * 0.1}>
                  <Link
                    href={`/case-studies/${study.slug}`}
                    className="group card-premium flex flex-col h-full overflow-hidden block outline-none"
                  >
                    {study.cover_image && (
                      <div className="aspect-[16/9] w-full overflow-hidden bg-muted">
                        <img
                          src={study.cover_image}
                          alt={study.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div className="flex flex-col flex-1 p-8">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                          <BookOpen className="h-3.5 w-3.5" />
                          {study.client_name}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold font-display mb-3 text-foreground transition-colors group-hover:text-primary">
                        {study.title}
                      </h3>
                      <p className="text-muted-foreground line-clamp-3 mb-6">{study.problem}</p>
                      <div className="mt-auto flex items-center font-medium text-sm text-primary">
                        Read Case Study
                        <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </div>
                    </div>
                  </Link>
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>
      </section>

      <CTASection />
    </>
  );
}
