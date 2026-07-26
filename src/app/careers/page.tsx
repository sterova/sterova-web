import type { Metadata } from "next";
import AnimatedSection from "@/components/shared/AnimatedSection";
import SectionHeader from "@/components/shared/SectionHeader";
import CTASection from "@/components/sections/CTASection";
import { OPEN_POSITIONS, SITE } from "@/data/constants";
import { Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Careers",
  description: `Join the ${SITE.name} team. We're a remote-first engineering company building world-class digital products.`,
  alternates: { canonical: "/careers" },
};

export default function CareersPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-secondary/30">
        <div className="container-custom text-center">
          <AnimatedSection>
            <SectionHeader
              badge="Careers"
              title="Build the future with us"
              description="We're a remote-first team of engineers, designers, and product thinkers. If you care about quality, you'll fit right in."
              centered
            />
          </AnimatedSection>
        </div>
      </section>

      {/* Why Sterova */}
      <section className="py-24">
        <div className="container-custom">
          <SectionHeader
            badge="Why Sterova"
            title="What makes us different"
            centered
            className="mb-12"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Remote-first",
                description:
                  "Work from wherever you do your best work. We're async-friendly and outcome-focused.",
              },
              {
                title: "High-quality work",
                description:
                  "We only take on projects we can do well. No sloppy work, no impossible deadlines.",
              },
              {
                title: "Continuous learning",
                description:
                  "Learning budget, conference access, and a culture that rewards curiosity.",
              },
              {
                title: "Ownership",
                description:
                  "Engineers own their domains. We trust people to make good decisions.",
              },
              {
                title: "Impact",
                description:
                  "Your work ships to real users in real companies. You can see the difference you make.",
              },
              {
                title: "Transparent culture",
                description:
                  "Open communication, honest feedback, and no political games.",
              },
            ].map((item, i) => (
              <AnimatedSection key={item.title} delay={i * 0.06}>
                <div className="rounded-2xl border bg-background p-6 h-full">
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Open positions */}
      <section className="py-24 bg-secondary/30">
        <div className="container-custom">
          <SectionHeader
            badge="Open Roles"
            title="Current openings"
            centered
            className="mb-12"
          />
          {OPEN_POSITIONS.length === 0 ? (
            <AnimatedSection className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                No open positions right now, but we&apos;re always interested in
                exceptional people.
              </p>
              <a
                href={`mailto:${SITE.email}?subject=Spontaneous Application — Sterova`}
                className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
              >
                <Mail className="h-4 w-4" />
                Send us a spontaneous application
              </a>
            </AnimatedSection>
          ) : (
            <div className="space-y-4">
              {OPEN_POSITIONS.map((position: Record<string, string>) => (
                <div
                  key={position.id}
                  className="rounded-2xl border bg-background p-6"
                >
                  <p>{position.title}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <CTASection
        title="Don't see your role?"
        description="We hire for talent, not just for open slots. Send us your work and tell us how you'd contribute."
      />
    </>
  );
}
