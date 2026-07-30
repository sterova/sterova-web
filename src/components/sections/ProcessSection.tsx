import { motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";
import { PROCESS_STEPS } from "@/data/constants";

export default function ProcessSection() {
  const reduce = useReducedMotion();

  return (
    <section id="process" className="section-y">
      <div className="container-custom">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          {/* Sticky narrative rail */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <SectionHeader
                badge="Our process"
                title="Delivery without surprises"
                description="No surprises. You always know what's happening, what's next, and what it costs."
              />
              <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border">
                {[
                  { k: "Sprint length", v: "2 weeks" },
                  { k: "Demo cadence", v: "Every sprint" },
                  { k: "Code ownership", v: "Yours" },
                  { k: "Post-launch", v: "30 days" },
                ].map((s) => (
                  <div key={s.k} className="bg-card px-4 py-5">
                    <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                      {s.k}
                    </dt>
                    <dd className="mt-1.5 font-display text-base font-semibold tracking-tight">
                      {s.v}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {/* Steps */}
          <ol className="relative lg:col-span-8">
            <div
              className="absolute left-[1.375rem] top-3 bottom-3 w-px bg-linear-to-b from-primary/60 via-primary/20 to-transparent sm:left-[1.625rem]"
              aria-hidden="true"
            />
            <div
              className="absolute left-[1.375rem] top-3 h-24 w-px bg-gradient-to-b from-primary to-transparent blur-[2px] sm:left-[1.625rem]"
              aria-hidden="true"
            />
            {PROCESS_STEPS.map((step, i) => (
              <motion.li
                key={step.number}
                initial={reduce ? false : { opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: Math.min(i, 4) * 0.06 }}
                className="group relative flex gap-5 pb-7 last:pb-0 sm:gap-7"
              >
                <span className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-card font-mono text-xs font-medium text-primary shadow-sm transition-all duration-300 group-hover:border-primary/50 group-hover:bg-primary/5 group-hover:shadow-[0_0_20px_-4px_color-mix(in_oklab,var(--primary)_40%,transparent)] sm:h-[3.25rem] sm:w-[3.25rem] sm:text-sm">
                  {step.number}
                </span>

                <div className="card-premium sheen min-w-0 flex-1 p-6 xl:p-7">
                  <h3 className="font-display text-lg font-semibold tracking-tight xl:text-xl">
                    {step.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                  <ul className="mt-5 flex flex-wrap gap-2 border-t border-border/70 pt-5">
                    {step.deliverables.map((d) => (
                      <li
                        key={d}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-border/70 bg-surface px-2.5 py-1 text-xs text-text-secondary"
                      >
                        <Check className="h-3 w-3 shrink-0 text-primary" aria-hidden="true" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
