import { motion, useReducedMotion } from "framer-motion";
import {
  Landmark,
  HeartPulse,
  GraduationCap,
  ShoppingCart,
  Truck,
  Building2,
  Factory,
  UtensilsCrossed,
  Users,
} from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";
import { INDUSTRIES } from "@/data/constants";

const ICON_MAP: Record<string, React.ElementType> = {
  Landmark,
  HeartPulse,
  GraduationCap,
  ShoppingCart,
  Truck,
  Building2,
  Factory,
  UtensilsCrossed,
  Users,
};

export default function IndustriesSection() {
  const reduce = useReducedMotion();

  return (
    <section className="relative section-y bg-surface">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-border to-transparent"
        aria-hidden="true"
      />
      <div className="container-custom">
        <SectionHeader
          badge="Industries"
          title="Domain context, not a learning curve"
          description="We've shipped products in these spaces, so we understand the constraints before you explain them."
          centered
          className="mb-14"
        />

        {/* Hairline mosaic — one shared grid, no floating card clutter. */}
        <div className="overflow-hidden rounded-3xl border border-border bg-border shadow-[var(--shadow-card)]">
          {/* 9 industries → 3×3 on desktop keeps every row complete. */}
          <div className="grid grid-cols-1 gap-px sm:grid-cols-2 lg:grid-cols-3">
            {INDUSTRIES.map((industry, i) => {
              const Icon = ICON_MAP[industry.icon_name] ?? Landmark;
              return (
                <motion.div
                  key={industry.name}
                  initial={reduce ? false : { opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.4, delay: Math.min(i, 8) * 0.04 }}
                  className="group relative flex h-full flex-col bg-card p-6 transition-all duration-300 hover:bg-accent/50 hover:shadow-[0_0_24px_-12px_color-mix(in_oklab,var(--primary)_18%,transparent)] xl:p-8"
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-primary transition-all duration-300 group-hover:border-primary/40 group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="h-4.5 w-4.5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 font-display text-base font-semibold tracking-tight">
                    {industry.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {industry.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
