import { Link } from "@/lib/router-compat";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Mail, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBrandLinks } from "@/hooks/use-brand-links";

interface Props {
  title?: string;
  description?: string;
}

export default function CTASection({
  title = "Ready to build something great?",
  description = "Tell us what you're working on. We reply within a day with honest feedback and a clear next step.",
}: Props) {
  const reduce = useReducedMotion();
  const { email, whatsappHref } = useBrandLinks();

  return (
    <section className="section-y">
      <div className="container-custom">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-[2rem] border border-border bg-card shadow-[var(--shadow-card-hover)] card-premium sheen"
        >
          <div
            className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
            aria-hidden="true"
          />
          <div
            className="dot-grid pointer-events-none absolute inset-0 opacity-60"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -left-32 -top-40 h-[32rem] w-[32rem] rounded-full bg-primary/15 blur-[130px]"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -bottom-40 -right-24 h-[28rem] w-[28rem] rounded-full bg-primary/10 blur-[130px]"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-500 hover:opacity-100 pointer-events-none"
            aria-hidden="true"
          />

          <div className="relative grid gap-10 p-8 sm:p-12 lg:grid-cols-12 lg:items-center lg:gap-16 xl:p-16">
            <div className="lg:col-span-7">
              <span className="eyebrow">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
                Start a conversation
              </span>
              <h2 className="mt-6 font-display text-[clamp(1.875rem,3.6vw,3rem)] font-semibold leading-[1.06] tracking-[-0.03em] text-balance">
                {title}
              </h2>
              <p className="mt-5 max-w-xl text-base leading-[1.75] text-text-secondary sm:text-lg">
                {description}
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button asChild variant="gradient" size="xl" className="group">
                  <Link href="/contact">
                    Start a project
                    <ArrowRight className="ml-1 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="xl">
                  <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="mr-1 h-5 w-5" aria-hidden="true" />
                    Chat on WhatsApp
                  </a>
                </Button>
              </div>
            </div>

            <div className="lg:col-span-5">
              <dl className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border">
                {[
                  { k: "Response time", v: "Within 24 hours" },
                  { k: "First call", v: "Free 30-min scoping" },
                  { k: "Confidentiality", v: "NDA signed on request" },
                ].map((row) => (
                  <div
                    key={row.k}
                    className="flex items-center justify-between gap-4 bg-card px-5 py-4"
                  >
                    <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                      {row.k}
                    </dt>
                    <dd className="text-sm font-medium tracking-tight">{row.v}</dd>
                  </div>
                ))}
              </dl>
              <a
                href={`mailto:${email}`}
                className="mt-4 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                {email}
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
