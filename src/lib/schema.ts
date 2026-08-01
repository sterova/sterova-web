import { SITE } from "@/data/constants";

export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: SITE.url,
    logo: `${SITE.url}/icons/favicon.svg`,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+918124949176",
      contactType: "customer service",
      email: "support@sterova.tech",
    },
    sameAs: [
      "https://x.com/sterovatech",
      "https://github.com/sterova",
      "https://www.linkedin.com/company/sterova",
    ],
  };
}

export function getProfessionalServiceSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: SITE.name,
    url: SITE.url,
    logo: `${SITE.url}/icons/favicon.svg`,
    image: `${SITE.url}/og-image.png`,
    description: SITE.description,
    telephone: "+918124949176",
    priceRange: "$$",
  };
}

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

export function getWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
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
        url: `${SITE.url}/icons/favicon.svg`,
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
      "@type": "Organization",
      name: SITE.name,
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
