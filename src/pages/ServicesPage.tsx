import { Link } from "wouter";
import { ArrowRight, Code2, Globe, Smartphone, Layers, Palette, Plug, Wrench } from "lucide-react";
import { motion } from "framer-motion";
import SectionHeader from "@/components/shared/SectionHeader";
import CTASection from "@/components/sections/CTASection";
import AnimatedSection from "@/components/shared/AnimatedSection";
import SEO from "@/components/shared/SEO";
import { SERVICES } from "@/data/constants";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, React.ElementType> = {
  Code2, Globe, Smartphone, Layers, Palette, Plug, Wrench,
};

export default function ServicesPage() {
  return (
    <>
      <SEO 
        title="Web Services & Custom Software" 
        description="Top-tier web services, software service, and app development. We build what you need to scale your business."
        canonical="/services" 
      />

      <section className="pt-32 pb-16 bg-secondary/30">
        <div className="container-custom text-center">
          <AnimatedSection>
            <SectionHeader
              badge="Services"
              title="Everything you need to ship great software"
              description="From early-stage MVPs to enterprise platforms — we cover the full product engineering lifecycle."
              centered
            />
          </AnimatedSection>
        </div>
      </section>

      <section className="py-24">
        <div className="container-custom space-y-24">
          {SERVICES.map((service, i) => {
            const Icon = ICON_MAP[service.icon_name] ?? Code2;
            return (
              <motion.div
                key={service.id}
                id={service.slug}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: 0.05 }}
                className={cn(
                  "grid grid-cols-1 lg:grid-cols-2 gap-12 items-start",
                  i % 2 === 1 && "lg:flex-row-reverse"
                )}
              >
                <div>
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary mb-5">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold mb-3">{service.title}</h2>
                  <p className="text-muted-foreground leading-relaxed mb-6">{service.description}</p>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all text-sm"
                  >
                    Start a project <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

                <div className="space-y-4">
                  <div className="rounded-2xl border bg-background p-6">
                    <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4">
                      What&apos;s included
                    </h3>
                    <ul className="space-y-2.5">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2.5 text-sm">
                          <span className="text-primary mt-0.5">✓</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-2xl border bg-background p-5">
                    <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-3">
                      Technologies
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {service.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="text-xs bg-secondary text-secondary-foreground px-2.5 py-1 rounded-full font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      <CTASection title="Not sure which service fits?" description="Tell us what you're building and we'll recommend the right approach." />
    </>
  );
}
