import { motion } from "framer-motion";
import SectionHeader from "@/components/shared/SectionHeader";
import { INDUSTRIES } from "@/data/constants";

export default function IndustriesSection() {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="container-custom">
        <SectionHeader
          badge="Industries"
          title="We've built for 12+ industries"
          description="Deep domain experience means fewer surprises and faster time-to-value for your team."
          centered
          className="mb-12"
        />

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap justify-center gap-3"
        >
          {INDUSTRIES.map((industry, i) => (
            <motion.span
              key={industry}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="inline-flex items-center rounded-full border bg-background px-4 py-2 text-sm font-medium hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-colors cursor-default"
            >
              {industry}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
