import { motion } from "framer-motion";
import { Check } from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";
import { PROCESS_STEPS } from "@/data/constants";

export default function ProcessSection() {
  return (
    <section id="process" className="py-24">
      <div className="container-custom">
        <SectionHeader
          badge="Our Process"
          title="How we turn ideas into products"
          description="No surprises. You'll know what's happening, what's next, and what it costs at every step."
          centered
          className="mb-16"
        />

        <div className="relative max-w-3xl mx-auto">
          {/* Connector line */}
          <div
            className="absolute left-[3.25rem] top-0 bottom-0 w-px bg-border hidden md:block"
            aria-hidden="true"
          />

          <div className="space-y-8">
            {PROCESS_STEPS.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                className="relative flex gap-6 md:gap-8"
              >
                {/* Step number */}
                <div className="relative z-10 flex-shrink-0">
                  <div className="w-14 h-14 rounded-2xl bg-background border-2 border-primary/30 flex items-center justify-center font-display font-bold text-primary text-lg">
                    {step.number}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 pb-8">
                  <div className="rounded-2xl border bg-background p-6 hover:border-primary/30 hover:shadow-sm transition-all">
                    <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                      {step.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {step.deliverables.map((d) => (
                        <span
                          key={d}
                          className="inline-flex items-center gap-1.5 text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium"
                        >
                          <Check className="h-3 w-3 shrink-0" aria-hidden="true" />
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
