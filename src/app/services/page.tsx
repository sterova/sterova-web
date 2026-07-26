import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";
import AnimatedSection from "@/components/shared/AnimatedSection";
import CTASection from "@/components/sections/CTASection";
import { Button } from "@/components/ui/button";
import { SERVICES, SITE } from "@/data/constants";

export const metadata: Metadata = {
  title: "Services",
  description: `${SITE.name} offers custom software development, web and mobile app development, SaaS product engineering, UI/UX design, AI automation, cloud, DevOps, and cybersecurity consulting.`,
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-secondary/30">
        <div className="container-custom text-center">
          <AnimatedSection>
            <SectionHeader
              badge="Services"
              title="Everything you need to build and scale"
              description="From initial concept through post-launch growth — we cover the full spectrum of modern software development."
              centered
            />
          </AnimatedSection>
        </div>
      </section>

      {/* All services */}
      <section className="py-24">
        <div className="container-custom">
          <div className="space-y-16">
            {SERVICES.map((service, i) => (
              <AnimatedSection key={service.id} delay={0.05}>
                <div
                  id={service.id}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start scroll-mt-24"
                >
                  <div>
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
                      {service.icon}
                    </div>
                    <h2 className="text-2xl font-bold mb-3">{service.title}</h2>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      {service.description}
                    </p>
                    <Button asChild variant="gradient" className="group">
                      <Link href="/contact">
                        Discuss this service
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-2xl border bg-background p-6">
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                        What&apos;s included
                      </h3>
                      <ul className="space-y-2.5">
                        {service.features.map((feature) => (
                          <li
                            key={feature}
                            className="flex items-start gap-2.5 text-sm"
                          >
                            <span
                              className="mt-0.5 h-4 w-4 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs flex-shrink-0"
                              aria-hidden="true"
                            >
                              ✓
                            </span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-2xl border bg-background px-6 py-4">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                        Technologies
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {service.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="text-xs bg-secondary px-2.5 py-1 rounded-full"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {i < SERVICES.length - 1 && (
                  <div className="mt-16 border-t" aria-hidden="true" />
                )}
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
