import { Mail } from "lucide-react";
import AnimatedSection from "@/components/shared/AnimatedSection";
import SectionHeader from "@/components/shared/SectionHeader";
import CTASection from "@/components/sections/CTASection";
import { OPEN_POSITIONS, SITE } from "@/data/constants";
import SEO from "@/components/shared/SEO";
import JsonLd from "@/components/shared/JsonLd";

const WHY = [
  { title: "Remote-first", description: "Work from wherever you do your best work. We're async-friendly and outcome-focused." },
  { title: "High-quality work", description: "We only take on projects we can do well. No sloppy work, no impossible deadlines." },
  { title: "Continuous learning", description: "Learning budget, conference access, and a culture that rewards curiosity." },
  { title: "Ownership", description: "Engineers own their domains. We trust people to make good decisions." },
  { title: "Impact", description: "Your work ships to real users in real companies. You can see the difference you make." },
  { title: "Transparent culture", description: "No political games. Just good people building good software." },
];

export default function CareersPage() {
  return (
    <>
      <SEO
        title="Software engineering jobs"
        description="We're a remote-first team of engineers and product thinkers building high-quality custom software. Join us."
        canonical="/careers"
      />
      <JsonLd 
        type={['website', 'breadcrumb']} 
        breadcrumbs={[
          { name: 'Home', item: '/' },
          { name: 'Careers', item: '/careers' }
        ]}
      />
      <section className="pt-32 pb-16 bg-secondary/30">
        <div className="container-custom text-center">
          <AnimatedSection>
            <SectionHeader
              badge="Careers"
              title="Do the best work of your career"
              description="We're a remote-first team of engineers, designers, and product thinkers. If you care about quality, you'll fit right in."
              centered
              size="page"
            />
          </AnimatedSection>
        </div>
      </section>

      {/* Why */}
      <section className="py-24">
        <div className="container-custom">
          <SectionHeader badge="Why Sterova" title="What makes us different" centered className="mb-12" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {WHY.map((item, i) => (
              <AnimatedSection key={item.title} delay={i * 0.07}>
                <div className="rounded-2xl border bg-background p-6 h-full hover:border-primary/30 transition-all">
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
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
            description="We hire for attitude and aptitude — then teach domain knowledge."
            centered
            className="mb-12"
          />

          {OPEN_POSITIONS.length === 0 ? (
            <AnimatedSection className="text-center py-16 rounded-2xl border bg-background">
              <p className="text-muted-foreground text-lg mb-2">No open roles right now</p>
              <p className="text-sm text-muted-foreground mb-6">
                We&apos;re always interested in exceptional people. Send your CV to{" "}
                <a href={`mailto:${SITE.email}`} className="text-primary hover:underline">
                  {SITE.email}
                </a>{" "}
                with the subject line{" "}
                <span className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded">General Application</span>.
              </p>
            </AnimatedSection>
          ) : (
            <div className="space-y-4">
              {OPEN_POSITIONS.map((pos) => (
                <div
                  key={pos.id}
                  className="rounded-2xl border bg-background p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-primary/30 transition-all"
                >
                  <div>
                    <h3 className="font-semibold">{pos.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {pos.department} · {pos.location} · {pos.type}
                    </p>
                  </div>
                  <a
                    href={`mailto:${SITE.email}?subject=Application: ${pos.title}`}
                    className="inline-flex items-center gap-2 text-sm text-primary font-medium hover:underline shrink-0"
                  >
                    <Mail className="h-4 w-4" />
                    Apply
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <CTASection
        title="Don't see your role?"
        description="We hire great people before we know exactly where they fit. Reach out."
      />
    </>
  );
}
