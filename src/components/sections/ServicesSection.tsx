import { Link } from "@/lib/router-compat";
import { motion, useReducedMotion } from "framer-motion";
import {
  Code2,
  Globe,
  Smartphone,
  Layers,
  Palette,
  Plug,
  LayoutDashboard,
  Zap,
  Server,
  Database,
  ArrowUpRight,
  Check,
} from "lucide-react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionHeader from "@/components/shared/SectionHeader";
import { cn } from "@/lib/utils";
import type { Service } from "@/types";

const ICON_MAP: Record<string, React.ElementType> = {
  Code2,
  Globe,
  Smartphone,
  Layers,
  Palette,
  Plug,
  LayoutDashboard,
  Zap,
  Server,
  Database,
};

type AccentKey = "primary" | "violet" | "teal" | "amber";

const ACCENT_STYLES: Record<AccentKey, { icon: string; chip: string; ring: string }> = {
  primary: {
    icon: "bg-linear-to-br from-primary to-brand-violet text-white shadow-lg shadow-primary/20",
    chip: "border-primary/30 bg-primary/10 text-primary",
    ring: "group-hover:ring-primary/20",
  },
  violet: {
    icon: "bg-linear-to-br from-brand-violet to-brand-teal text-white shadow-lg shadow-brand-violet/20",
    chip: "border-brand-violet/30 bg-brand-violet/10 text-brand-violet",
    ring: "group-hover:ring-brand-violet/20",
  },
  teal: {
    icon: "bg-linear-to-br from-brand-teal to-primary text-white shadow-lg shadow-brand-teal/20",
    chip: "border-brand-teal/30 bg-brand-teal/10 text-brand-teal",
    ring: "group-hover:ring-brand-teal/20",
  },
  amber: {
    icon: "bg-linear-to-br from-brand-amber to-primary text-white shadow-lg shadow-brand-amber/20",
    chip: "border-brand-amber/30 bg-brand-amber/10 text-brand-amber",
    ring: "group-hover:ring-brand-amber/20",
  },
};

const NON_FEATURED_ACCENTS: AccentKey[] = ["primary", "violet", "teal", "amber", "primary"];

interface Props {
  services: Service[];
  limit?: number;
  showCta?: boolean;
}

