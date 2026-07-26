import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  Code2, Globe, Smartphone, Layers, Palette, Plug, Cloud, Shield,
  MessageSquare, Wrench, Bot, LayoutDashboard, Zap, Server, Database,
} from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";
import AnimatedSection from "@/components/shared/AnimatedSection";
import CTASection from "@/components/sections/CTASection";
import { Button } from "@/components/ui/button";
import { getServices } from "@/lib/content";
import { SITE } from "@/data/constants";
import type { DbService } from "@/types";

export const metadata: Metadata = {
  title: "Services",
  description: `${SITE.name} offers custom software development, web and mobile app development, and more.`,
  alternates: { canonical: "/services" },
};

const ICON_MAP: Record<string, React.ElementType> = {
  Code2, Globe, Smartphone, Layers, Palette, Plug, Cloud, Shield,
  MessageSquare, Wrench, Bot, LayoutDashboard, Zap, Server, Database,
};

function ServiceIcon({ name }: { name: string }) {
  const Icon = ICON_MAP[name] ?? Code2;
  return <Icon className="h-6 w-6" />;
}

function ServiceDetail({ service, index, total }: { service: DbService; index: number; total: number }) {
  return (
    <AnimatedSection delay={0.05}>
      <div
        id={service.slug}
        className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start scroll-mt-24"
      >
        <div>
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
            <ServiceIcon name={service.icon_name} />
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
          {service.features.length > 0 && (
            <div className="rounded-2xl border bg-background p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                What&apos;s included
              </h3>
              <ul className="space-y-2.5">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm">
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
          )}
          {service.technologies.length > 0 && (
            <div className="rounded-2xl border bg-background px-6 py-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Technologies
              </p>
              <div className="flex flex-wrap gap-2">
                {service.technologies.map((tech) => (
                  <span key={tech} className="text-xs bg-secondary px-2.5 py-1 rounded-full">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {index < total - 1 && (
        <div className="mt-16 border-t" aria-hidden="true" />
      )}
    </AnimatedSection>
  );
}

export default async function ServicesPage() {
  const services = await getServices();

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
          {services.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <p>Services coming soon — check back later.</p>
            </div>
          ) : (
            <div className="space-y-16">
              {services.map((service, i) => (
                <ServiceDetail
                  key={service.id}
                  service={service}
                  index={i}
                  total={services.length}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <CTASection />
    </>
  );
}
