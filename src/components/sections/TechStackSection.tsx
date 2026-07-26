"use client";

import React from "react";
import { motion } from "framer-motion";
import SectionHeader from "@/components/shared/SectionHeader";
import { TECH_STACK } from "@/data/constants";

const STACK_LABELS: Record<keyof typeof TECH_STACK, string> = {
  frontend: "Frontend",
  backend: "Backend",
  cloud: "Cloud",
  mobile: "Mobile",
  languages: "Languages",
  design: "Design",
  devops: "DevOps",
};

export default function TechStackSection() {
  return (
    <section className="py-24">
      <div className="container-custom">
        <SectionHeader
          badge="Tech Stack"
          title="Modern tools, proven results"
          description="We work with a curated set of battle-tested technologies chosen for performance, scalability, and developer experience."
          centered
          className="mb-16"
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
          {(Object.keys(TECH_STACK) as Array<keyof typeof TECH_STACK>).map(
            (category, ci) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: ci * 0.05 }}
                className="rounded-2xl border bg-background p-4"
              >
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  {STACK_LABELS[category]}
                </p>
                <div className="space-y-2">
                  {TECH_STACK[category].map((tech) => (
                    <div
                      key={tech}
                      className="text-sm font-medium py-1.5 px-2.5 rounded-lg bg-secondary hover:bg-primary/10 hover:text-primary transition-colors cursor-default"
                    >
                      {tech}
                    </div>
                  ))}
                </div>
              </motion.div>
            )
          )}
        </div>
      </div>
    </section>
  );
}
