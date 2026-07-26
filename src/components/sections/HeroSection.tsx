"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HERO, SITE } from "@/data/constants";

// Pre-defined particles to avoid hydration mismatch
const PARTICLES = [
  { x: 8, y: 12, size: 2.5, delay: 0, duration: 5.5 },
  { x: 92, y: 8, size: 2, delay: 0.8, duration: 7 },
  { x: 18, y: 75, size: 3, delay: 1.5, duration: 6 },
  { x: 85, y: 65, size: 2, delay: 0.3, duration: 8 },
  { x: 55, y: 88, size: 2.5, delay: 2, duration: 5 },
  { x: 35, y: 18, size: 2, delay: 1.1, duration: 6.5 },
  { x: 72, y: 30, size: 3, delay: 0.6, duration: 7.5 },
  { x: 25, y: 50, size: 1.5, delay: 2.3, duration: 5.8 },
  { x: 80, y: 82, size: 2, delay: 1.7, duration: 6.2 },
  { x: 48, y: 5, size: 2.5, delay: 0.4, duration: 7.2 },
  { x: 12, y: 40, size: 2, delay: 3, duration: 5.5 },
  { x: 65, y: 55, size: 1.5, delay: 1.9, duration: 8.5 },
];

export default function HeroSection() {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
      aria-label="Hero"
    >
      {/* Grid background */}
      <div
        className="absolute inset-0 bg-hero-grid bg-hero-grid opacity-50 dark:opacity-20"
        aria-hidden="true"
      />

      {/* Animated gradient orbs */}
      <motion.div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-sterova-500/10 dark:bg-sterova-500/15 blur-3xl pointer-events-none"
        animate={{ scale: [1, 1.1, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      />
      <motion.div
        className="absolute top-1/3 left-1/4 w-[450px] h-[450px] rounded-full bg-violet-500/8 dark:bg-violet-500/12 blur-3xl pointer-events-none"
        animate={{ scale: [1.1, 1, 1.1], x: [-20, 20, -20], opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        aria-hidden="true"
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] rounded-full bg-purple-500/10 dark:bg-purple-500/15 blur-3xl pointer-events-none"
        animate={{ scale: [1, 1.15, 1], y: [-15, 15, -15], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        aria-hidden="true"
      />
      <motion.div
        className="absolute top-2/3 right-1/6 w-[250px] h-[250px] rounded-full bg-sterova-400/8 dark:bg-sterova-400/10 blur-2xl pointer-events-none"
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        aria-hidden="true"
      />

      {/* Floating particles */}
      {PARTICLES.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-sterova-500/50 dark:bg-sterova-400/60 pointer-events-none"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: [-12, 12, -12],
            opacity: [0.2, 0.7, 0.2],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: p.delay,
          }}
          aria-hidden="true"
        />
      ))}

      <div className="container-custom relative z-10 py-24 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="flex justify-center mb-6"
        >
          <Badge variant="sterova" className="gap-1.5 py-1.5 px-4 text-xs font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sterova-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-sterova-600 dark:bg-sterova-400" />
            </span>
            {HERO.badge}
          </Badge>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-extrabold tracking-tight mb-6"
        >
          <span className="bg-gradient-to-r from-sterova-600 via-violet-500 to-purple-500 dark:from-sterova-300 dark:via-violet-300 dark:to-purple-300 bg-clip-text text-transparent">
            {SITE.tagline}
          </span>
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 text-pretty leading-relaxed"
        >
          {HERO.subheadline}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col items-center gap-4 mb-16"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
            <Button asChild size="xl" variant="gradient" className="group w-full sm:w-auto shadow-lg shadow-primary/20">
              <Link href={HERO.cta.primary.href}>
                {HERO.cta.primary.label}
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              asChild
              size="xl"
              variant="outline"
              className="group w-full sm:w-auto border-border/60 hover:border-primary/40"
            >
              <Link href={HERO.cta.secondary.href}>
                {HERO.cta.secondary.label}
                <ChevronRight className="ml-1 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>

          {/* Products shortcut */}
          <Link
            href="/#portfolio"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors group"
          >
            <Package className="h-3.5 w-3.5" />
            See products we&apos;ve shipped
            <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl mx-auto"
        >
          {HERO.stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.08 }}
              className="text-center group"
            >
              <div className="text-3xl sm:text-4xl font-display font-bold bg-gradient-to-r from-sterova-600 via-violet-500 to-purple-500 dark:from-sterova-300 dark:via-violet-300 dark:to-purple-300 bg-clip-text text-transparent mb-1 group-hover:scale-110 transition-transform duration-200">
                {stat.value}
              </div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent pointer-events-none"
        aria-hidden="true"
      />
    </section>
  );
}
