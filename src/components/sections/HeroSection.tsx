import { useMemo } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HERO, HERO_PARTICLES } from "@/data/constants";

export default function HeroSection() {
  const stats = useMemo(() => HERO.stats, []);

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
      aria-label="Hero"
    >
      {/* Grid */}
      <div
        className="absolute inset-0 bg-hero-grid opacity-60 dark:opacity-30"
        aria-hidden="true"
      />

      {/* Aurora — primary */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div
          className="absolute -top-1/4 -left-1/4 w-[150%] h-[100%] animate-aurora opacity-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 55% at 30% 40%, rgba(99,102,241,0.22) 0%, rgba(139,92,246,0.12) 45%, transparent 72%)",
          }}
        />
        {/* Aurora — secondary */}
        <div
          className="absolute -bottom-1/4 -right-1/4 w-[150%] h-[100%] animate-aurora-2 opacity-0"
          style={{
            background:
              "radial-gradient(ellipse 65% 50% at 70% 60%, rgba(167,139,250,0.18) 0%, rgba(109,40,217,0.1) 40%, transparent 70%)",
          }}
        />
      </div>

      {/* Floating orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div
          className="absolute top-1/4 left-[15%] w-72 h-72 rounded-full bg-primary/8 blur-3xl animate-orb-drift"
        />
        <div
          className="absolute bottom-1/4 right-[15%] w-80 h-80 rounded-full bg-purple-500/6 blur-3xl animate-orb-drift"
          style={{ animationDelay: "-3s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-sterova-500/3 blur-3xl"
        />
      </div>

      {/* Glow ring */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-primary/10 animate-glow-ring"
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-primary/5 animate-glow-ring"
          style={{ animationDelay: "-2s" }}
        />
      </div>

      {/* Particles */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {HERO_PARTICLES.map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-primary/40 animate-particle"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              "--delay": `${p.delay}s`,
              "--duration": `${p.duration}s`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 container-custom text-center space-y-10 py-20">
        {/* Badge */}
        <div className="animate-fade-in-up">
          <Badge variant="sterova" className="text-xs py-1 px-3">
            ✦ {HERO.badge}
          </Badge>
        </div>

        {/* Headline */}
        <div
          className="animate-fade-in-up"
          style={{ animationDelay: "80ms" }}
        >
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-balance leading-[1.05]">
            <span className="gradient-text">{HERO.headline}</span>
          </h1>
        </div>

        {/* Subheadline */}
        <p
          className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed text-pretty animate-fade-in-up"
          style={{ animationDelay: "180ms" }}
        >
          {HERO.subheadline}
        </p>

        {/* CTAs */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up"
          style={{ animationDelay: "270ms" }}
        >
          <Button asChild variant="gradient" size="xl" className="group w-full sm:w-auto">
            <Link href={HERO.cta.primary.href}>
              {HERO.cta.primary.label}
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="xl"
            className="group w-full sm:w-auto border-border/60 hover:border-primary/40 hover:bg-primary/5"
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
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors group animate-fade-in-up"
          style={{ animationDelay: "340ms" } as React.CSSProperties}
        >
          <Package className="h-3.5 w-3.5" />
          See products we&apos;ve shipped
          <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>

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

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-background to-transparent pointer-events-none"
        aria-hidden="true"
      />
    </section>
  );
}
