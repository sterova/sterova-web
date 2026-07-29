import { motion, useReducedMotion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchActiveStats } from "@/lib/api";
import SectionHeader from "@/components/shared/SectionHeader";

/** Splits "92%" / "$1.2M" / "8" into an animatable number plus its affixes. */
function parseMetric(value: string) {
  const match = value.match(/^(\D*)([\d.,]+)(.*)$/);
  if (!match) return { prefix: "", number: null as number | null, suffix: value };
  const numeric = Number(match[2].replace(/,/g, ""));
  return {
    prefix: match[1],
    number: Number.isFinite(numeric) ? numeric : null,
    suffix: match[3],
  };
}

function CountUp({ value, duration = 1.4 }: { value: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.6 });
  const { prefix, number: target, suffix } = parseMetric(value);
  const decimals = target !== null && !Number.isInteger(target) ? 1 : 0;
  const [display, setDisplay] = useState(() => (target === null ? "" : (0).toFixed(decimals)));

  useEffect(() => {
    if (!isInView || target === null) return;
    let raf: number;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setDisplay((eased * target).toFixed(decimals));
      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isInView, target, duration, decimals]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

export default function StatsSection() {
  const reduce = useReducedMotion();
  const { data } = useQuery({
    queryKey: ["site-stats"],
    queryFn: fetchActiveStats,
    staleTime: 5 * 60_000,
    retry: 1,
  });

  // No active records (or a failed read) → render nothing at all.
  const stats = data ?? [];
  if (stats.length === 0) return null;

  return (
    <section className="section-y">
      <div className="container-custom">
        <SectionHeader
          badge="By the numbers"
          title="Results that speak for themselves"
          description="We don't just build software — we help teams launch, scale, and outperform expectations."
          centered
          className="mb-16"
        />
        <div className="grid gap-px overflow-hidden rounded-[2rem] border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.id}
              initial={reduce ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative flex flex-col items-center justify-center bg-card px-6 py-12 text-center transition-colors hover:bg-surface"
            >
              <div
                className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
                aria-hidden="true"
              />
              <p className="font-display text-[clamp(2.5rem,5vw,4rem)] font-bold leading-none tracking-[-0.04em] text-foreground">
                <CountUp value={stat.value} />
              </p>
              <p className="mt-3 max-w-[12rem] text-sm font-medium leading-snug text-muted-foreground">
                {stat.title}
              </p>
              {stat.description ? (
                <p className="mt-2 max-w-[16rem] text-xs leading-relaxed text-muted-foreground/80">
                  {stat.description}
                </p>
              ) : null}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