export default function ServicesSection({ services, limit, showCta = true }: Props) {
  const displayed = limit ? services.slice(0, limit) : services;
  const reduce = useReducedMotion();

  if (services.length === 0) {
    return (
      <section id="services" className="section-y bg-surface">
        <div className="container-custom text-center">
          <p className="text-muted-foreground">Services coming soon.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="services" className="relative section-y overflow-hidden bg-surface">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-border to-transparent"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-1/4 top-1/2 aspect-square w-[48rem] -translate-y-1/2 rounded-full bg-primary/[0.03] blur-3xl"
        aria-hidden="true"
      />

      <div className="container-custom relative">
        <div className="grid gap-5 lg:grid-cols-12 lg:items-end">
          <SectionHeader
            badge="What we build"
            title="Six disciplines, one delivery team"
            description="Each service is backed by shipped work — not a capabilities deck. Engage one, or let us own the whole build."
            className="lg:col-span-8"
          />
          <div className="lg:col-span-4 lg:justify-self-end">
            <Button asChild variant="outline" className="group">
              <Link href="/services">
                Explore all services
                <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Bento grid: the lead service owns a 2×2 slot, the rest tile around it. */}
        <div className="mt-9 grid gap-3 sm:grid-cols-2 lg:mt-11 lg:grid-cols-3">
          {displayed.map((service, i) => {
            const Icon = ICON_MAP[service.icon_name] ?? Code2;
            const featured = i === 0;
            const accent = featured ? null : NON_FEATURED_ACCENTS[i - 1];
            const accentStyle = accent ? ACCENT_STYLES[accent] : null;

            return (
              <motion.div
                key={service.id}
                initial={reduce ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: Math.min(i, 6) * 0.05 }}
                className={cn(featured && "sm:col-span-2 lg:row-span-2")}
              >
                <Link
                  href={
                    featured
                      ? `/start-project?service=${service.slug}`
                      : `/services#${service.slug}`
                  }
                  className={cn(
                    "card-premium sheen group relative flex h-full flex-col overflow-hidden p-5 ring-1 ring-transparent transition-all duration-300 xl:p-6",
                    featured && "gradient-border bg-linear-to-br from-card via-card to-primary/10",
                    accentStyle?.ring,
                  )}
                >
                  {featured && (
                    <>
                      <div
                        className="pointer-events-none absolute -right-24 -top-24 aspect-square w-72 rounded-full bg-primary/20 blur-3xl transition-opacity duration-500 group-hover:opacity-80"
                        aria-hidden="true"
                      />
                      <div
                        className="pointer-events-none absolute -bottom-24 -left-12 aspect-square w-56 rounded-full bg-brand-violet/10 blur-3xl transition-opacity duration-500 group-hover:opacity-70"
                        aria-hidden="true"
                      />
                    </>
                  )}

                  <div className="relative flex items-start justify-between gap-4">
                    <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                      {String(i + 1).padStart(2, "0")}
                      {featured && <span className="ml-2 text-primary">// Primary focus</span>}
                    </span>
                    <ArrowUpRight
                      className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary group-hover:opacity-100"
                      aria-hidden="true"
                    />
                  </div>

                  <div
                    className={cn("relative flex items-center gap-3", featured ? "mt-5" : "mt-4")}
                  >
                    <span
                      className={cn(
                        "inline-flex shrink-0 items-center justify-center transition-all duration-300",
                        featured
                          ? "icon-gradient glow-icon h-14 w-14 rounded-2xl text-white shadow-lg group-hover:scale-110"
                          : cn("h-10 w-10 rounded-xl group-hover:scale-110", accentStyle?.icon),
                      )}
                    >
                      <Icon className={cn(featured ? "h-7 w-7" : "h-5 w-5")} aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <h3
                        className={cn(
                          "font-display font-semibold tracking-tight transition-colors group-hover:text-primary",
                          featured ? "text-xl xl:text-2xl" : "text-base",
                        )}
                      >
                        {service.title}
                      </h3>
                      {featured && (
                        <p className="mt-1 hidden text-[0.8125rem] leading-relaxed text-muted-foreground sm:block">
                          {service.short_description}
                        </p>
                      )}
                    </div>
                  </div>

                  <p
                    className={cn(
                      "relative mt-2.5 text-[0.8125rem] leading-relaxed text-muted-foreground",
                      featured ? "max-w-lg sm:hidden" : "flex-1",
                    )}
                  >
                    {featured ? service.description : service.short_description}
                  </p>

                  {featured ? (
                    <div className="relative mt-auto grid gap-5 pt-6 sm:grid-cols-2">
                      <div>
                        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                          What&apos;s included
                        </p>
                        <ul className="mt-2.5 space-y-1.5">
                          {service.features.slice(0, 3).map((feature) => (
                            <li key={feature} className="flex items-start gap-2 text-[0.8125rem]">
                              <Check
                                className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                                aria-hidden="true"
                              />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                          Tech stack
                        </p>
                        <div className="mt-2.5 flex flex-wrap gap-1.5">
                          {service.technologies.slice(0, 5).map((tech, i) => {
                            const accent =
                              i % 3 === 0 ? "primary" : i % 3 === 1 ? "violet" : "teal";
                            return (
                              <span
                                key={tech}
                                className={cn(
                                  "rounded-full border px-2 py-0.5 font-mono text-[10px] tracking-wide",
                                  accent === "primary" &&
                                    "border-primary/30 bg-primary/10 text-primary",
                                  accent === "violet" &&
                                    "border-brand-violet/30 bg-brand-violet/10 text-brand-violet",
                                  accent === "teal" &&
                                    "border-brand-teal/30 bg-brand-teal/10 text-brand-teal",
                                )}
                              >
                                {tech}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                      <span className="relative inline-flex w-fit items-center gap-2 overflow-hidden rounded-full gradient-brand px-5 py-2.5 text-[0.8125rem] font-semibold text-white shadow-lg shadow-primary/25 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-xl group-hover:shadow-primary/40">
                        <span
                          className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full"
                          aria-hidden="true"
                        />
                        <span className="relative">Start a project</span>
                        <ArrowRight
                          className="relative h-4 w-4 transition-transform group-hover:translate-x-1"
                          aria-hidden="true"
                        />
                      </span>
                    </div>
                  ) : (
                    <div className="relative mt-auto border-t border-border/70 pt-3.5">
                      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                        Tech stack
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {service.technologies.slice(0, 4).map((tech) => (
                          <span
                            key={tech}
                            className={cn(
                              "rounded-full border px-2 py-0.5 font-mono text-[10px] tracking-wide",
                              accentStyle?.chip,
                            )}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </Link>
              </motion.div>
            );
          })}
        </div>

        {showCta && limit && services.length > limit && (
          <div className="mt-12 text-center">
            <Button asChild variant="outline" size="lg" className="group">
              <Link href="/services">
                View all services
                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
