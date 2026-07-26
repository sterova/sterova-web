"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionHeader from "@/components/shared/SectionHeader";
import { cn } from "@/lib/utils";
import type { DbPortfolioItem } from "@/types";

interface Props {
  items: DbPortfolioItem[];
  featuredOnly?: boolean;
  showCta?: boolean;
}

export default function PortfolioSection({
  items,
  featuredOnly = false,
  showCta = true,
}: Props) {
  const displayed = featuredOnly ? items.filter((p) => p.is_featured) : items;

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
        <SectionHeader
          badge="Our Work"
          title="Products we've shipped"
          description="A selection of projects across industries. Every engagement is a long-term partnership, not a one-time transaction."
          centered
          className="mb-16"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayed.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.07 }}
              className={cn(
                "group relative flex flex-col rounded-2xl border bg-background overflow-hidden",
                "hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
              )}
            >
              {/* Image / placeholder */}
              <div className="relative h-48 bg-gradient-to-br from-sterova-50 to-purple-50 dark:from-sterova-950/50 dark:to-purple-950/50 overflow-hidden">
                {item.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl font-display font-bold text-sterova-200 dark:text-sterova-800 select-none">
                      {item.title.charAt(0)}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background/30 to-transparent" />
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-1">
                <span className="text-xs text-muted-foreground mb-2">
                  {item.category}
                </span>
                <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-4">
                  {item.description}
                </p>
                <div className="flex flex-wrap gap-1.5">
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
                  <div className="flex gap-3 mt-4">
                    {item.live_url && (
                      <a
                        href={item.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline"
                      >
                        Live →
                      </a>
                    )}
                    {item.github_url && (
                      <a
                        href={item.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-muted-foreground hover:text-foreground hover:underline"
                      >
                        GitHub →
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
