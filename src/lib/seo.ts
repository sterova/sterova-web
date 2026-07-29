import { SITE } from "@/data/constants";

/** Absolute URL helper — crawlers require absolute og:image / @id values. */
export function absoluteUrl(path: string) {
  if (!path) return SITE.url;
  return path.startsWith("http") ? path : `${SITE.url}${path.startsWith("/") ? "" : "/"}${path}`;
}

type JsonLd = Record<string, unknown>;

interface SeoInput {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  image?: string;
  /** Extra meta entries (article:published_time, robots, etc.). */
  meta?: { name?: string; property?: string; content: string }[];
  /** Structured data objects rendered as <script type="application/ld+json">. */
  jsonLd?: JsonLd[];
}

/** Builds a complete, self-referencing meta set for a route's head(). */
export function seo({
  title,
  description,
  path,
  type = "website",
  image,
  meta = [],
  jsonLd,
}: SeoInput) {
  const fullTitle = path === "/" ? title : `${title} — ${SITE.name}`;
  const ogImage = absoluteUrl(image ?? SITE.ogImage);
  const canonical = absoluteUrl(path);
  return {
    meta: [
      { title: fullTitle },
      { name: "description", content: description },
      { property: "og:title", content: fullTitle },
      { property: "og:description", content: description },
      { property: "og:type", content: type },
      { property: "og:url", content: canonical },
      { property: "og:site_name", content: SITE.name },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: fullTitle },
      { name: "twitter:description", content: description },
      { property: "og:image", content: ogImage },
      { property: "og:image:alt", content: fullTitle },
      { name: "twitter:image", content: ogImage },
      ...meta,
    ],
    links: [{ rel: "canonical", href: canonical }],
    scripts: (jsonLd ?? []).map((schema) => ({
      type: "application/ld+json",
      children: JSON.stringify(schema),
    })),
  };
}

/**
 * Head for private / non-indexable screens (CMS, OAuth consent, error pages).
 * No canonical and no og:* — these pages must never be indexed or shared.
 */
export function privateSeo(title: string, robots = "noindex, nofollow") {
  return {
    meta: [
      { title: `${title} — ${SITE.name}` },
      { name: "robots", content: robots },
      { name: "googlebot", content: robots },
    ],
  };
}

/** BreadcrumbList for any non-home route. */
export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...items].map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function webPageSchema(name: string, description: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    description,
    url: absoluteUrl(path),
    isPartOf: { "@type": "WebSite", name: SITE.name, url: SITE.url },
  };
}

export function organizationJsonLd() {
  return {
    type: "application/ld+json",
    children: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: SITE.name,
      url: SITE.url,
      description: SITE.description,
      email: SITE.email,
      logo: absoluteUrl("/favicon.svg"),
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        email: SITE.email,
        telephone: SITE.whatsapp,
      },
    }),
  };
}
