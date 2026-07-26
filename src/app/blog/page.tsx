import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import AnimatedSection from "@/components/shared/AnimatedSection";
import SectionHeader from "@/components/shared/SectionHeader";
import CTASection from "@/components/sections/CTASection";
import { SITE } from "@/data/constants";
import { formatDate } from "@/lib/utils";
import type { BlogPost } from "@/types";
import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog",
  description: `Engineering insights, product thinking, and technology deep dives from the ${SITE.name} team.`,
  alternates: { canonical: "/blog" },
};

async function getPosts(): Promise<BlogPost[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("blog_posts")
      .select(
        "id, title, slug, excerpt, cover_image_url, category, tags, author_name, published_at, read_time_minutes, views"
      )
      .eq("published", true)
      .order("published_at", { ascending: false })
      .limit(20);

    if (error) {
      console.error("[Blog] Supabase error:", error.message);
      return [];
    }
    return (data as BlogPost[]) ?? [];
  } catch {
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <>
      <section className="pt-32 pb-16 bg-secondary/30">
        <div className="container-custom text-center">
          <AnimatedSection>
            <SectionHeader
              badge="Insights"
              title="Engineering knowledge, openly shared"
              description="Deep dives, product thinking, and practical guides from our engineering team."
              centered
            />
          </AnimatedSection>
        </div>
      </section>

      <section className="py-24">
        <div className="container-custom">
          {posts.length === 0 ? (
            <AnimatedSection className="text-center py-20">
              <p className="text-muted-foreground text-lg">
                Articles coming soon — check back later.
              </p>
            </AnimatedSection>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post, i) => (
                <AnimatedSection key={post.id} delay={i * 0.06}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group flex flex-col h-full rounded-2xl border bg-background hover:border-primary/50 hover:shadow-lg transition-all overflow-hidden"
                  >
                    <div className="h-44 bg-gradient-to-br from-sterova-50 to-purple-50 dark:from-sterova-950/30 dark:to-purple-950/30 flex items-center justify-center">
                      <span className="text-5xl font-display font-bold text-sterova-200 dark:text-sterova-800 select-none">
                        {post.title.charAt(0)}
                      </span>
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium">
                          {post.category}
                        </span>
                        {post.read_time_minutes && (
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" aria-hidden="true" />
                            {post.read_time_minutes} min read
                          </span>
                        )}
                      </div>
                      <h2 className="text-base font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h2>
                      <p className="text-sm text-muted-foreground leading-relaxed flex-1 line-clamp-3 mb-4">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {post.published_at
                            ? formatDate(post.published_at)
                            : ""}
                        </span>
                        <span className="text-xs text-primary font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                          Read more <ArrowRight className="h-3 w-3" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>
      </section>

      <CTASection
        title="Have a topic you'd like us to cover?"
        description="Reach out — we love writing about problems we've solved."
      />
    </>
  );
}
