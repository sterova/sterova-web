import { Link } from "@/lib/router-compat";
import { ArrowRight, Code2, Globe, Smartphone, Layers, Palette, Plug } from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";
import CTASection from "@/components/sections/CTASection";
import ProcessSection from "@/components/sections/ProcessSection";
import FAQSection from "@/components/sections/FAQSection";
import WhyChooseUsSection from "@/components/sections/WhyChooseUsSection";
import AnimatedSection from "@/components/shared/AnimatedSection";
import { SERVICES, FAQS } from "@/data/constants";

const ICON_MAP: Record<string, React.ElementType> = {
  Code2,
  Globe,
  Smartphone,
  Layers,
  Palette,
  Plug,
};

const SERVICE_THEMES = [
  {
    color: "from-blue-500/10 to-cyan-500/10 border-blue-500/20",
    iconColor: "text-blue-500",
  },
  {
    color: "from-violet-500/10 to-purple-500/10 border-violet-500/20",
    iconColor: "text-violet-500",
  },
  {
    color: "from-emerald-500/10 to-teal-500/10 border-emerald-500/20",
    iconColor: "text-emerald-500",
  },
  {
    color: "from-amber-500/10 to-yellow-500/10 border-amber-500/20",
    iconColor: "text-amber-500",
  },
  {
    color: "from-rose-500/10 to-pink-500/10 border-rose-500/20",
    iconColor: "text-rose-500",
  },
  {
    color: "from-indigo-500/10 to-violet-500/10 border-indigo-500/20",
    iconColor: "text-indigo-500",
  },
];

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

      <section className="section-y bg-background">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((service, i) => {
              const Icon = ICON_MAP[service.icon_name] ?? Code2;
              const theme = SERVICE_THEMES[i % SERVICE_THEMES.length];

              return (
                <AnimatedSection key={service.id} delay={i * 0.05}>
                  <Link
                    href={`/services/${service.slug}`}
                    className={`group flex flex-col h-full rounded-2xl border bg-gradient-to-br p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)] ${theme.color}`}
                  >
                    <div className="mb-5 flex items-center justify-between">
                      <span
                        className={`flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-background/60 backdrop-blur-sm ${theme.iconColor}`}
                      >
                        <Icon className="h-6 w-6" />
                      </span>
                    </div>
                    <h2 className="text-xl font-bold font-display text-foreground mb-3 group-hover:text-primary transition-colors">
                      {service.title}
                    </h2>
                    <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-6">
                      {service.short_description}
                    </p>
                    <div className="mt-auto flex items-center gap-1.5 text-sm font-medium text-primary">
                      Learn more
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </Link>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      <ProcessSection />
      <WhyChooseUsSection />
      <FAQSection faqs={FAQS} limit={5} />
      <CTASection
        title="Not sure which service fits?"
        description="Tell us what you're building and we'll recommend the right approach."
      />
    </>
  );
}
