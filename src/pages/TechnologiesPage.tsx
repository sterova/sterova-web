import SectionHeader from "@/components/shared/SectionHeader";
import CTASection from "@/components/sections/CTASection";
import TechStackSection from "@/components/sections/TechStackSection";
import AnimatedSection from "@/components/shared/AnimatedSection";
import { Server, MonitorPlay, Database, Cloud } from "lucide-react";

export default function TechnologiesPage() {
  const stacks = [
    {
      title: "Frontend Development",
      icon: <MonitorPlay className="h-6 w-6" />,
      description: "Modern, reactive, and accessible user interfaces built for scale.",
      items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
    },
    {
      title: "Backend & API",
      icon: <Server className="h-6 w-6" />,
      description: "High-performance, secure, and resilient backend systems.",
      items: ["Node.js", "Go", "Python", "GraphQL", "REST APIs"],
    },
    {
      title: "Database & Storage",
      icon: <Database className="h-6 w-6" />,
      description: "Scalable data architecture for complex querying and high availability.",
      items: ["PostgreSQL", "MongoDB", "Redis", "Supabase", "Elasticsearch"],
    },
    {
      title: "Cloud & DevOps",
      icon: <Cloud className="h-6 w-6" />,
      description: "Automated pipelines and reliable cloud infrastructure.",
      items: ["AWS", "Google Cloud", "Docker", "Kubernetes", "GitHub Actions"],
    },
  ];

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
        <div className="container-custom relative text-center">
          <AnimatedSection>
            <SectionHeader
              badge="Technologies"
              title="Built on modern, proven stacks"
              description="We choose the right tools for the job, favoring reliability, performance, and developer experience."
              centered
              size="page"
            />
          </AnimatedSection>
        </div>
      </section>

      <section className="section-y bg-background">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {stacks.map((stack, idx) => (
              <AnimatedSection key={stack.title} delay={idx * 0.1}>
                <div className="card-premium h-full p-8 md:p-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      {stack.icon}
                    </div>
                    <h3 className="text-2xl font-bold font-display">{stack.title}</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed mb-8">{stack.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {stack.items.map((item) => (
                      <span
                        key={item}
                        className="inline-flex items-center rounded-md bg-muted px-3 py-1 text-sm font-medium text-foreground"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <TechStackSection />
      <CTASection />
    </>
  );
}
