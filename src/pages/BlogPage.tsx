import { useState } from "react";
import { Link } from "@/lib/router-compat";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Clock, ArrowRight, BookOpen } from "lucide-react";
import AnimatedSection from "@/components/shared/AnimatedSection";
import SectionHeader from "@/components/shared/SectionHeader";
import CTASection from "@/components/sections/CTASection";
import { CardGridSkeleton, EmptyState, ErrorState } from "@/components/shared/DataStates";
import { fetchCategories, fetchPublishedPosts } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

const ALL = "All";

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState(ALL);

  const postsQuery = useQuery({
    queryKey: ["published-posts"],
    queryFn: fetchPublishedPosts,
  });

  const categoriesQuery = useQuery({
    queryKey: ["blog-categories"],
    queryFn: fetchCategories,
  });

  const posts = postsQuery.data ?? [];

  // Only offer filters that actually have published posts behind them, so a
  // visitor can never land on a guaranteed-empty category.
  const usedCategoryNames = new Set(
    posts.map((p) => p.blog_categories?.name).filter(Boolean) as string[],
  );
  const categories = [
    ALL,
    ...(categoriesQuery.data ?? [])
      .map((c) => c.name)
      .filter((name) => usedCategoryNames.has(name)),
  ];

  const filtered =
    activeCategory === ALL
      ? posts
      : posts.filter((p) => p.blog_categories?.name === activeCategory);

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
              badge="Insights"
              title="Engineering knowledge, openly shared"
              description="Deep dives, product thinking, and practical guides from our engineering team."
              centered
              size="page"
            />
          </AnimatedSection>
        </div>
      </section>

      <section className="section-y">
        <div className="container-custom">
          {postsQuery.isPending ? (
            <CardGridSkeleton count={6} />
          ) : postsQuery.isError ? (
            <ErrorState
              message="The blog couldn't be loaded. Please try again in a moment."
              error={postsQuery.error as Error}
              onRetry={() => postsQuery.refetch()}
            />
          ) : posts.length === 0 ? (
            <EmptyState
              title="No posts published yet"
              description="We're working on our first articles. Check back soon."
            />
          ) : (
            <>
              {/* Category filter */}
              {categories.length > 1 && (
                <div className="flex flex-wrap gap-2 mb-12 justify-center">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      aria-pressed={activeCategory === cat}
                      className={cn(
                        "px-4 py-1.5 rounded-full text-sm font-medium transition-colors border",
                        activeCategory === cat
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-primary",
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}

              {filtered.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground">
                  No posts in this category yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filtered.map((post, i) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.07 }}
                      className="group card-premium flex flex-col overflow-hidden p-0"
                    >
                      {/* Cover */}
                      {post.cover_image_url ? (
                        <img
                          src={post.cover_image_url}
                          alt={post.title}
                          loading="lazy"
                          className="h-44 w-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="h-44 bg-linear-to-br from-primary/15 via-surface-2 to-background flex items-center justify-center">
                          <BookOpen className="h-10 w-10 text-primary/30" aria-hidden="true" />
                        </div>
                      )}

                      <div className="p-5 flex flex-col flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          {post.blog_categories?.name && (
                            <span className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium">
                              {post.blog_categories.name}
                            </span>
                          )}
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" aria-hidden="true" />
                            {post.read_time_minutes} min
                          </span>
                        </div>
                        <h2 className="font-semibold mb-2 leading-snug group-hover:text-primary transition-colors flex-1">
                          {post.title}
                        </h2>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
                          <span className="text-xs text-muted-foreground">
                            {post.published_at ? formatDate(post.published_at) : ""}
                          </span>
                          <Link
                            href={`/blog/${post.slug}`}
                            className="inline-flex items-center gap-1 text-xs text-primary font-medium hover:gap-2 transition-all"
                          >
                            Read more
                            <ArrowRight className="h-3 w-3" aria-hidden="true" />
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <CTASection
        title="Have an engineering challenge?"
        description="We'd love to hear about it. Let's talk."
      />
    </>
  );
}
