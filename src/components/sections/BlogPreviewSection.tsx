import { useQuery } from "@tanstack/react-query";
import { fetchPublishedPosts } from "@/lib/api";
import { Link } from "@/lib/router-compat";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import SectionHeader from "@/components/shared/SectionHeader";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function formatDate(iso: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function BlogPreviewSection() {
  const reduce = useReducedMotion();
  const { data: posts, isLoading } = useQuery({
    queryKey: ["published-posts-preview"],
    queryFn: fetchPublishedPosts,
    staleTime: 5 * 60 * 1000,
  });

  const latest = posts?.slice(0, 3) ?? [];
  if (!isLoading && latest.length === 0) return null;

  return (
    <section className="section-y bg-surface">
      <div className="container-custom">
        <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-end">
          <SectionHeader
            badge="From the blog"
            title="Ideas, notes, and build logs"
            description="Short reads on engineering decisions, product thinking, and lessons from shipping real software."
          />
          <Button asChild variant="outline" size="lg" className="group shrink-0">
            <Link href="/blog">
              View all articles
              <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="card-premium h-[20rem] animate-pulse p-0"
                  aria-hidden="true"
                />
              ))
            : latest.map((post, i) => {
                const category =
                  typeof post.blog_categories === "object" && post.blog_categories
                    ? (post.blog_categories as { name: string }).name
                    : "Article";
                return (
                  <motion.article
                    key={post.id}
                    initial={reduce ? false : { opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="group card-premium flex h-full flex-col overflow-hidden p-0"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                      {post.cover_image_url ? (
                        <img
                          src={post.cover_image_url}
                          alt={post.title}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                          <span className="font-display text-4xl font-semibold text-primary/30">
                            {category.slice(0, 1)}
                          </span>
                        </div>
                      )}
                      <span className="absolute left-4 top-4 rounded-full border border-border/80 bg-background/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary backdrop-blur-sm">
                        {category}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="font-display text-lg font-semibold leading-snug tracking-tight text-foreground transition-colors group-hover:text-primary">
                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                      </h3>
                      <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                        {post.excerpt ||
                          "Read the full article for details, decisions, and implementation notes."}
                      </p>
                      <div className="mt-5 flex items-center gap-4 border-t border-border pt-4 text-xs text-muted-foreground">
                        {post.published_at && (
                          <span className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                            {formatDate(post.published_at)}
                          </span>
                        )}
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                          {post.read_time_minutes || 5} min read
                        </span>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
        </div>
      </div>
    </section>
  );
}
