import { Link } from "@/lib/router-compat";
import { ArrowRight, Building2, Cpu, BadgeDollarSign, GitBranch } from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";
import CTASection from "@/components/sections/CTASection";
import AnimatedSection from "@/components/shared/AnimatedSection";

const SOLUTIONS_ITEMS = [
  {
    title: "Industries",
    description:
      "Discover how we tailor our software engineering solutions for FinTech, Healthcare, EdTech, E-commerce, and more.",
    href: "/industries",
    icon: Building2,
    badge: "Sectors",
    color: "from-blue-500/10 to-cyan-500/10 border-blue-500/20 text-blue-500",
  },
  {
    title: "Technologies",
    description:
      "Explore our full-stack technology expertise, including React, Node.js, Python, Supabase, and cloud infrastructure.",
    href: "/technologies",
    icon: Cpu,
    badge: "Stack",
    color: "from-violet-500/10 to-purple-500/10 border-violet-500/20 text-violet-500",
  },
  {
    title: "Pricing",
    description:
      "Transparent engagement models, standard packages, and custom quoting processes tailored for your specific needs.",
    href: "/pricing",
    icon: BadgeDollarSign,
    badge: "Engagement",
    color: "from-emerald-500/10 to-teal-500/10 border-emerald-500/20 text-emerald-500",
  },
  {
    title: "Our Process",
    description:
      "From initial discovery and scoping to post-launch support — learn exactly how we engineer and ship quality software.",
    href: "/process",
    icon: GitBranch,
    badge: "Methodology",
    color: "from-amber-500/10 to-yellow-500/10 border-amber-500/20 text-amber-500",
  },
];

export default function SolutionsPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-border bg-surface pt-36 pb-20">
        <div
          className="pointer-events-none absolute inset-0 dot-grid opacity-40"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -top-1/3 left-1/2 aspect-square w-[60rem] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl"
          aria-hidden="true"
        />
        <div className="container-custom relative text-center max-w-4xl mx-auto">
          <AnimatedSection>
            <SectionHeader
              badge="Solutions"
              title="Tailored solutions for your business"
              description="Explore our industry expertise, technology stack, transparent pricing, and engineering process."
              centered
              size="page"
            />
          </AnimatedSection>
        </div>
      </section>

      <section className="section-y bg-background">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {SOLUTIONS_ITEMS.map((item, i) => {
              const Icon = item.icon;
              const [bgGradient1, bgGradient2, borderColor, textColor] = item.color.split(" ");

              return (
                <AnimatedSection key={item.href} delay={i * 0.1}>
                  <Link
                    href={item.href}
                    className={`group flex flex-col h-full rounded-2xl border bg-gradient-to-br p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)] ${bgGradient1} ${bgGradient2} ${borderColor}`}
                  >
                    <div className="mb-6 flex items-center justify-between">
                      <span
                        className={`flex h-14 w-14 items-center justify-center rounded-xl border border-border bg-background/60 backdrop-blur-sm ${textColor}`}
                      >
                        <Icon className="h-7 w-7" />
                      </span>
                      <span className="text-xs font-medium text-muted-foreground border border-border/50 rounded-full px-3 py-1 bg-background/60">
                        {item.badge}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold font-display text-foreground mb-3 group-hover:text-primary transition-colors">
                      {item.title}
                    </h2>
                    <p className="text-[0.95rem] text-muted-foreground leading-relaxed flex-1 mb-8">
                      {item.description}
                    </p>
                    <div className="mt-auto flex items-center gap-1.5 text-sm font-semibold text-primary">
                      Explore {item.title}
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </Link>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
