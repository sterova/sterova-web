import { useState } from "react";
import AnimatedSection from "@/components/shared/AnimatedSection";
import SectionHeader from "@/components/shared/SectionHeader";
import { Mail, Check, PenLine, Zap, BookOpen, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const BENEFITS = [
  {
    icon: PenLine,
    title: "Engineering insights",
    description: "Practical articles on architecture, tooling, and software delivery written by the Sterova team.",
  },
  {
    icon: Zap,
    title: "Industry radar",
    description: "The frameworks, tools, and patterns worth paying attention to — curated, not aggregated.",
  },
  {
    icon: BookOpen,
    title: "Whitepaper releases",
    description: "First access to new technical guides and research we publish, before they're promoted anywhere else.",
  },
];

const PAST_ISSUES = [
  { title: "Picking a data layer for your next SaaS", date: "Jul 2025" },
  { title: "Why most API designs break under real traffic", date: "Jun 2025" },
  { title: "React Server Components: production patterns", date: "May 2025" },
  { title: "The case for fewer dependencies in 2025", date: "Apr 2025" },
];

export default function NewsletterPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setSubmitted(true);
  }

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-surface pt-36 pb-20">
        <div className="pointer-events-none absolute inset-0 dot-grid opacity-40" aria-hidden="true" />
        <div
          className="pointer-events-none absolute -top-1/3 left-1/2 aspect-square w-[60rem] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl"
          aria-hidden="true"
        />
        <div className="container-custom relative text-center max-w-3xl mx-auto">
          <AnimatedSection>
            <SectionHeader
              badge="Newsletter"
              title="The Sterova Signal"
              description="Engineering insights and industry updates, once a month. Practical, opinionated, and concise — no fluff."
              centered
              size="page"
            />
          </AnimatedSection>
        </div>
      </section>

      <section className="section-y bg-background">
        <div className="container-custom max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">

            {/* Signup form */}
            <div className="lg:col-span-3">
              <AnimatedSection>
                <div className="card-premium p-8">
                  {submitted ? (
                    <div className="text-center py-8">
                      <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 mb-5">
                        <Check className="h-8 w-8" />
                      </span>
                      <h2 className="font-display font-bold text-xl mb-2">You're subscribed!</h2>
                      <p className="text-sm text-muted-foreground">
                        Thanks for signing up. You'll receive the next issue when it publishes.
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-3 mb-6">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-primary">
                          <Mail className="h-5 w-5" />
                        </span>
                        <div>
                          <h2 className="font-semibold text-base">Subscribe free</h2>
                          <p className="text-xs text-muted-foreground">
                            Monthly · No spam · Unsubscribe anytime
                          </p>
                        </div>
                      </div>

                      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div>
                          <label htmlFor="newsletter-email" className="block text-sm font-medium mb-1.5">
                            Email address
                          </label>
                          <input
                            id="newsletter-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@company.com"
                            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow"
                            required
                            autoComplete="email"
                          />
                          {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
                        </div>
                        <Button type="submit" variant="gradient" className="w-full rounded-full h-11">
                          Subscribe to The Sterova Signal
                          <ArrowRight className="ml-1 h-4 w-4" />
                        </Button>
                      </form>

                      <p className="mt-4 text-xs text-muted-foreground text-center">
                        By subscribing you agree to our{" "}
                        <a href="/privacy" className="underline hover:text-foreground">
                          Privacy Policy
                        </a>
                        . We'll never share your email.
                      </p>
                    </>
                  )}
                </div>
              </AnimatedSection>

              {/* What you'll get */}
              <AnimatedSection delay={0.1} className="mt-6">
                <div className="flex flex-col gap-4">
                  {BENEFITS.map((b) => {
                    const Icon = b.icon;
                    return (
                      <div key={b.title} className="flex items-start gap-4">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-primary">
                          <Icon className="h-4 w-4" />
                        </span>
                        <div>
                          <p className="font-medium text-sm">{b.title}</p>
                          <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                            {b.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </AnimatedSection>
            </div>

            {/* Past issues */}
            <div className="lg:col-span-2">
              <AnimatedSection delay={0.15}>
                <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4">
                  Past issues
                </h3>
                <div className="flex flex-col gap-3">
                  {PAST_ISSUES.map((issue) => (
                    <div
                      key={issue.title}
                      className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card px-4 py-3"
                    >
                      <p className="text-sm font-medium leading-snug">{issue.title}</p>
                      <span className="shrink-0 text-xs text-muted-foreground">{issue.date}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-xs text-muted-foreground">
                  Subscribe to unlock the full archive.
                </p>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
