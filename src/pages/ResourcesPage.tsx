import { Link } from "@/lib/router-compat";
import { ArrowRight, BookOpen, Monitor } from "lucide-react";
import CTASection from "@/components/sections/CTASection";
import AnimatedSection from "@/components/shared/AnimatedSection";
import SectionHeader from "@/components/shared/SectionHeader";
import { NAV_LINKS } from "@/data/constants";

const ICON_MAP: Record<string, React.ElementType> = {
  BookOpen,
  Monitor,
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
];

export default function ResourcesPage() {
  const resourcesLink = NAV_LINKS.find((link) => link.label === "Resources");
  const sublinks = resourcesLink?.children || [];

  return (
    <>
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
            <SectionHeader
              badge="Resources"
              title="Knowledge & Tools"
              description="Explore our technical notes, engineering standards, and the core technologies we use to build scalable products."
              centered
              size="page"
            />
          </AnimatedSection>
        </div>
      </section>

      <section className="section-y bg-background min-h-[50vh]">
        <div className="container-custom max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {sublinks.map((sublink, i) => {
              const Icon = sublink.icon_name ? (ICON_MAP[sublink.icon_name] ?? BookOpen) : BookOpen;
              const theme = THEMES[i % THEMES.length];

              return (
                <AnimatedSection key={sublink.href} delay={i * 0.06}>
                  <Link
                    href={sublink.href}
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
                      {sublink.label}
                    </h2>
                    <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                      {sublink.description}
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
