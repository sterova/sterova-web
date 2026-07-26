"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HERO, SITE } from "@/data/constants";

// Pre-seeded particles — fixed positions avoid hydration mismatch
const PARTICLES = [
  { x: 8,  y: 12, size: 2.5, delay: 0,   duration: 5.5 },
  { x: 92, y: 8,  size: 2,   delay: 0.8, duration: 7   },
  { x: 18, y: 75, size: 3,   delay: 1.5, duration: 6   },
  { x: 85, y: 65, size: 2,   delay: 0.3, duration: 8   },
  { x: 55, y: 88, size: 2.5, delay: 2,   duration: 5   },
  { x: 35, y: 18, size: 2,   delay: 1.1, duration: 6.5 },
  { x: 72, y: 30, size: 3,   delay: 0.6, duration: 7.5 },
  { x: 25, y: 50, size: 1.5, delay: 2.3, duration: 5.8 },
  { x: 80, y: 82, size: 2,   delay: 1.7, duration: 6.2 },
  { x: 48, y: 5,  size: 2.5, delay: 0.4, duration: 7.2 },
  { x: 12, y: 40, size: 2,   delay: 3,   duration: 5.5 },
  { x: 65, y: 55, size: 1.5, delay: 1.9, duration: 8.5 },
  { x: 42, y: 68, size: 2,   delay: 0.9, duration: 6.8 },
  { x: 78, y: 20, size: 1.5, delay: 2.5, duration: 7.3 },
  { x: 5,  y: 58, size: 2.5, delay: 1.3, duration: 5.2 },
  { x: 58, y: 35, size: 1.5, delay: 3.2, duration: 9   },
  { x: 30, y: 90, size: 2,   delay: 0.7, duration: 6.4 },
  { x: 68, y: 78, size: 1.5, delay: 2.1, duration: 7.8 },
  { x: 90, y: 42, size: 2,   delay: 1.4, duration: 5.9 },
  { x: 22, y: 28, size: 2.5, delay: 2.8, duration: 6.1 },
];

interface HeroStat {
  value: string;
  label: string;
}

interface Props {
  settings?: Record<string, string>;
}

