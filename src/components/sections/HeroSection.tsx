import { Link } from "wouter";
import {
  ArrowRight,
  Check,
  ChevronRight,
  Code2,
  Globe,
  Smartphone,
  Layers,
  Palette,
  Plug,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HERO, SITE } from "@/data/constants";

const ECOSYSTEM_ICONS: Record<string, React.ElementType> = {
  Code2,
  Globe,
  Smartphone,
  Layers,
  Palette,
  Plug,
};

/**
 * Satellite card positions expressed as percentages of the widget container.
 * Each entry pairs with HERO.ecosystem by index.
 */
const NODE_POSITIONS = [
  { x: 24, y: 9 },   // top-left
  { x: 79, y: 15 },  // top-right
  { x: 7, y: 48 },   // left
  { x: 93, y: 55 },  // right
  { x: 22, y: 89 },  // bottom-left
  { x: 74, y: 92 },  // bottom-right
];

function EcosystemWidget() {
  return (
    <div
      className="relative w-full max-w-[560px] mx-auto aspect-square select-none"
      aria-label="Sterova capability ecosystem"
      role="img"
    >
      {/* Dashed connector lines */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {NODE_POSITIONS.map((pos, i) => (
          <line
            key={i}
            x1="50"
            y1="50"
            x2={pos.x}
            y2={pos.y}
            stroke="hsl(var(--primary))"
            strokeOpacity="0.28"
            strokeWidth="1.5"
            strokeDasharray="4 5"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>

      {/* Soft glow behind the center card */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 rounded-full bg-primary/15 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      {/* Central branded card */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-primary/20 bg-card/95 backdrop-blur-sm px-8 py-7 shadow-xl shadow-primary/10">
          <div
            className="flex items-center justify-center w-14 h-14 rounded-2xl text-white font-display font-black text-2xl shadow-lg shadow-primary/30"
            style={{
              backgroundImage:
                "linear-gradient(135deg, #4f46e5 0%, #6366f1 60%, #8b5cf6 100%)",
            }}
            aria-hidden="true"
          >
            S
          </div>
          <div className="text-center">
            <p className="font-display font-bold text-lg leading-none">{SITE.name}</p>
            <p className="text-[11px] text-muted-foreground mt-1.5 tracking-wide uppercase">
              Product Engineering
            </p>
          </div>
        </div>
      </div>

      {/* Satellite capability cards */}
      {HERO.ecosystem.map((node, i) => {
        const Icon = ECOSYSTEM_ICONS[node.icon_name] ?? Code2;
        const pos = NODE_POSITIONS[i];
        if (!pos) return null;
        return (
          <div
            key={node.label}
            className="absolute z-10 -translate-x-1/2 -translate-y-1/2 animate-node-float"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              animationDelay: `${i * -1.3}s`,
            }}
          >
            <div className="flex items-center gap-2.5 rounded-xl border border-border/70 bg-card/95 backdrop-blur-sm pl-2.5 pr-3.5 py-2.5 shadow-md shadow-black/5 hover:border-primary/40 hover:shadow-lg transition-all duration-300">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary shrink-0">
                <Icon className="h-4 w-4" />
              </span>
              <span className="text-xs sm:text-[13px] font-semibold whitespace-nowrap">
                {node.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function HeroSection() {
  return (
    <section
      className="relative overflow-hidden pt-28 pb-16 lg:pt-36 lg:pb-24 min-h-[calc(100svh-0px)] flex items-center"
      aria-label="Hero"
    >
      {/* Grid background */}
      <div
        className="absolute inset-0 bg-hero-grid opacity-60 dark:opacity-30"
        aria-hidden="true"
      />

      {/* Soft ambient glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div
          className="absolute -top-1/4 -left-1/4 w-[150%] h-[100%] animate-aurora opacity-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 55% at 30% 40%, rgba(99,102,241,0.18) 0%, rgba(139,92,246,0.08) 45%, transparent 72%)",
          }}
        />
      </div>

      <div className="relative z-10 container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-14 lg:gap-10">
          {/* Left — copy */}
          <div className="text-center lg:text-left space-y-8 max-w-xl mx-auto lg:mx-0">
            <div className="animate-fade-in-up">
              <Badge variant="sterova" className="text-xs py-1 px-3">
                {HERO.badge}
              </Badge>
            </div>

            <h1
              className="font-display text-4xl sm:text-5xl md:text-6xl xl:text-[4.25rem] font-bold tracking-tight text-balance leading-[1.08] animate-fade-in-up"
              style={{ animationDelay: "80ms" }}
            >
              Software your business can <span className="gradient-text">build on</span>
            </h1>

            <p
              className="text-lg sm:text-xl text-muted-foreground leading-relaxed text-pretty animate-fade-in-up"
              style={{ animationDelay: "160ms" }}
            >
              {HERO.subheadline}
            </p>

            <div
              className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4 animate-fade-in-up"
              style={{ animationDelay: "240ms" }}
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

            {/* How we work — verifiable commitments rather than invented metrics */}
            <ul
              className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 pt-6 border-t border-border/60 animate-fade-in-up text-left"
              style={{ animationDelay: "320ms" }}
            >
              {HERO.assurances.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <Check
                    className="h-4 w-4 mt-0.5 shrink-0 text-primary"
                    aria-hidden="true"
                  />
                  <span className="text-sm text-muted-foreground leading-relaxed">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right — ecosystem widget */}
          <div
            className="animate-fade-in-up px-2 sm:px-6 lg:px-0"
            style={{ animationDelay: "200ms" }}
          >
            <EcosystemWidget />
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none"
        aria-hidden="true"
      />
    </section>
  );
}
