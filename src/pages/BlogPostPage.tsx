import { useEffect, useRef } from "react";
import { Link, useRoute } from "@/lib/router-compat";
import { useQuery } from "@tanstack/react-query";
import { Clock, Calendar, ArrowLeft, BookOpen, Loader2 } from "lucide-react";
import CTASection from "@/components/sections/CTASection";
import { ErrorState } from "@/components/shared/DataStates";
import { fetchPostBySlug, incrementPostViews } from "@/lib/api";
import { SITE } from "@/data/constants";
import { formatDate } from "@/lib/utils";

export default function BlogPostPage() {
  const [, params] = useRoute("/blog/:slug");
  const slug = params?.slug ?? "";

  const {
    data: post,
    isPending,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["post", slug],
    queryFn: () => fetchPostBySlug(slug),
    enabled: slug.length > 0,
  });

  // Count a view once per mounted slug. Guarded with a ref so React's double
  // invoke in development doesn't inflate the counter.
  const countedSlug = useRef<string | null>(null);
  useEffect(() => {
    if (!post || countedSlug.current === post.slug) return;
    countedSlug.current = post.slug;
    void incrementPostViews(post.slug);
  }, [post]);

  if (isPending) {
    return (
      <div className="pt-32 pb-24 container-custom flex justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" aria-hidden="true" />
        <span className="sr-only">Loading post…</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="pt-32 pb-24 container-custom">
        <ErrorState
          message="This post couldn't be loaded. Please try again in a moment."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  if (!post) {
    return (
      <>
        <div className="pt-32 pb-24 container-custom text-center">
          <BookOpen
            className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4"
            aria-hidden="true"
          />
          <h1 className="text-2xl font-semibold mb-2">Post not found</h1>
          <p className="text-muted-foreground mb-6">
            This post doesn&apos;t exist or may have been moved.
          </p>
          <Link href="/blog" className="text-primary hover:underline text-sm">
            ← Back to blog
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <article className="pt-28 pb-16">
        <div className="container-custom max-w-3xl">
          {/* Back */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 group"
          >
            <ArrowLeft
              className="h-4 w-4 transition-transform group-hover:-translate-x-0.5"
              aria-hidden="true"
            />
            Back to Blog
          </Link>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            {post.blog_categories?.name && (
              <span className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium">
                {post.blog_categories.name}
              </span>
            )}
            {post.published_at && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" aria-hidden="true" />
                {formatDate(post.published_at)}
              </span>
            )}
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" aria-hidden="true" />
              {post.read_time_minutes} min read
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mb-6 text-balance">
            {post.title}
          </h1>

          <p className="text-lg text-muted-foreground mb-10 leading-relaxed">{post.excerpt}</p>

          {/* Cover */}
          {post.cover_image_url && (
            <img
              src={post.cover_image_url}
              alt={post.title}
              className="w-full rounded-2xl border object-cover mb-10"
            />
          )}

          {/* Author */}
          <div className="flex items-center gap-3 py-5 border-y mb-10">
            {post.author_avatar_url ? (
              <img
                src={post.author_avatar_url}
                alt={post.author_name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div
                className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold"
                aria-hidden="true"
              >
                {post.author_name.charAt(0)}
              </div>
            )}
            <div>
              <p className="text-sm font-medium">{post.author_name}</p>
              <p className="text-xs text-muted-foreground">{SITE.name}</p>
            </div>
          </div>

          {/* Content */}
          <div
            className="prose prose-invert prose-headings:font-display max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-secondary text-secondary-foreground px-3 py-1 rounded-full font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>

      <CTASection />
    </>
  );
}
