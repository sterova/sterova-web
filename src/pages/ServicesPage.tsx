import { Link } from "@/lib/router-compat";
import { ArrowRight, Check, Code2, Globe, Smartphone, Layers, Palette, Plug } from "lucide-react";
import { motion } from "framer-motion";
import SectionHeader from "@/components/shared/SectionHeader";
import CTASection from "@/components/sections/CTASection";
import ProcessSection from "@/components/sections/ProcessSection";
import FAQSection from "@/components/sections/FAQSection";
import AnimatedSection from "@/components/shared/AnimatedSection";
import { SERVICES, FAQS } from "@/data/constants";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, React.ElementType> = {
  Code2,
  Globe,
  Smartphone,
  Layers,
  Palette,
  Plug,
};

export default function ServicesPage() {
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
              badge="Services"
              title="Everything you need to ship great software"
              description="From early-stage MVPs to enterprise platforms — we cover the full product engineering lifecycle."
              centered
              size="page"
            />
          </AnimatedSection>
        </div>
      </section>

      {/* Spec-sheet rows: sticky index rail on the left, detail panel on the right. */}
      <section className="section-y">
        <div className="container-custom space-y-20 lg:space-y-28">
          {SERVICES.map((service, i) => {
            const Icon = ICON_MAP[service.icon_name] ?? Code2;
            return (
              <motion.article
                key={service.id}
                id={service.slug}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 items-start gap-10 scroll-mt-32 lg:grid-cols-12 lg:gap-16"
              >
                {/* Narrative rail */}
                <div className="lg:col-span-5 lg:sticky lg:top-32">
                  <div className="mb-6 flex items-center gap-4">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </span>
                    <span className="font-mono text-xs tracking-[0.22em] text-muted-foreground">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h2 className="font-display text-[clamp(1.6rem,2.4vw,2.35rem)] font-bold leading-[1.1] tracking-[-0.03em]">
                    <Link
                      href={`/start-project?service=${service.slug}`}
                      className="transition-colors hover:text-primary"
                    >
                      {service.title}
                    </Link>
                  </h2>
                  <p className="mt-4 max-w-prose text-[0.975rem] leading-relaxed text-muted-foreground">
                    {service.description}
                  </p>
                  <Link
                    href={`/start-project?service=${service.slug}`}
                    className="group relative mt-7 inline-flex items-center gap-2 overflow-hidden rounded-full gradient-brand px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    <span
                      className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full"
                      aria-hidden="true"
                    />
                    <span className="relative">Start a project</span>
                    <ArrowRight
                      className="relative h-4 w-4 transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </Link>
                </div>

                {/* Detail panel */}
                <div className="lg:col-span-7">
                  <div className="card-premium overflow-hidden p-0">
                    <div className="border-b border-border px-6 py-4 sm:px-8">
                      <h3 className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                        What&apos;s included
                      </h3>
                    </div>
                    <ul className="grid grid-cols-1 sm:grid-cols-2">
                      {service.features.map((feature, fi) => (
                        <li
                          key={feature}
                          className={cn(
                            "flex items-start gap-3 px-6 py-4 text-sm border-border sm:px-8",
                            "border-b sm:[&:nth-last-child(-n+2)]:border-b-0 last:border-b-0",
                            fi % 2 === 0 && "sm:border-r",
                          )}
                        >
                          <Check
                            className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                            aria-hidden="true"
                          />
                          <span className="leading-snug">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-wrap items-center gap-2 border-t border-border bg-surface px-6 py-5 sm:px-8">
                      <span className="mr-1 font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                        Stack
                      </span>
                      {service.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-full border border-border bg-background px-3 py-1 font-mono text-[11px] tracking-wide text-muted-foreground"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </section>

      <ProcessSection />
      <FAQSection faqs={FAQS} limit={5} />
      <CTASection
        title="Not sure which service fits?"
        description="Tell us what you're building and we'll recommend the right approach."
      />
    </>
  );
}
