import { Link, useRoute } from "wouter";
import { Clock, Calendar, ArrowLeft, BookOpen } from "lucide-react";
import CTASection from "@/components/sections/CTASection";
import { BLOG_POSTS } from "@/data/blog";
import { SITE } from "@/data/constants";
import { formatDate } from "@/lib/utils";

export default function BlogPostPage() {
  const [, params] = useRoute("/blog/:slug");
  const slug = params?.slug ?? "";
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="pt-32 pb-24 container-custom text-center">
        <BookOpen className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
        <h1 className="text-2xl font-semibold mb-2">Post not found</h1>
        <p className="text-muted-foreground mb-6">
          This post doesn&apos;t exist or may have been moved.
        </p>
        <Link href="/blog" className="text-primary hover:underline text-sm">
          ← Back to blog
        </Link>
      </div>
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
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Back to Blog
          </Link>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium">
              {post.category}
            </span>
            {post.published_at && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {formatDate(post.published_at)}
              </span>
            )}
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {post.read_time_minutes} min read
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mb-6 text-balance">
            {post.title}
          </h1>

          <p className="text-lg text-muted-foreground mb-10 leading-relaxed">{post.excerpt}</p>

          {/* Author */}
          <div className="flex items-center gap-3 py-5 border-y mb-10">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4f46e5] to-[#a855f7] flex items-center justify-center text-white text-sm font-bold">
              {post.author_name.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-medium">{post.author_name}</p>
              <p className="text-xs text-muted-foreground">{SITE.name}</p>
            </div>
          </div>

          {/* Content */}
          <div
            className="prose prose-slate dark:prose-invert max-w-none"
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
