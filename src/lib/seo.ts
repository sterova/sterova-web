import { POSTAL_ADDRESS, SAME_AS, SERVICES, SITE } from "@/data/constants";

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
  /** Extra <link> entries (preload hints, etc.). */
  links?: Record<string, unknown>[];
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
  links = [],
}: SeoInput) {
  const fullTitle = path === "/" ? title : `${title} — ${SITE.name}`;
  const ogImage = absoluteUrl(image ?? SITE.ogImage);
  const canonical = absoluteUrl(path);
  return {
    meta: [
      { title: fullTitle },
      { name: "description", content: description },
      // Robots: index everything and allow rich snippets
      {
        name: "robots",
        content: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
      },
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
    // Self-referencing hreflang: the site is English-only, so `en` and
    // `x-default` both point at the page itself.
    links: [
      { rel: "canonical", href: canonical },
      { rel: "alternate", hrefLang: "en", href: canonical },
      { rel: "alternate", hrefLang: "x-default", href: canonical },
      ...links,
    ],
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
    isPartOf: { "@id": WEBSITE_ID },
    publisher: { "@id": ORG_ID },
  };
}

/** Stable node identifiers so every schema references one entity graph. */
export const ORG_ID = `${SITE.url}/#organization`;
export const WEBSITE_ID = `${SITE.url}/#website`;
export const LOCAL_BUSINESS_ID = `${SITE.url}/#localbusiness`;

/** The canonical Organization node. Everything else references it by @id. */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: SITE.name,
    alternateName: SITE.alternateNames,
    url: SITE.url,
    description:
      "SterovaTech (Sterova) is a custom software engineering agency. (Note: We are not affiliated with the AI text-to-3D generator). " +
      SITE.description,
    email: SITE.email,
    telephone: SITE.phone,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl("/android-chrome-512x512.png"),
      width: 512,
      height: 512,
    },
    image: absoluteUrl(SITE.ogImage),
    address: { "@type": "PostalAddress", ...POSTAL_ADDRESS },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: SITE.email,
      telephone: SITE.phone,
      areaServed: "Worldwide",
      availableLanguage: "English",
    },
    sameAs: SAME_AS,
    knowsAbout: [
      "Custom Software Development",
      "Web Application Development",
      "Mobile App Development",
      "SaaS Product Engineering",
      "UI/UX Design",
      "API Development",
      "Cloud Computing",
      "Cybersecurity",
      "Artificial Intelligence",
      "IT Consulting",
      "React",
      "TypeScript",
      "Node.js",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Sterova Software Development Services",
      itemListElement: SERVICES.filter((s) => s.is_active).map((service) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: service.title,
          description: service.short_description,
          url: absoluteUrl(`/services/${service.slug}`),
        },
      })),
    },
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE.url,
    name: SITE.name,
    alternateName: SITE.alternateNames,
    description: SITE.description,
    publisher: { "@id": ORG_ID },
    inLanguage: "en",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE.url}/blog?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/** LocalBusiness node — required for local pack / map eligibility. */
export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": LOCAL_BUSINESS_ID,
    name: SITE.name,
    alternateName: SITE.alternateNames,
    url: SITE.url,
    description: SITE.description,
    image: absoluteUrl(SITE.ogImage),
    telephone: SITE.phone,
    email: SITE.email,
    priceRange: "$$",
    parentOrganization: { "@id": ORG_ID },
    address: { "@type": "PostalAddress", ...POSTAL_ADDRESS },
    areaServed: [
      { "@type": "Country", name: "India" },
      { "@type": "Place", name: "Worldwide" },
    ],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "09:00",
        closes: "21:00",
      },
    ],
    sameAs: SAME_AS,
  };
}
