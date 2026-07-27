import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, ExternalLink } from "lucide-react";
import { FaGithub as Github } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import SectionHeader from "@/components/shared/SectionHeader";
import { cn } from "@/lib/utils";
import type { PortfolioItem } from "@/types";

interface Props {
  items: PortfolioItem[];
  featuredOnly?: boolean;
  showCta?: boolean;
}

export default function PortfolioSection({ items, featuredOnly = false, showCta = true }: Props) {
  const displayed = featuredOnly ? items.filter((i) => i.is_featured) : items;

  if (displayed.length === 0) {
    return (
      <section id="portfolio" className="py-24">
        <div className="container-custom text-center">
          <p className="text-muted-foreground">Portfolio coming soon.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="portfolio" className="py-24">
      <div className="container-custom">
        {!featuredOnly && (
          <SectionHeader
            badge="Portfolio"
            title="Products we've built"
            description="A selection of client projects across industries. Every project is a partnership — we stay engaged from concept to post-launch."
            centered
            className="mb-16"
          />
        )}

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
                      Featured
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

        {showCta && featuredOnly && (
          <div className="text-center mt-12">
            <Button asChild variant="outline" size="lg" className="group">
              <Link href="/portfolio">
                View all case studies
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
