import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import { SITE } from "@/data/constants";
import type { BlogPost } from "@/types";
import CTASection from "@/components/sections/CTASection";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getPost(slug: string): Promise<BlogPost | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .single();
    if (error) return null;
    return data as BlogPost;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Post not found" };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.published_at ?? undefined,
      authors: [post.author_name],
    },
    alternates: { canonical: `/blog/${slug}` },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <>
      <article className="pt-32 pb-24">
        <div className="container-custom max-w-3xl">
          {/* Back */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-10 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
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
            {post.read_time_minutes && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {post.read_time_minutes} min read
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl font-display font-bold tracking-tight mb-6 text-balance">
            {post.title}
          </h1>

          <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
            {post.excerpt}
          </p>

          {/* Author */}
          <div className="flex items-center gap-3 py-5 border-y mb-10">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sterova-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
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
        </div>
      </article>

      <CTASection />
    </>
  );
}
