import { useCallback, useEffect, useState } from "react";
import { Link } from "@/lib/router-compat";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { marked } from "marked";
import { ArrowRight, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { FaGithub as Github } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import SectionHeader from "@/components/shared/SectionHeader";
import { CardGridSkeleton, EmptyState, ErrorState } from "@/components/shared/DataStates";
import { fetchActiveProjects } from "@/lib/api";

const markdownRenderer = new marked.Renderer();

// Project descriptions entered before the Markdown editor may contain Tiptap HTML.
// Preserve those existing records while new Markdown is parsed without allowing raw HTML.
markdownRenderer.html = () => "";

function isHtmlDescription(description: string) {
  return /<\/?[a-z][\s\S]*>/i.test(description);
}

function renderProjectDescription(description: string) {
  if (isHtmlDescription(description)) return description;

  return marked.parse(description, {
    breaks: true,
    gfm: true,
    renderer: markdownRenderer,
  });
}

function projectSummary(description: string) {
  return description
    .replace(/<[^>]*>/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[`*_~>#]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

interface Props {
  featuredOnly?: boolean;
  showCta?: boolean;
  showHeader?: boolean;
}

export default function PortfolioSection({
  featuredOnly = false,
  showCta = true,
  showHeader = true,
}: Props) {
  const { data, error, isPending, isError, refetch } = useQuery({
    queryKey: ["active-projects"],
    queryFn: fetchActiveProjects,
  });

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const items = data ?? [];
  const displayed = featuredOnly ? items.filter((i) => i.is_featured) : items;

  const navigateProject = useCallback(
    (direction: -1 | 1) => {
      setSelectedIndex((currentIndex) => {
        if (currentIndex === null) return null;
        return Math.min(Math.max(currentIndex + direction, 0), displayed.length - 1);
      });
    },
    [displayed.length],
  );

  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") navigateProject(-1);
      if (event.key === "ArrowRight") navigateProject(1);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigateProject, selectedIndex]);

  return (
    <section id="portfolio" className="section-y">
      <div className="container-custom">
        {!showHeader ? null : featuredOnly ? (
          <SectionHeader
            badge="Capabilities"
            title="Web platforms, mobile apps, and SaaS products we build"
            description="Illustrative examples of the platforms, integrations, and architectures we engineer — shown to convey scope and technical depth."
            centered
            className="mb-16"
          />
        ) : (
          <SectionHeader
            badge="Portfolio"
            title="Web platforms, mobile apps, and SaaS products we build"
            description="Illustrative examples across industries, shown to convey the scope and technical depth of our work rather than to name specific clients."
            centered
            className="mb-16"
          />
        )}

        {isPending ? (
          <CardGridSkeleton count={featuredOnly ? 3 : 6} />
        ) : isError ? (
          <ErrorState
            message="Our project examples couldn't be loaded. Please try again in a moment."
            error={error as Error}
            onRetry={() => refetch()}
          />
        ) : displayed.length === 0 ? (
          <EmptyState
            title="Portfolio coming soon"
            description="We're preparing examples of the systems we build. Check back shortly."
          />
        ) : (
          <div className="flex flex-wrap justify-center gap-6">
            {displayed.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: i * 0.07 }}
                className="card-premium sheen group relative flex w-full flex-col overflow-hidden p-0 text-left transition-all duration-500 hover:-translate-y-1 hover:border-primary/20 hover:shadow-xl sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-18px)]"
              >
                <button
                  type="button"
                  onClick={() => setSelectedIndex(i)}
                  className="absolute inset-0 z-10 cursor-pointer rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  aria-label={`Preview ${item.title}`}
                >
                  <span className="sr-only">Preview {item.title}</span>
                </button>

                {/* Image */}
                <div className="relative h-56 shrink-0 overflow-hidden border-b border-border bg-surface">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                  ) : (
                    <div className="dot-grid absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl border border-primary/20 bg-background/70 backdrop-blur-sm transition-all duration-300 group-hover:scale-105 group-hover:border-primary/40">
                          <span className="font-display text-2xl font-bold text-primary">
                            {item.title.charAt(0)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                  {item.is_featured && !item.is_own_project && (
                    <span className="absolute left-4 top-4 rounded-full border border-border bg-background px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] font-semibold text-muted-foreground shadow-sm">
                      Example
                    </span>
                  )}
                  {item.is_own_project && (
                    <span className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] font-semibold text-primary-foreground shadow-md">
                      Own Project
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="flex min-h-72 flex-1 flex-col p-6">
                  <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    {item.category}
                  </p>
                  <h3 className="font-display text-lg font-semibold tracking-tight transition-colors group-hover:text-primary">
                    {item.title}
                  </h3>

                  <div className="mt-3 flex flex-wrap gap-1.5 overflow-hidden max-h-12">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-border bg-surface px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide text-muted-foreground relative z-10"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground line-clamp-3">
                    {projectSummary(item.description)}
                  </p>
                  <div className="mt-auto flex items-center justify-between gap-3 border-t border-border/50 pt-4">
                    <span className="pointer-events-none inline-flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-primary transition-transform duration-300 group-hover:translate-x-0.5">
                      Details <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                    {(item.live_url || item.github_url) && (
                      <div className="flex shrink-0 gap-2">
                        {item.live_url && (
                          <a
                            href={item.live_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group/btn relative z-20 inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-[11px] font-bold text-primary-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-md active:scale-95"
                          >
                            <ExternalLink className="h-3 w-3 transition-transform group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
                            Live Demo
                          </a>
                        )}
                        {item.github_url && (
                          <a
                            href={item.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group/btn relative z-20 inline-flex items-center gap-1.5 rounded-lg border border-border/50 bg-secondary/50 px-3 py-1.5 text-[11px] font-bold text-secondary-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:border-border hover:bg-secondary hover:shadow-md active:scale-95"
                          >
                            <Github className="h-3 w-3 transition-transform group-hover/btn:scale-110" />
                            Source
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {showCta && featuredOnly && displayed.length > 0 && (
          <div className="text-center mt-12">
            <Button asChild variant="outline" size="lg" className="group">
              <Link href="/portfolio">
                View all examples
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        )}
      </div>

      {/* Project Preview Modal */}
      <Dialog
        open={selectedIndex !== null}
        onOpenChange={(open) => !open && setSelectedIndex(null)}
      >
        <DialogContent className="flex w-[calc(100%-1.5rem)] max-w-6xl items-center justify-center overflow-visible border-none bg-transparent p-0 shadow-none pointer-events-none md:w-[calc(100%-8rem)]">
          <DialogTitle className="sr-only">
            {selectedIndex === null
              ? "Project details"
              : `Project preview: ${displayed[selectedIndex]?.title}`}
          </DialogTitle>

          {/* Left Arrow (Fixed outside the box) */}
          {selectedIndex !== null && (
            <Button
              variant="secondary"
              size="icon"
              className="absolute -left-4 md:-left-20 top-1/2 -translate-y-1/2 rounded-full h-14 w-14 shadow-2xl pointer-events-auto bg-background/90 text-foreground border border-border/50 disabled:opacity-30 transition-all hover:scale-110 z-50 hidden md:flex"
              disabled={selectedIndex === 0}
              onClick={() => navigateProject(-1)}
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>
          )}

          {/* Right Arrow (Fixed outside the box) */}
          {selectedIndex !== null && (
            <Button
              variant="secondary"
              size="icon"
              className="absolute -right-4 md:-right-20 top-1/2 -translate-y-1/2 rounded-full h-14 w-14 shadow-2xl pointer-events-auto bg-background/90 text-foreground border border-border/50 disabled:opacity-30 transition-all hover:scale-110 z-50 hidden md:flex"
              disabled={selectedIndex === displayed.length - 1}
              onClick={() => navigateProject(1)}
            >
              <ChevronRight className="h-8 w-8" />
            </Button>
          )}

          {selectedIndex !== null && displayed[selectedIndex] && (
            <div className="relative flex h-[92dvh] w-full flex-col overflow-y-auto scroll-smooth rounded-3xl border border-border/60 bg-background shadow-2xl pointer-events-auto md:h-[85vh] md:max-h-[900px]">
              {/* Unfiltered project image */}
              <div className="relative flex h-64 w-full shrink-0 flex-col overflow-hidden border-b border-border bg-surface sm:h-72 md:h-96">
                {displayed[selectedIndex].image_url ? (
                  <img
                    src={displayed[selectedIndex].image_url!}
                    alt={displayed[selectedIndex].title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="font-display text-7xl font-bold text-primary/30">
                      {displayed[selectedIndex].title.charAt(0)}
                    </div>
                  </div>
                )}

                <DialogClose className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-foreground/70 text-background shadow-lg backdrop-blur-md transition-colors hover:bg-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background">
                  <span className="sr-only">Close project preview</span>
                  <span aria-hidden="true" className="text-xl leading-none">
                    ×
                  </span>
                </DialogClose>

                {/* Mobile Navigation Arrows (shown only on small screens) */}
                <div className="md:hidden absolute inset-0 flex items-center justify-between p-4 opacity-100 transition-opacity duration-300 pointer-events-none">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="pointer-events-auto rounded-full h-12 w-12 shadow-xl bg-background/80 hover:bg-background text-foreground backdrop-blur-md border border-border/50 disabled:opacity-30 transition-transform hover:scale-105"
                    disabled={selectedIndex === 0}
                    onClick={() => navigateProject(-1)}
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="pointer-events-auto rounded-full h-12 w-12 shadow-xl bg-background/80 hover:bg-background text-foreground backdrop-blur-md border border-border/50 disabled:opacity-30 transition-transform hover:scale-105"
                    disabled={selectedIndex === displayed.length - 1}
                    onClick={() => navigateProject(1)}
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                </div>
              </div>

              {/* Project details */}
              <div className="mx-auto w-full max-w-5xl px-6 py-8 md:px-12 md:py-10">
                <header className="border-b border-border/60 pb-8">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="inline-block rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
                      {displayed[selectedIndex].category}
                    </div>
                    <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                      Project {selectedIndex + 1} of {displayed.length}
                    </span>
                  </div>

                  <h2 className="max-w-4xl font-display text-4xl font-bold tracking-tight text-foreground md:text-6xl">
                    {displayed[selectedIndex].title}
                  </h2>

                  {displayed[selectedIndex].tags.length > 0 && (
                    <div className="mt-8">
                      <p className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        Technology stack
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {displayed[selectedIndex].tags.map((tag: string) => (
                          <span
                            key={tag}
                            className="rounded-md border border-border bg-surface px-3 py-1.5 font-mono text-[11px] font-medium uppercase tracking-wider text-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </header>

                {/* Rich Text Output */}
                <div
                  className="pt-8 text-lg leading-relaxed text-muted-foreground space-y-6 [&>p]:mb-6 [&>ul]:list-disc [&>ul]:ml-6 [&>ul>li]:mb-2 [&>ol]:list-decimal [&>ol]:ml-6 [&>h3]:text-2xl [&>h3]:font-bold [&>h3]:text-foreground [&>h3]:mt-10 [&>h3]:mb-4 [&>h4]:text-xl [&>h4]:font-semibold [&>h4]:text-foreground [&>h4]:mt-8 [&>h4]:mb-3 [&>strong]:text-foreground [&>strong]:font-semibold [&>em]:text-foreground/90"
                  dangerouslySetInnerHTML={{
                    __html: renderProjectDescription(displayed[selectedIndex].description),
                  }}
                />
              </div>

              {/* Persistent action bar */}
              {(displayed[selectedIndex].live_url || displayed[selectedIndex].github_url) && (
                <div className="sticky bottom-0 z-20 border-t border-border/60 bg-background/90 p-3 backdrop-blur-2xl">
                  <div className="mx-auto flex w-full max-w-4xl gap-3">
                    {displayed[selectedIndex].live_url && (
                      <a
                        href={displayed[selectedIndex].live_url!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex justify-center items-center gap-2 rounded-xl bg-primary px-4 py-3.5 text-sm font-bold text-primary-foreground shadow-lg hover:bg-primary/90 hover:-translate-y-0.5 transition-all active:scale-95"
                      >
                        <ExternalLink className="h-4 w-4" />
                        View Live Site
                      </a>
                    )}
                    {displayed[selectedIndex].github_url && (
                      <a
                        href={displayed[selectedIndex].github_url!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex justify-center items-center gap-2 rounded-xl bg-secondary border border-border/50 px-4 py-3.5 text-sm font-bold text-secondary-foreground shadow-md hover:bg-secondary/80 hover:-translate-y-0.5 transition-all active:scale-95"
                      >
                        <Github className="h-4 w-4" />
                        View Source
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
