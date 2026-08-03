import { Link } from "@/lib/router-compat";
import { ArrowRight, FolderOpen, FileText, Star, Sparkles } from "lucide-react";
import CTASection from "@/components/sections/CTASection";
import AnimatedSection from "@/components/shared/AnimatedSection";
import { NAV_LINKS } from "@/data/constants";

const ICON_MAP: Record<string, React.ElementType> = {
  FolderOpen,
  FileText,
  Star,
};

const THEMES = [
  {
    gradient: "from-blue-500/8 to-cyan-500/8",
    border: "border-blue-500/20 hover:border-blue-500/40",
    iconBg: "bg-blue-500/10 group-hover:bg-blue-500",
    iconColor: "text-blue-500 group-hover:text-white",
  },
  {
    gradient: "from-violet-500/8 to-purple-500/8",
    border: "border-violet-500/20 hover:border-violet-500/40",
    iconBg: "bg-violet-500/10 group-hover:bg-violet-500",
    iconColor: "text-violet-500 group-hover:text-white",
  },
  {
    gradient: "from-amber-500/8 to-yellow-500/8",
    border: "border-amber-500/20 hover:border-amber-500/40",
    iconBg: "bg-amber-500/10 group-hover:bg-amber-500",
    iconColor: "text-amber-500 group-hover:text-white",
  },
];

export default function AllWorksPage() {
  const worksLink = NAV_LINKS.find((link) => link.href === "/all-works");
  const categories = worksLink?.children || [];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-surface pt-36 pb-24">
        <div
          className="pointer-events-none absolute inset-0 dot-grid opacity-40"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -top-1/3 left-1/2 aspect-square w-[60rem] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl"
          aria-hidden="true"
        />
        <div className="container-custom relative text-center">
          <AnimatedSection>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary uppercase tracking-wider mb-6">
              <Sparkles className="h-3.5 w-3.5" />
              Our Work
            </span>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground mb-6 leading-[1.1] max-w-3xl mx-auto">
              See what we've built
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Explore our portfolio of shipped products, deep-dive case studies, and hear directly
              from the founders and teams we partner with.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Category cards */}
      <section className="section-y bg-background min-h-[50vh]">
        <div className="container-custom max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {categories.map((category, i) => {
              const Icon = category.icon_name
                ? (ICON_MAP[category.icon_name] ?? FolderOpen)
                : FolderOpen;
              const theme = THEMES[i % THEMES.length];

              return (
                <AnimatedSection key={category.href} delay={i * 0.06}>
                  <Link
                    href={category.href}
                    className={`group flex flex-col h-full rounded-2xl border bg-gradient-to-br ${theme.gradient} ${theme.border} p-7 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[var(--shadow-card-hover)]`}
                  >
                    <div className="mb-6 flex items-center justify-between">
                      <span
                        className={`flex h-12 w-12 items-center justify-center rounded-xl ${theme.iconBg} ${theme.iconColor} transition-colors duration-300`}
                      >
                        <Icon className="h-6 w-6" />
                      </span>
                      <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-primary" />
                    </div>
                    <h2 className="text-xl font-bold font-display text-foreground mb-3 group-hover:text-primary transition-colors">
                      {category.label}
                    </h2>
                    <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                      {category.description}
                    </p>
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