export default function HeroSection({ settings = {} }: Props) {
  const badge            = settings.hero_badge            || HERO.badge;
  const headline         = settings.hero_headline         || SITE.tagline;
  const subheadline      = settings.hero_subheadline      || HERO.subheadline;
  const ctaPrimaryLabel  = settings.hero_cta_primary_label  || HERO.cta.primary.label;
  const ctaPrimaryHref   = settings.hero_cta_primary_href   || HERO.cta.primary.href;
  const ctaSecondaryLabel = settings.hero_cta_secondary_label || HERO.cta.secondary.label;
  const ctaSecondaryHref  = settings.hero_cta_secondary_href  || HERO.cta.secondary.href;

  const stats = useMemo<HeroStat[]>(() => {
    if (settings.hero_stats) {
      try { return JSON.parse(settings.hero_stats) as HeroStat[]; } catch { /* fall through */ }
    }
    return HERO.stats;
  }, [settings.hero_stats]);

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
      aria-label="Hero"
    >

      {/* ── Layer 0: Grid ──────────────────────────────────────────────── */}
      <div
        className="absolute inset-0 bg-hero-grid bg-hero-grid opacity-60 dark:opacity-30"
        aria-hidden="true"
      />

      {/* ── Layer 1: Aurora mesh — CSS-only, GPU-accelerated ─────────── */}
      {/* Primary aurora — blue-violet */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        <div
          className="absolute -top-1/4 -left-1/4 w-[150%] h-[100%] animate-aurora opacity-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 55% at 30% 40%, rgba(99,102,241,0.22) 0%, rgba(139,92,246,0.12) 45%, transparent 72%)",
          }}
        />
        {/* Secondary aurora — violet-purple, offset */}
        <div
          className="absolute -bottom-1/4 -right-1/4 w-[150%] h-[100%] animate-aurora-2 opacity-0"
          style={{
            background:
              "radial-gradient(ellipse 65% 50% at 70% 60%, rgba(167,139,250,0.18) 0%, rgba(109,40,217,0.1) 40%, transparent 70%)",
          }}
        />
        {/* Accent warmth streak — subtle indigo-rose hint at top right */}
        <div
          className="absolute top-0 right-0 w-[60%] h-[50%] pointer-events-none opacity-0 animate-aurora"
          style={{
            animationDelay: "4s",
            background:
              "radial-gradient(ellipse 60% 50% at 85% 15%, rgba(196,181,253,0.1) 0%, transparent 65%)",
          }}
        />
      </div>

      {/* ── Layer 2: Animated orbs (Framer Motion) ────────────────────── */}
      {/* Central depth orb */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[950px] h-[950px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(99,102,241,0.11) 0%, rgba(139,92,246,0.06) 45%, transparent 70%)",
        }}
        animate={{ scale: [1, 1.05, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      />

      {/* Top-left drifting orb */}
      <motion.div
        className="absolute -top-20 -left-20 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(124,58,237,0.12) 0%, transparent 65%)",
        }}
        animate={{ scale: [1.1, 1, 1.1], x: [-20, 40, -20], y: [0, 25, 0], opacity: [0.4, 0.75, 0.4] }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        aria-hidden="true"
      />

      {/* Bottom-right drifting orb */}
      <motion.div
        className="absolute -bottom-20 -right-20 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(109,40,217,0.14) 0%, transparent 65%)",
        }}
        animate={{ scale: [1, 1.18, 1], y: [-20, 20, -20], opacity: [0.45, 0.9, 0.45] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        aria-hidden="true"
      />

      {/* Accent orb — violet */}
      <motion.div
        className="absolute top-1/4 right-1/5 w-[320px] h-[320px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(196,181,253,0.13) 0%, transparent 65%)",
        }}
        animate={{ scale: [1.15, 1, 1.15], x: [0, -30, 0], opacity: [0.3, 0.65, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        aria-hidden="true"
      />

      {/* ── Layer 3: Glowing rings ────────────────────────────────────── */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[620px] h-[620px] rounded-full border pointer-events-none"
        style={{ borderColor: "rgba(99,102,241,0.12)" }}
        animate={{ rotate: 360, scale: [1, 1.02, 1] }}
        transition={{ rotate: { duration: 45, repeat: Infinity, ease: "linear" }, scale: { duration: 6, repeat: Infinity, ease: "easeInOut" } }}
        aria-hidden="true"
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[820px] h-[820px] rounded-full border pointer-events-none"
        style={{ borderColor: "rgba(139,92,246,0.08)" }}
        animate={{ rotate: -360, scale: [1.02, 1, 1.02] }}
        transition={{ rotate: { duration: 65, repeat: Infinity, ease: "linear" }, scale: { duration: 8, repeat: Infinity, ease: "easeInOut" } }}
        aria-hidden="true"
      />
      {/* Outer faint ring */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1050px] h-[1050px] rounded-full border pointer-events-none"
        style={{ borderColor: "rgba(167,139,250,0.04)" }}
        animate={{ rotate: 360 }}
        transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
        aria-hidden="true"
      />

      {/* ── Layer 4: Floating particles ───────────────────────────────── */}
      {PARTICLES.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background:
              i % 3 === 0
                ? "rgba(99,102,241,0.6)"
                : i % 3 === 1
                ? "rgba(139,92,246,0.55)"
                : "rgba(167,139,250,0.5)",
            boxShadow:
              i % 3 === 0
                ? `0 0 ${p.size * 3}px rgba(99,102,241,0.4)`
                : i % 3 === 1
                ? `0 0 ${p.size * 3}px rgba(139,92,246,0.35)`
                : `0 0 ${p.size * 3}px rgba(167,139,250,0.3)`,
          }}
          animate={{ y: [-14, 14, -14], opacity: [0.12, 0.6, 0.12] }}
          transition={{ duration: p.duration, repeat: Infinity, ease: "easeInOut", delay: p.delay }}
          aria-hidden="true"
        />
      ))}

      {/* ── Content ───────────────────────────────────────────────────── */}
      <div className="container-custom relative z-10 py-24 text-center">
        {/* Badge */}
        <div className="flex justify-center mb-6 animate-fade-in-up" style={{ animationDelay: "0ms" }}>
          <Badge variant="sterova" className="gap-1.5 py-1.5 px-4 text-xs font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sterova-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-sterova-600 dark:bg-sterova-400" />
            </span>
            {badge}
          </Badge>
        </div>

        {/* Headline */}
        <h1
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-extrabold tracking-tight mb-6 animate-fade-in-up"
          style={{ animationDelay: "80ms" }}
        >
          <span
            className="inline-block bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(135deg, hsl(243,82%,52%) 0%, hsl(262,83%,58%) 35%, hsl(280,70%,62%) 65%, hsl(243,82%,60%) 100%)",
              backgroundSize: "200% auto",
              animation: "gradient-x 6s ease infinite",
            }}
          >
            {headline}
          </span>
        </h1>

        {/* Sub-headline */}
        <p
          className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 text-pretty leading-relaxed animate-fade-in-up"
          style={{ animationDelay: "160ms" }}
        >
          {subheadline}
        </p>

        {/* CTAs */}
        <div
          className="flex flex-col items-center gap-4 mb-16 animate-fade-in-up"
          style={{ animationDelay: "240ms" }}
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
            <Button
              asChild
              size="xl"
              variant="gradient"
              className="group w-full sm:w-auto shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:shadow-xl transition-shadow duration-300"
            >
              <Link href={ctaPrimaryHref}>
                {ctaPrimaryLabel}
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              asChild
              size="xl"
              variant="outline"
              className="group w-full sm:w-auto border-border/60 hover:border-primary/40 hover:bg-primary/5 transition-all duration-200"
            >
              <Link href={ctaSecondaryHref}>
                {ctaSecondaryLabel}
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
        </div>

        {/* Stats */}
        <div
          className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl mx-auto animate-fade-in-up"
          style={{ animationDelay: "360ms" }}
        >
          {stats.map((stat) => (
            <div key={stat.label} className="text-center group">
              <div
                className="text-3xl sm:text-4xl font-display font-bold bg-clip-text text-transparent mb-1 group-hover:scale-110 transition-transform duration-200"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, hsl(243,82%,52%) 0%, hsl(262,83%,58%) 50%, hsl(280,70%,62%) 100%)",
                }}
              >
                {stat.value}
              </div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom fade ───────────────────────────────────────────────── */}
      <div
        className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-background to-transparent pointer-events-none"
        aria-hidden="true"
      />
    </section>
  );
}
