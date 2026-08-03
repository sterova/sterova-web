import { Link } from "@/lib/router-compat";
import {
  ArrowRight,
  Code2,
  Globe,
  Smartphone,
  Layers,
  Palette,
  Plug,
  LifeBuoy,
  Sparkles,
} from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";
import CTASection from "@/components/sections/CTASection";
import FAQSection from "@/components/sections/FAQSection";
import AnimatedSection from "@/components/shared/AnimatedSection";
import { SERVICES, FAQS } from "@/data/constants";

const ICON_MAP: Record<string, React.ElementType> = {
  Code2,
  Globe,
  Smartphone,
  Layers,
  Palette,
  Plug,
  LifeBuoy,
};

const SERVICE_THEMES = [
  {
    gradient: "from-blue-500/8 to-cyan-500/8",
    border: "border-blue-500/20 hover:border-blue-500/40",
    iconBg: "bg-blue-500/10 group-hover:bg-blue-500",
    iconColor: "text-blue-500 group-hover:text-white",
  },
  {
    gradient: "from-violet-500/8 to-purple-500/8",
    border: "border-violet-500/20 hover:border-violet-500/40",
    iconBg: "bg-violet-500/10 group-hover:bg-violet-500",
    iconColor: "text-violet-500 group-hover:text-white",
  },
  {
    gradient: "from-emerald-500/8 to-teal-500/8",
    border: "border-emerald-500/20 hover:border-emerald-500/40",
    iconBg: "bg-emerald-500/10 group-hover:bg-emerald-500",
    iconColor: "text-emerald-500 group-hover:text-white",
  },
  {
    gradient: "from-amber-500/8 to-yellow-500/8",
    border: "border-amber-500/20 hover:border-amber-500/40",
    iconBg: "bg-amber-500/10 group-hover:bg-amber-500",
    iconColor: "text-amber-500 group-hover:text-white",
  },
  {
    gradient: "from-rose-500/8 to-pink-500/8",
    border: "border-rose-500/20 hover:border-rose-500/40",
    iconBg: "bg-rose-500/10 group-hover:bg-rose-500",
    iconColor: "text-rose-500 group-hover:text-white",
  },
  {
    gradient: "from-indigo-500/8 to-sky-500/8",
    border: "border-indigo-500/20 hover:border-indigo-500/40",
    iconBg: "bg-indigo-500/10 group-hover:bg-indigo-500",
    iconColor: "text-indigo-500 group-hover:text-white",
  },
];

export default function ServicesPage() {
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
        <div className="container-custom relative text-center">
          <AnimatedSection>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary uppercase tracking-wider mb-6">
              <Sparkles className="h-3.5 w-3.5" />
              Services
            </span>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground mb-6 leading-[1.1] max-w-3xl mx-auto">
              Everything you need to ship great software
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              From early-stage MVPs to enterprise platforms — we cover the full product engineering
              lifecycle.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Service cards */}
      <section className="section-y bg-background">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {SERVICES.map((service, i) => {
              const Icon = ICON_MAP[service.icon_name] ?? Code2;
              const theme = SERVICE_THEMES[i % SERVICE_THEMES.length];

              return (
                <AnimatedSection key={service.id} delay={i * 0.06}>
                  <Link
                    href={`/services/${service.slug}`}
                    className={`group flex flex-col h-full rounded-2xl border bg-gradient-to-br ${theme.gradient} ${theme.border} p-7 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[var(--shadow-card-hover)]`}
                  >
                    <div className="mb-6 flex items-center justify-between">
                      <span
                        className={`flex h-12 w-12 items-center justify-center rounded-xl ${theme.iconBg} ${theme.iconColor} transition-colors duration-300`}
                      >
                        <Icon className="h-6 w-6" />
                      </span>
                      <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-primary" />
                    </div>
                    <h2 className="text-xl font-bold font-display text-foreground mb-3 group-hover:text-primary transition-colors">
                      {service.title}
                    </h2>
                    <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-6">
                      {service.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-auto pt-5 border-t border-border/50">
                      {service.technologies.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="rounded-full border border-border bg-background/60 px-2.5 py-0.5 font-mono text-[10px] tracking-wide text-muted-foreground"
                        >
                          {tech}
                        </span>
                      ))}
                      {service.technologies.length > 4 && (
                        <span className="rounded-full border border-border bg-background/60 px-2.5 py-0.5 font-mono text-[10px] tracking-wide text-muted-foreground">
                          +{service.technologies.length - 4}
                        </span>
                      )}
                    </div>
                  </Link>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      <FAQSection faqs={FAQS} limit={5} />
      <CTASection
        title="Not sure which service fits?"
        description="Tell us what you're building and we'll recommend the right approach."
      />
    </>
  );
}
