import { useId } from "react";
import { Link } from "@/lib/router-compat";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Blocks,
  Boxes,
  Braces,
  Code2,
  CreditCard,
  Database,
  Figma,
  Gauge,
  Globe,
  Layers,
  Layout,
  Palette,
  Plug,
  Rocket,
  Server,
  Shield,
  Smartphone,
  Sparkles,
  Users,
  Webhook,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { HERO, SITE } from "@/data/constants";
import { cn } from "@/lib/utils";

type Detail =
  | { kind: "chips"; icons: React.ElementType[] }
  | { kind: "metric"; label: string; value: string; fill: number };

const THEMES = {
  blue: { text: "text-blue-600 dark:text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", shadow: "shadow-blue-500/20", hoverBg: "group-hover:bg-blue-500", hoverText: "group-hover:text-white", hoverIconText: "group-hover:text-blue-600", hoverBorder: "group-hover:border-blue-500/40", fill: "bg-blue-500" },
  emerald: { text: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", shadow: "shadow-emerald-500/20", hoverBg: "group-hover:bg-emerald-500", hoverText: "group-hover:text-white", hoverIconText: "group-hover:text-emerald-600", hoverBorder: "group-hover:border-emerald-500/40", fill: "bg-emerald-500" },
  purple: { text: "text-purple-600 dark:text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20", shadow: "shadow-purple-500/20", hoverBg: "group-hover:bg-purple-500", hoverText: "group-hover:text-white", hoverIconText: "group-hover:text-purple-600", hoverBorder: "group-hover:border-purple-500/40", fill: "bg-purple-500" },
  amber: { text: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", shadow: "shadow-amber-500/20", hoverBg: "group-hover:bg-amber-500", hoverText: "group-hover:text-white", hoverIconText: "group-hover:text-amber-600", hoverBorder: "group-hover:border-amber-500/40", fill: "bg-amber-500" },
  pink: { text: "text-pink-600 dark:text-pink-400", bg: "bg-pink-500/10", border: "border-pink-500/20", shadow: "shadow-pink-500/20", hoverBg: "group-hover:bg-pink-500", hoverText: "group-hover:text-white", hoverIconText: "group-hover:text-pink-600", hoverBorder: "group-hover:border-pink-500/40", fill: "bg-pink-500" },
  cyan: { text: "text-cyan-600 dark:text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20", shadow: "shadow-cyan-500/20", hoverBg: "group-hover:bg-cyan-500", hoverText: "group-hover:text-white", hoverIconText: "group-hover:text-cyan-600", hoverBorder: "group-hover:border-cyan-500/40", fill: "bg-cyan-500" },
};

type Node = {
  label: string;
  icon: React.ElementType;
  href: string;
  detail: Detail;
  theme: keyof typeof THEMES;
  /** Desktop anchor, in % of the constellation box (card top-left). */
  x: number;
  y: number;
};

const NODES: Node[] = [
  {
    label: "Custom Software",
    icon: Code2,
    href: "/services#custom-software",
    detail: { kind: "chips", icons: [Server, Database, Shield, Braces] },
    theme: "blue",
    x: 10,
    y: -12,
  },
  {
    label: "Web Development",
    icon: Globe,
    href: "/services#web-development",
    detail: { kind: "metric", label: "Lighthouse", value: "98/100", fill: 96 },
    theme: "emerald",
    x: 66,
    y: -12,
  },
  {
    label: "Mobile Apps",
    icon: Smartphone,
    href: "/services#mobile-apps",
    detail: { kind: "chips", icons: [Layout, Zap, Rocket, Sparkles] },
    theme: "purple",
    x: 4,
    y: 26,
  },
  {
    label: "SaaS Products",
    icon: Layers,
    href: "/services#saas",
    detail: { kind: "chips", icons: [Users, CreditCard, Boxes, Blocks] },
    theme: "amber",
    x: 72,
    y: 26,
  },
  {
    label: "UI/UX Design",
    icon: Palette,
    href: "/services#design",
    detail: { kind: "chips", icons: [Figma, Layout, Sparkles, Gauge] },
    theme: "pink",
    x: 10,
    y: 64,
  },
  {
    label: "API Integration",
    icon: Plug,
    href: "/services#api-integration",
    detail: { kind: "metric", label: "Latency", value: "80ms", fill: 72 },
    theme: "cyan",
    x: 66,
    y: 64,
  },
];


function NodeDetail({ detail, theme }: { detail: Detail; theme: keyof typeof THEMES }) {
  const t = THEMES[theme];
  if (detail.kind === "chips") {
    return (
      <span className="mt-3 xl:mt-4 flex items-center gap-1 xl:gap-1.5" aria-hidden="true">
        {detail.icons.map((Chip, i) => (
          <span
            key={i}
            className={cn(
              "inline-flex h-5 w-5 xl:h-7 xl:w-7 shrink-0 items-center justify-center rounded-full transition-colors duration-300",
              t.bg, t.text
            )}
          >
            <Chip className="h-[10px] w-[10px] xl:h-3.5 xl:w-3.5" />
          </span>
        ))}
      </span>
    );
  }
  return (
    <span className="mt-3 xl:mt-4 block" aria-hidden="true">
      <span className="flex items-baseline justify-between">
        <span className="text-[0.7rem] xl:text-[0.8rem] font-medium text-muted-foreground">{detail.label}</span>
        <span className="font-mono text-[0.7rem] xl:text-[0.8rem] font-bold text-foreground">{detail.value}</span>
      </span>
      <span className="mt-1.5 xl:mt-2 block h-1.5 xl:h-2 w-full overflow-hidden rounded-full bg-surface">
        <span
          className={cn("block h-full rounded-full", t.fill)}
          style={{ width: `${detail.fill}%` }}
        />
      </span>
    </span>
  );
}

function NodeCard({ node, compact = false }: { node: Node; compact?: boolean }) {
  const Icon = node.icon;
  const t = THEMES[node.theme];
  return (
    <Link
      href={node.href}
      className={cn(
        "group bg-white dark:bg-card block h-full text-left outline-none rounded-2xl xl:rounded-3xl",
        "border border-border/40",
        "transition-all duration-300 ease-out",
        "hover:-translate-y-1 hover:border-primary/40",
        "shadow-xl", t.shadow,
        "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
        compact ? "p-3" : "p-3 xl:p-5",
      )}
    >
      <span className="flex items-center gap-2 xl:gap-3">
        <span
          className={cn(
            "inline-flex h-8 w-8 xl:h-10 xl:w-10 shrink-0 items-center justify-center rounded-full transition-colors duration-300",
            t.bg, t.text
          )}
          aria-hidden="true"
        >
          <Icon className="h-4 w-4 xl:h-5 xl:w-5" />
        </span>
        <span className="min-w-0 text-[0.8rem] xl:text-[0.95rem] font-bold leading-tight tracking-tight text-foreground">
          {node.label}
        </span>
      </span>
      <NodeDetail detail={node.detail} theme={node.theme} />
    </Link>
  );
}

/** Central node: the Sterova core every capability connects back to. */
function Core() {
  return (
    <div className="relative w-full h-full">
      <span
        className="pointer-events-none absolute inset-0 -z-10 rounded-[2rem] bg-primary/25 blur-3xl"
        aria-hidden="true"
      />
      <div className="bg-white dark:bg-card relative flex h-full w-full flex-col items-center justify-center gap-1 xl:gap-2 p-3 xl:p-5 text-center rounded-2xl xl:rounded-[2.5rem] shadow-2xl shadow-cyan-500/10 border border-border/40">
        <span className="relative flex h-16 w-16 xl:h-24 xl:w-24 items-center justify-center mb-1 xl:mb-2">
          <span className="absolute inset-0 rounded-[1rem] xl:rounded-[1.5rem] bg-gradient-to-br from-slate-700 to-slate-900 dark:from-slate-600 dark:to-slate-800 shadow-xl" />
          <span className="relative flex items-center justify-center">
            <img src="/logo.png" alt={`${SITE.name} Logo`} className="h-8 w-8 xl:h-12 xl:w-12 object-contain brightness-0 invert" />
          </span>
        </span>
        <span className="font-display text-lg xl:text-xl min-[1400px]:text-2xl font-black tracking-tight leading-none text-foreground mt-1">{SITE.name}</span>
        <span className="text-[0.6rem] xl:text-[0.85rem] font-medium text-muted-foreground mt-0.5">
          Digital Solutions
        </span>
      </div>
    </div>
  );
}

export default function HeroSection() {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden pt-28 pb-16 lg:pt-36 lg:pb-24" aria-label="Hero">
      {/* Ambient background: dotted field + two restrained brand washes. */}
      <div
        className="dot-grid radial-fade pointer-events-none absolute inset-0 opacity-70"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -left-56 -top-40 h-[42rem] w-[42rem] rounded-full bg-primary/10 blur-[160px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-64 top-24 h-[38rem] w-[38rem] rounded-full bg-primary/8 blur-[170px]"
        aria-hidden="true"
      />

      <div className="container-custom relative z-10">
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-10 xl:gap-16">
          {/* ── Copy ───────────────────────────────────────────── */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5"
          >
            <span className="eyebrow">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
              {HERO.badge}
            </span>

            <h1 className="mt-7 text-[clamp(2.5rem,6vw,4.25rem)] font-semibold leading-[1.02] tracking-[-0.03em]">
              Sterova: Software your business <span className="gradient-text">can build on</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-[1.7] text-text-secondary">
              {HERO.subheadline}
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                asChild
                variant="gradient"
                size="xl"
                className="group transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)] focus-visible:-translate-y-0.5 motion-reduce:transition-none"
              >
                <Link href={HERO.cta.primary.href}>
                  {HERO.cta.primary.label}
                  <ArrowRight className="ml-1 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="xl"
                className="group transition-[transform,background-color,border-color] duration-300 hover:-translate-y-0.5 hover:border-primary/50 focus-visible:-translate-y-0.5 motion-reduce:transition-none"
              >
                <Link href={HERO.cta.secondary.href}>{HERO.cta.secondary.label}</Link>
              </Button>
            </div>

            <dl className="mt-12 grid gap-x-8 gap-y-4 border-t border-border pt-8 sm:grid-cols-2">
              {HERO.assurances.map((item, i) => (
                <div key={item} className="flex gap-3">
                  <dt className="font-mono text-[11px] leading-6 text-primary">
                    {String(i + 1).padStart(2, "0")}
                  </dt>
                  <dd className="text-sm leading-6 text-muted-foreground">{item}</dd>
                </div>
              ))}
            </dl>
          </motion.div>

          {/* ── Constellation ──────────────────────────────────── */}
          <div className="hidden lg:col-span-7 lg:block">
            {/* Desktop: anchored nodes orbiting the core. */}
            <motion.div
              initial={reduce ? false : { opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="relative mx-auto hidden aspect-[7/5.4] max-h-[min(78vh,40rem)] w-full lg:block"
            >
              <svg
                className="absolute inset-0 h-full w-full"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                {NODES.map((n) => (
                  <line
                    key={n.label}
                    x1="50"
                    y1="35"
                    x2={n.x + 12}
                    y2={n.y + 10}
                    stroke="var(--border-strong)"
                    strokeWidth="0.25"
                    strokeDasharray="1.2 1.6"
                  />
                ))}
              </svg>

              <div className="absolute left-1/2 top-[35%] w-[25%] aspect-square min-w-[8rem] xl:min-w-[9rem] -translate-x-1/2 -translate-y-1/2">
                <Core />
              </div>

              {NODES.map((node, i) => (
                <div
                  key={node.label}
                  style={{ left: `${node.x + 12}%`, top: `${node.y + 10}%` }}
                  className="absolute w-[24%] min-w-[9rem] xl:min-w-[11rem] -translate-x-1/2 -translate-y-1/2"
                >
                  <div
                    className="animate-float-slow motion-reduce:animate-none [&:has(:hover)]:[animation-play-state:paused] [&:has(:focus-visible)]:[animation-play-state:paused]"
                    style={{ animationDelay: `${i * 0.7}s` }}
                  >
                    <NodeCard node={node} />
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
