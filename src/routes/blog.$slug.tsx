import { createFileRoute } from "@tanstack/react-router";
import BlogPostPage from "@/pages/BlogPostPage";
import RouteErrorState from "@/components/shared/RouteErrorState";
import NotFoundPage from "@/pages/NotFoundPage";
import { seo, breadcrumbSchema, absoluteUrl, privateSeo } from "@/lib/seo";
import { SITE } from "@/data/constants";
import { fetchPostBySlug } from "@/lib/api";

/**
 * Search snippets want 50–160 characters. Falls back to a title-derived line
 * when a post ships without an excerpt, and trims anything over the limit.
 */
function metaDescription(raw: string | null | undefined, title: string) {
  const text = (raw ?? "").replace(/\s+/g, " ").trim();
  const value =
    text.length >= 50
      ? text
      : `${title} — insights on custom software, product engineering, and delivery from the ${SITE.name} team.`;
  return value.length <= 160 ? value : `${value.slice(0, 157).trimEnd()}…`;
}

export const Route = createFileRoute("/blog/$slug")({
  // Public, RLS-scoped read: gives crawlers a real title/description/cover in SSR HTML.
  loader: async ({ params, abortController }) => {
    try {
      // Passing the signal means a superseded navigation stops this request
      // instead of resolving late over a newer destination.
      const post = await fetchPostBySlug(params.slug, abortController.signal);
      if (!post) return null;
      const title = post.seo_title || post.title;
      return {
        title,
        description: metaDescription(post.seo_description || post.excerpt, title),
        image: post.cover_image_url,
        author: post.author_name,
        published_at: post.published_at,
        updated_at: post.updated_at,
        tags: post.tags ?? [],
      };
    } catch {
      return null;
    }
  },
  head: ({ params, loaderData }) => {
    // No loader data = missing post or a pending client navigation: keep it out of the index.
    if (!loaderData) return privateSeo("Article unavailable", "noindex, follow");

    const path = `/blog/${params.slug}`;
    const image = loaderData.image ?? SITE.ogImage;
    return seo({
      title: loaderData.title,
      description: loaderData.description,
      path,
      type: "article",
      image,
      meta: [
        ...(loaderData.published_at
          ? [{ property: "article:published_time", content: loaderData.published_at }]
          : []),
        ...(loaderData.updated_at
          ? [{ property: "article:modified_time", content: loaderData.updated_at }]
          : []),
        { property: "article:author", content: loaderData.author },
        ...loaderData.tags.map((tag) => ({ property: "article:tag", content: tag })),
      ],
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: loaderData.title,
          description: loaderData.description,
          image: absoluteUrl(image),
          keywords: loaderData.tags.join(", ") || undefined,
          datePublished: loaderData.published_at ?? undefined,
          dateModified: loaderData.updated_at ?? loaderData.published_at ?? undefined,
          author: { "@type": "Person", name: loaderData.author },
          publisher: {
            "@type": "Organization",
            name: SITE.name,
            logo: { "@type": "ImageObject", url: absoluteUrl("/favicon.svg") },
          },
          mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(path) },
        },
        breadcrumbSchema([
          { name: "Blog", path: "/blog" },
          { name: loaderData.title, path },
        ]),
      ],
    });
  },
  component: BlogPostPage,
  // Loader/render failures stay inside the route slot: the shell, navbar and
  // RouteProgress keep working while the reader gets a retry surface.
  errorComponent: ({ error, reset }) => (
    <RouteErrorState
      error={error}
      reset={reset}
      boundary="blog_post_route"
      title="This article failed to load"
      description="We couldn't fetch this post. Retry, or head back to the blog index."
    />
  ),
  notFoundComponent: () => <NotFoundPage />,
});
