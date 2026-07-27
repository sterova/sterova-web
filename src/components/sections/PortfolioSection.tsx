import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowRight, ExternalLink } from "lucide-react";
import { FaGithub as Github } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import SectionHeader from "@/components/shared/SectionHeader";
import {
  CardGridSkeleton,
  EmptyState,
  ErrorState,
} from "@/components/shared/DataStates";
import { fetchActiveProjects } from "@/lib/api";

interface Props {
  featuredOnly?: boolean;
  showCta?: boolean;
}

export default function PortfolioSection({ featuredOnly = false, showCta = true }: Props) {
  // Shared cache key: the homepage and the portfolio page both read the same
  // active-projects list, so navigating between them doesn't refetch.
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["active-projects"],
    queryFn: fetchActiveProjects,
  });

  const items = data ?? [];
  const displayed = featuredOnly ? items.filter((i) => i.is_featured) : items;

  return (
    <section id="portfolio" className="py-24">
      <div className="container-custom">
        {/* The homepage passes featuredOnly, which previously rendered the grid
            with no heading at all. Both variants now get a header. */}
        {featuredOnly ? (
          <SectionHeader
            badge="Capabilities"
            title="The kind of systems we build"
            description="Illustrative examples of the platforms, integrations, and architectures we engineer — shown to convey scope and technical depth."
            centered
            className="mb-16"
          />
        ) : (
          <SectionHeader
            badge="Portfolio"
            title="The kind of systems we build"
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
              className="group flex flex-col rounded-2xl border bg-background overflow-hidden hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
            >
              {/* Image placeholder */}
              <div className="relative h-48 bg-gradient-to-br from-primary/10 via-purple-500/10 to-background overflow-hidden">
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-2xl bg-primary/15 border border-primary/20 flex items-center justify-center mx-auto mb-2">
                        <span className="text-2xl font-display font-bold text-primary/60">
                          {item.title.charAt(0)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                {item.is_featured && (
                  <div className="absolute top-3 left-3">
                    <span className="text-xs bg-primary text-primary-foreground px-2.5 py-1 rounded-full font-medium">
                      Example
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col flex-1">
                <p className="text-xs text-muted-foreground mb-2">{item.category}</p>
                <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                  {item.description}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-secondary px-2 py-0.5 rounded-full text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                {(item.live_url || item.github_url) && (
                  <div className="flex gap-3 mt-4 pt-4 border-t border-border/50">
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
