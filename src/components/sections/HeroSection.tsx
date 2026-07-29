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
import { HERO } from "@/data/constants";
import { cn } from "@/lib/utils";

type Detail =
  | { kind: "chips"; icons: React.ElementType[] }
  | { kind: "metric"; label: string; value: string; fill: number };

type Node = {
  label: string;
  icon: React.ElementType;
  href: string;
  detail: Detail;
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
    x: 4,
    y: 1,
  },
  {
    label: "Web Development",
    icon: Globe,
    href: "/services#web-development",
    detail: { kind: "metric", label: "Lighthouse", value: "98/100", fill: 96 },
    x: 71,
    y: 3,
  },
  {
    label: "Mobile Apps",
    icon: Smartphone,
    href: "/services#mobile-apps",
    detail: { kind: "chips", icons: [Layout, Zap, Rocket, Sparkles] },
    x: 0,
    y: 35,
  },
  {
    label: "SaaS Products",
    icon: Layers,
    href: "/services#saas",
    detail: { kind: "chips", icons: [Users, CreditCard, Boxes, Blocks] },
    x: 73,
    y: 34,
  },
  {
    label: "UI/UX Design",
    icon: Palette,
    href: "/services#design",
    detail: { kind: "chips", icons: [Figma, Layout, Sparkles, Gauge] },
    x: 6,
    y: 66,
  },
  {
    label: "API Integration",
    icon: Plug,
    href: "/services#api-integration",
    detail: { kind: "metric", label: "Latency", value: "80ms", fill: 72 },
    x: 70,
    y: 64,
  },
];

/**
 * Brand mark rendered inline so it inherits theme colours. The gradient id is
 * per-instance (useId) — a shared id would be owned by whichever copy mounts
 * first, and the hidden desktop copy would starve the mobile one.
 */
function SterovaMark({ className }: { className?: string }) {
  // useId() emits ":r0:" / "«r0»" which are invalid in url(#...) references.
  const gid = `sterova-mark-${useId().replace(/[^a-zA-Z0-9-_]/g, "")}`;
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--primary)" />
          <stop offset="100%" stopColor="var(--primary-light)" />
        </linearGradient>
      </defs>
      <path d="M24 2 42 12v24L24 46 6 36V12L24 2Z" fill={`url(#${gid})`} opacity="0.14" />
      <path
        d="M31.5 16.5c-2-2.2-4.7-3.3-7.9-3.3-4.9 0-8.2 2.4-8.2 6.2 0 3.3 2.3 5.1 7.1 6.1l2.6.6c2.6.6 3.7 1.3 3.7 2.7 0 1.7-1.7 2.8-4.5 2.8-3 0-5.3-1.2-7-3.4"
        fill="none"
        stroke={`url(#${gid})`}
        strokeWidth="3.4"
        strokeLinecap="round"
      />
      <path
        d="M24 2 42 12v24L24 46 6 36V12L24 2Z"
        fill="none"
        stroke={`url(#${gid})`}
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function NodeDetail({ detail }: { detail: Detail }) {
  if (detail.kind === "chips") {
    return (
      <span className="mt-3 flex items-center gap-1.5" aria-hidden="true">
        {detail.icons.map((Chip, i) => (
          <span
            key={i}
            className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-border/70 bg-surface text-muted-foreground transition-colors duration-300 group-hover:border-primary/30 group-hover:text-primary"
          >
            <Chip className="h-3.5 w-3.5" />
          </span>
        ))}
      </span>
    );
  }
  return (
    <span className="mt-3 block" aria-hidden="true">
      <span className="flex items-baseline justify-between">
        <span className="text-[0.75rem] text-muted-foreground">{detail.label}</span>
        <span className="font-mono text-[0.75rem] font-medium text-foreground">{detail.value}</span>
      </span>
      <span className="mt-2 block h-1.5 w-full overflow-hidden rounded-full bg-surface">
        <span
          className="gradient-brand block h-full rounded-full"
          style={{ width: `${detail.fill}%` }}
        />
      </span>
    </span>
  );
}

function NodeCard({ node, compact = false }: { node: Node; compact?: boolean }) {
  const Icon = node.icon;
  return (
    <Link
      href={node.href}
      className={cn(
        "group card-premium sheen block h-full text-left outline-none",
        "transition-[transform,box-shadow,border-color] duration-300 ease-out",
        "hover:-translate-y-1 hover:border-primary/40 hover:shadow-[var(--shadow-card-hover)]",
        "focus-visible:-translate-y-1 focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
        compact ? "p-4" : "p-4 xl:p-5",
      )}
    >
      <span className="flex items-center gap-2.5">
        <span
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border bg-surface text-primary transition-colors duration-300 group-hover:border-primary/40 group-hover:bg-primary group-hover:text-primary-foreground"
          aria-hidden="true"
        >
          <Icon className="h-4 w-4" />
        </span>
        <span className="min-w-0 text-sm font-semibold leading-tight tracking-tight text-foreground">
          {node.label}
        </span>
      </span>
      <NodeDetail detail={node.detail} />
    </Link>
  );
}

/** Central node: the Sterova core every capability connects back to. */
function Core() {
  return (
    <div className="relative">
      <span
        className="pointer-events-none absolute inset-0 -z-10 rounded-[2rem] bg-primary/25 blur-3xl"
        aria-hidden="true"
      />
      <div className="card-premium sheen relative flex flex-col items-center gap-3 px-6 py-8 text-center">
        <span
          className="pointer-events-none absolute inset-0 rounded-[inherit] border border-primary/20"
          aria-hidden="true"
        />
        <span className="relative flex h-16 w-16 items-center justify-center">
          <span
            className="absolute inset-0 rounded-full bg-primary/25 animate-pulse-ring motion-reduce:hidden"
            aria-hidden="true"
          />
          <span className="gradient-brand glow-brand relative flex h-16 w-16 items-center justify-center rounded-2xl">
            <SterovaMark className="h-10 w-10 [&_path]:stroke-primary-foreground" />
          </span>
        </span>
        <span className="font-display text-lg font-semibold tracking-tight">Sterova Core</span>
        <span className="text-[0.8125rem] text-muted-foreground">
          One integrated engineering partner
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
              Software your business
              <br className="hidden sm:block" /> <span className="gradient-text">can build on</span>
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
            <div className="relative mx-auto hidden aspect-[7/5.4] max-h-[min(78vh,40rem)] w-full lg:block">
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
                    y1="50"
                    x2={n.x < 50 ? n.x + 27 : n.x}
                    y2={n.y + 11}
                    stroke="var(--border-strong)"
                    strokeWidth="0.25"
                    strokeDasharray="1.2 1.6"
                  />
                ))}
              </svg>

              <div className="absolute left-1/2 top-1/2 w-[30%] -translate-x-1/2 -translate-y-1/2">
                <motion.div
                  initial={reduce ? false : { opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.15 }}
                >
                  <Core />
                </motion.div>
              </div>

              {NODES.map((node, i) => (
                <div
                  key={node.label}
                  style={{ left: `${node.x}%`, top: `${node.y}%` }}
                  className="absolute w-[27%] min-w-[11rem]"
                >
                  <motion.div
                    initial={reduce ? false : { opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.25 + i * 0.07 }}
                  >
                    <div
                      className="animate-float-slow motion-reduce:animate-none [&:has(:hover)]:[animation-play-state:paused] [&:has(:focus-visible)]:[animation-play-state:paused]"
                      style={{ animationDelay: `${i * 0.7}s` }}
                    >
                      <NodeCard node={node} />
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
