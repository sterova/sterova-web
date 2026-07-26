"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";
import { TESTIMONIALS } from "@/data/constants";

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 bg-secondary/30">
      <div className="container-custom">
        <SectionHeader
          badge="Client Stories"
          title="Trusted by builders worldwide"
          description="Real results from real clients. Here's what they say about working with Sterova."
          centered
          className="mb-16"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="relative flex flex-col rounded-2xl border bg-background p-6 shadow-sm hover:shadow-md hover:border-primary/30 transition-all"
            >
              <Quote
                className="absolute top-5 right-5 h-8 w-8 text-primary/10"
                aria-hidden="true"
              />

              {/* Stars */}
              <div className="flex gap-1 mb-4" aria-label={`${t.rating} out of 5 stars`}>
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star
                    key={j}
                    className="h-4 w-4 fill-amber-400 text-amber-400"
                    aria-hidden="true"
                  />
                ))}
              </div>

              {/* Content */}
              <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-6">
                &ldquo;{t.content}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sterova-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
