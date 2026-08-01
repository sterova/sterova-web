import { SITE } from "@/data/constants";
import { ORG_ID, localBusinessSchema, organizationSchema, websiteSchema } from "@/lib/seo";

/**
 * Entity nodes are defined once in `@/lib/seo` so the phone number, logo and
 * social profiles can never drift between pages.
 */
export const getOrganizationSchema = organizationSchema;
export const getProfessionalServiceSchema = localBusinessSchema;
export const getWebSiteSchema = websiteSchema;

export function getSoftwareApplicationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Sterova Software Services",
    applicationCategory: "BusinessApplication",
    operatingSystem: "All",
    description: "Custom software services, web services, and scalable digital products.",
  };
}

export function getArticleSchema(
  post: {
    title: string;
    description: string;
    image?: string;
    created_at: string;
    updated_at?: string;
    author?: { name: string };
  },
  url: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    image: post.image
      ? post.image.startsWith("http")
        ? post.image
        : `${SITE.url}${post.image}`
      : `${SITE.url}/og-image.png`,
    datePublished: post.created_at,
    dateModified: post.updated_at || post.created_at,
    author: {
      "@type": "Person",
      name: post.author?.name || "Sterova Team",
    },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      logo: {
        "@type": "ImageObject",
        url: `${SITE.url}/logo-512.png`,
        width: 512,
        height: 512,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };
}

export function getBreadcrumbSchema(items: { name: string; item: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.item.startsWith("http") ? item.item : `${SITE.url}${item.item}`,
    })),
  };
}

export function getServiceSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Custom Software Development Services",
    provider: {
      "@id": ORG_ID,
    },
    url: `${SITE.url}/services`,
  };
}

export function getCollectionPageSchema(name: string, description: string, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: name,
    description: description,
    url: url.startsWith("http") ? url : `${SITE.url}${url}`,
  };
}

export function getFAQPageSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
