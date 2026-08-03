import AnimatedSection from "@/components/shared/AnimatedSection";
import SectionHeader from "@/components/shared/SectionHeader";
import BrandLogo from "@/components/shared/BrandLogo";
import { SITE } from "@/data/constants";
import { Download, Mail, ArrowRight, Palette, Type, Building2 } from "lucide-react";

const BRAND_COLORS = [
  { name: "Brand Primary", hex: "#7C3AED", role: "Primary / CTAs / links" },
  { name: "Brand Dark", hex: "#17181b", role: "Background / dark mode" },
  { name: "Brand Surface", hex: "#1f2023", role: "Card / surface backgrounds" },
  { name: "Brand Muted", hex: "#71717a", role: "Secondary text" },
  { name: "Brand Border", hex: "#27272a", role: "Borders / dividers" },
  { name: "Brand White", hex: "#FAFAFA", role: "Light mode background" },
];

const FONTS = [
  { name: "Display: Syne", usage: "Headings, logo text, display copy", weight: "700–900" },
  { name: "Body: Inter", usage: "Paragraphs, UI text, navigation", weight: "400–600" },
  { name: "Mono: JetBrains Mono", usage: "Code blocks, technical content", weight: "400–700" },
];

export default function PressKitPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-surface pt-36 pb-20">
        <div className="pointer-events-none absolute inset-0 dot-grid opacity-40" aria-hidden="true" />
        <div
          className="pointer-events-none absolute -top-1/3 left-1/2 aspect-square w-[60rem] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl"
          aria-hidden="true"
        />
        <div className="container-custom relative text-center max-w-4xl mx-auto">
          <AnimatedSection>
            <SectionHeader
              badge="Media"
              title="Press Kit & Brand Assets"
              description="Official logos, brand guidelines, boilerplate copy, and media contact information for journalists, partners, and publications."
              centered
              size="page"
            />
          </AnimatedSection>
        </div>
      </section>

      <div className="section-y bg-background">
        <div className="container-custom max-w-5xl mx-auto space-y-16">

          {/* Company boilerplate */}
          <AnimatedSection>
            <div className="flex items-center gap-3 mb-6">
              <Building2 className="h-5 w-5 text-primary" />
              <h2 className="font-display font-bold text-xl">Company Overview</h2>
            </div>
            <div className="card-premium p-8">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                Short boilerplate (60 words)
              </h3>
              <p className="text-foreground leading-relaxed mb-6">
                {SITE.name} is a custom software engineering agency headquartered in Dindigul, Tamil Nadu, India.
                We build scalable web platforms, native mobile applications, and SaaS products for startups and enterprises.
                Our team delivers fixed-scope projects with full client code ownership, direct engineer access, and ongoing post-launch support.
              </p>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                Long boilerplate (120 words)
              </h3>
              <p className="text-foreground leading-relaxed">
                {SITE.name} is a custom software engineering and product development agency based in Dindigul, Tamil Nadu, India.
                Founded to bridge the gap between technical execution quality and honest client communication, Sterova builds scalable web platforms,
                cross-platform mobile applications, SaaS products, and API-driven integrations for startups, scale-ups, and enterprises globally.
                The Sterova team operates on a transparent, fixed-scope engagement model — no black boxes, no surprise invoices.
                Every client retains full ownership of their codebase and infrastructure from day one. Sterova's engineering stack centres on React,
                TypeScript, Supabase, and cloud-native deployment, with support for custom technology requirements. Post-launch maintenance retainers
                ensure products continue to improve after delivery.
              </p>
            </div>
          </AnimatedSection>

          {/* Logo assets */}
          <AnimatedSection delay={0.1}>
            <div className="flex items-center gap-3 mb-6">
              <Palette className="h-5 w-5 text-primary" />
              <h2 className="font-display font-bold text-xl">Logo Assets</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                { bg: "bg-background", label: "Dark background", border: "border-border" },
                { bg: "bg-zinc-50 dark:bg-zinc-900", label: "Light background", border: "border-zinc-200 dark:border-zinc-700" },
              ].map((variant) => (
                <div
                  key={variant.label}
                  className={`flex flex-col items-center justify-center gap-6 rounded-2xl border ${variant.border} ${variant.bg} p-10`}
                >
                  <div className="flex items-center gap-2">
                    <BrandLogo size={36} alt="Sterova logo" />
                    <span className="gradient-text font-display font-black text-3xl tracking-tighter">
                      {SITE.name}
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-xs text-muted-foreground">{variant.label}</p>
                    <span className="text-xs font-medium text-primary border border-primary/30 rounded-full px-3 py-1 bg-primary/5">
                      Available on request
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-xl border border-border bg-card p-5 flex items-center justify-between gap-4 flex-wrap">
              <div>
                <p className="font-medium text-sm">Full logo package (SVG, PNG, WebP)</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Horizontal, stacked, icon-only — dark and light variants
                </p>
              </div>
              <a
                href={`mailto:${SITE.email}?subject=Press Kit: Logo Assets`}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <Download className="h-3.5 w-3.5" />
                Request assets
              </a>
            </div>
          </AnimatedSection>

          {/* Brand colors */}
          <AnimatedSection delay={0.15}>
            <div className="flex items-center gap-3 mb-6">
              <Palette className="h-5 w-5 text-primary" />
              <h2 className="font-display font-bold text-xl">Brand Colors</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {BRAND_COLORS.map((color) => (
                <div key={color.hex} className="card-premium overflow-hidden">
                  <div className="h-16 w-full" style={{ background: color.hex }} />
                  <div className="p-4">
                    <p className="font-semibold text-sm">{color.name}</p>
                    <p className="text-xs font-mono text-muted-foreground">{color.hex}</p>
                    <p className="text-xs text-muted-foreground mt-1">{color.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>

          {/* Typography */}
          <AnimatedSection delay={0.2}>
            <div className="flex items-center gap-3 mb-6">
              <Type className="h-5 w-5 text-primary" />
              <h2 className="font-display font-bold text-xl">Typography</h2>
            </div>
            <div className="flex flex-col gap-4">
              {FONTS.map((font) => (
                <div key={font.name} className="card-premium p-5 flex items-center gap-5">
                  <span className="text-3xl font-bold text-primary shrink-0 w-10 text-center">
                    Aa
                  </span>
                  <div>
                    <p className="font-semibold text-sm">{font.name}</p>
                    <p className="text-xs text-muted-foreground">{font.usage}</p>
                    <p className="text-xs font-mono text-muted-foreground mt-0.5">
                      Weight: {font.weight}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>

          {/* Media contact */}
          <AnimatedSection delay={0.25}>
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="h-5 w-5 text-primary" />
                  <h2 className="font-bold text-lg">Media Contact</h2>
                </div>
                <p className="text-sm text-muted-foreground mb-1">
                  For press inquiries, interview requests, and media appearances:
                </p>
                <a
                  href={`mailto:${SITE.email}?subject=Press Inquiry`}
                  className="text-primary font-medium hover:underline text-sm"
                >
                  {SITE.email}
                </a>
              </div>
              <a
                href={`mailto:${SITE.email}?subject=Press Inquiry`}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors whitespace-nowrap"
              >
                Get in touch
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </>
  );
}
