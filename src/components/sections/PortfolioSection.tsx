import { Link } from "@/lib/router-compat";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowRight, ExternalLink } from "lucide-react";
import { FaGithub as Github } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import SectionHeader from "@/components/shared/SectionHeader";
import { CardGridSkeleton, EmptyState, ErrorState } from "@/components/shared/DataStates";
import { fetchActiveProjects } from "@/lib/api";

interface Props {
  featuredOnly?: boolean;
  showCta?: boolean;
  /** The portfolio page renders its own page-level hero header. */
  showHeader?: boolean;
}

export default function PortfolioSection({
  featuredOnly = false,
  showCta = true,
  showHeader = true,
}: Props) {
  // Shared cache key: the homepage and the portfolio page both read the same
  // active-projects list, so navigating between them doesn't refetch.
  const { data, error, isPending, isError, refetch } = useQuery({
    queryKey: ["active-projects"],
    queryFn: fetchActiveProjects,
  });

  const items = data ?? [];
  const displayed = featuredOnly ? items.filter((i) => i.is_featured) : items;

  return (
    <section id="portfolio" className="section-y">
      <div className="container-custom">
        {/* The homepage passes featuredOnly, which previously rendered the grid
            with no heading at all. Both variants now get a header. */}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayed.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: i * 0.07 }}
                className="card-premium sheen group flex flex-col overflow-hidden p-0 transition-shadow duration-500 hover:shadow-[var(--shadow-card-hover)]"
              >
                {/* Image placeholder */}
                <div className="relative h-52 overflow-hidden border-b border-border bg-linear-to-br from-primary/12 via-surface-2 to-background">
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-80"
                    aria-hidden="true"
                  />
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
                  {item.is_featured && (
                    <span className="absolute left-4 top-4 rounded-full border border-border bg-background/85 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground backdrop-blur-sm">
                      Example
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-6">
                  <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    {item.category}
                  </p>
                  <h3 className="font-display text-lg font-semibold tracking-tight transition-colors group-hover:text-primary">
                    {item.title}
                  </h3>
                  <p className="mt-2.5 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-border bg-surface px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  {(item.live_url || item.github_url) && (
                    <div className="mt-5 flex gap-4 border-t border-border pt-4">
                      {item.live_url && (
                        <a
                          href={item.live_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Live
                        </a>
                      )}
                      {item.github_url && (
                        <a
                          href={item.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground hover:underline"
                        >
                          <Github className="h-3 w-3" />
                          GitHub
                        </a>
                      )}
                    </div>
                  )}
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
    </section>
  );
}
