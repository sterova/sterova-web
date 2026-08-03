import { useLoaderData } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@/lib/router-compat";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Layers3,
  MessageSquare,
  Sparkles,
  UsersRound,
  WalletCards,
} from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";
import CTASection from "@/components/sections/CTASection";
import AnimatedSection from "@/components/shared/AnimatedSection";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { fetchActiveProjects } from "@/lib/api";
import { getServicePage, type ServicePageContent } from "@/data/service-pages";

const fallbackContent = (title: string, overview: string): ServicePageContent => ({
  slug: "",
  title,
  eyebrow: "Sterova service",
  seoTitle: title,
  seoDescription: overview,
  overview,
  audience: ["Growing businesses that need a clear, dependable digital solution."],
  benefits: [],
  technologies: [],
  process: [],
  pricing:
    "Every engagement is scoped around the work required. We provide clear deliverables and milestones before development starts.",
  faqs: [],
  relatedSlugs: [],
  projectTerms: [],
});

export default function ServiceDetailsPage() {
  const service = useLoaderData({ from: "/services_/$slug" });
  const page = service
    ? (getServicePage(service.slug) ?? fallbackContent(service.title, service.overview))
    : null;
  const { data: projects = [] } = useQuery({
    queryKey: ["projects", "service-related"],
    queryFn: fetchActiveProjects,
    enabled: Boolean(page?.projectTerms.length),
    staleTime: 1000 * 60 * 5,
  });

  if (!service || !page) return null;

  const relatedServices = page.relatedSlugs
    .map((slug) => getServicePage(slug))
    .filter((related): related is ServicePageContent => Boolean(related));
  const relatedProjects = projects
    .filter((project) => {
      const searchable = [
        project.title,
        project.category,
        project.description,
        project.tags.join(" "),
      ]
        .join(" ")
        .toLowerCase();
      return page.projectTerms.some((term) => searchable.includes(term));
    })
    .slice(0, 3);

  return (
    <>
      <section className="relative overflow-hidden border-b border-border bg-surface pb-24 pt-36">
        <div
          className="pointer-events-none absolute inset-0 dot-grid opacity-40"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -top-1/3 left-1/2 aspect-square w-[60rem] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl"
          aria-hidden="true"
        />
        <div className="container-custom relative mx-auto max-w-4xl text-center">
          <AnimatedSection>
            <span className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              {page.eyebrow}
            </span>
            <h1 className="mb-6 font-display text-4xl font-black leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              {page.title}
            </h1>
            <p className="mx-auto mb-10 max-w-3xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
              {page.overview}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button asChild variant="gradient" size="lg" className="group rounded-full px-8">
                <Link href={`/start-project?service=${service.slug}`}>
                  Discuss your project
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full px-8">
                <Link href="/portfolio">See our work</Link>
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="section-y bg-background">
        <div className="container-custom mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <AnimatedSection>
            <SectionHeader
              badge="Overview"
              title="Built around the work that matters"
              description={page.overview}
              className="mb-0"
            />
          </AnimatedSection>
          <AnimatedSection
            delay={0.08}
            className="card-premium border border-border/70 bg-surface p-7 sm:p-8"
          >
            <span className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <UsersRound className="h-5 w-5" />
            </span>
            <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">
              Who this is for
            </h2>
            <ul className="mt-5 space-y-3.5">
              {page.audience.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </AnimatedSection>
        </div>
      </section>

      <section className="section-y bg-surface">
        <div className="container-custom mx-auto max-w-6xl">
          <AnimatedSection>
            <SectionHeader
              badge="Benefits"
              title="A more useful way to move your business forward"
              description="The details differ by project, but every engagement is designed to make the next stage of growth simpler and more reliable."
              centered
              className="mb-14"
            />
          </AnimatedSection>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {page.benefits.map((benefit, index) => (
              <AnimatedSection key={benefit} delay={index * 0.05}>
                <article className="group h-full rounded-2xl border border-border bg-background p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[var(--shadow-card-hover)]">
                  <span className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <CheckCircle2 className="h-5 w-5" />
                  </span>
                  <p className="font-medium leading-relaxed text-foreground">{benefit}</p>
                </article>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y bg-background">
        <div className="container-custom mx-auto max-w-6xl">
          <AnimatedSection>
            <SectionHeader
              badge="Technology"
              title="A practical, modern toolkit"
              description="We choose technology to fit the job, then keep the stack understandable and maintainable for the long term."
              centered
              className="mb-12"
            />
          </AnimatedSection>
          <AnimatedSection delay={0.08}>
            <div className="flex flex-wrap justify-center gap-3">
              {page.technologies.map((technology) => (
                <span
                  key={technology}
                  className="rounded-full border border-border bg-surface px-4 py-2 font-mono text-xs font-medium tracking-wide text-foreground"
                >
                  {technology}
                </span>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="section-y bg-surface">
        <div className="container-custom mx-auto max-w-5xl">
          <AnimatedSection>
            <SectionHeader
              badge="Process"
              title="A clear path from first conversation to useful release"
              description="You stay close to the decisions that matter, with working progress rather than vague status updates."
              centered
              className="mb-14"
            />
          </AnimatedSection>
          <ol className="relative space-y-5 before:absolute before:bottom-6 before:left-6 before:top-6 before:w-px before:bg-primary/20 md:before:left-7">
            {page.process.map((step, index) => (
              <li key={step.title}>
                <AnimatedSection delay={index * 0.07}>
                  <div className="relative flex gap-5 sm:gap-6">
                    <span className="z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-background font-mono text-sm font-bold text-primary sm:h-14 sm:w-14">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="card-premium flex-1 border border-border/70 bg-background p-5 sm:p-6">
                      <h3 className="font-display text-lg font-bold text-foreground">
                        {step.title}
                      </h3>
                      <p className="mt-2 leading-relaxed text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </AnimatedSection>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section-y bg-background">
        <div className="container-custom mx-auto max-w-6xl">
          <AnimatedSection className="overflow-hidden rounded-3xl border border-border bg-surface p-7 sm:p-10 lg:grid lg:grid-cols-[auto_1fr] lg:gap-8">
            <span className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground lg:mb-0">
              <WalletCards className="h-6 w-6" />
            </span>
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Pricing approach
              </span>
              <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Clear scope before commitment
              </h2>
              <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">{page.pricing}</p>
              <Button asChild variant="link" className="mt-5 h-auto px-0 text-primary">
                <Link href={`/start-project?service=${service.slug}`}>
                  Ask for a tailored proposal <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {page.faqs.length > 0 && (
        <section className="section-y bg-surface">
          <div className="container-custom mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
            <AnimatedSection>
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                <MessageSquare className="h-4 w-4" /> Frequently asked questions
              </span>
              <h2 className="mt-4 font-display text-3xl font-black tracking-tight text-foreground sm:text-4xl">
                The useful questions, answered.
              </h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                If you have a different question, we are happy to talk through it before you commit
                to anything.
              </p>
            </AnimatedSection>
            <AnimatedSection delay={0.08}>
              <Accordion
                type="single"
                collapsible
                className="rounded-2xl border border-border bg-background px-6"
              >
                {page.faqs.map((faq, index) => (
                  <AccordionItem key={faq.question} value={`faq-${index}`}>
                    <AccordionTrigger className="gap-5 py-5 text-base font-semibold no-underline hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="pr-8 text-sm leading-relaxed text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </AnimatedSection>
          </div>
        </section>
      )}

      {relatedServices.length > 0 && (
        <section className="section-y bg-background">
          <div className="container-custom mx-auto max-w-6xl">
            <AnimatedSection>
              <SectionHeader
                badge="Related services"
                title="Build the right team around the work"
                description="Many projects benefit from a focused combination of strategy, design, engineering, and ongoing care."
                centered
                className="mb-12"
              />
            </AnimatedSection>
            <div className="grid gap-5 md:grid-cols-3">
              {relatedServices.map((related, index) => (
                <AnimatedSection key={related.slug} delay={index * 0.06}>
                  <Link
                    href={`/services/${related.slug}`}
                    className="group flex h-full flex-col rounded-2xl border border-border bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[var(--shadow-card-hover)]"
                  >
                    <span className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Layers3 className="h-5 w-5" />
                    </span>
                    <h3 className="font-display text-xl font-bold text-foreground group-hover:text-primary">
                      {related.title}
                    </h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {related.overview}
                    </p>
                    <span className="mt-6 inline-flex items-center text-sm font-semibold text-primary">
                      Explore service{" "}
                      <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      )}

      {relatedProjects.length > 0 && (
        <section className="section-y bg-surface">
          <div className="container-custom mx-auto max-w-6xl">
            <AnimatedSection>
              <SectionHeader
                badge="Related projects"
                title="Relevant work from our portfolio"
                description="A small selection of work that shares similar goals, technology, or business context."
                centered
                className="mb-12"
              />
            </AnimatedSection>
            <div className="grid gap-5 md:grid-cols-3">
              {relatedProjects.map((project, index) => (
                <AnimatedSection key={project.id} delay={index * 0.06}>
                  <article className="flex h-full flex-col rounded-2xl border border-border bg-background p-6">
                    <span className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                      {project.category}
                    </span>
                    <h3 className="mt-3 font-display text-xl font-bold text-foreground">
                      {project.title}
                    </h3>
                    <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {project.description}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-1.5">
                      {project.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-surface px-2.5 py-1 text-[11px] text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    {project.live_url ? (
                      <a
                        href={project.live_url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-6 inline-flex items-center text-sm font-semibold text-primary"
                      >
                        View project <ArrowUpRight className="ml-1.5 h-4 w-4" />
                      </a>
                    ) : (
                      <Link
                        href="/portfolio"
                        className="mt-6 inline-flex items-center text-sm font-semibold text-primary"
                      >
                        View portfolio <ArrowRight className="ml-1.5 h-4 w-4" />
                      </Link>
                    )}
                  </article>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      )}

      <CTASection
        title={`Ready to make ${page.eyebrow.toLowerCase()} work harder?`}
        description="Tell us what you are trying to improve. We will help you identify a practical first step."
      />
    </>
  );
}
