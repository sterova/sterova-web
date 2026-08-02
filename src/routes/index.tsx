import { createFileRoute } from "@tanstack/react-router";
import HomePage from "@/pages/HomePage";
import { SITE, FAQS } from "@/data/constants";
import { seo, organizationSchema, websiteSchema, localBusinessSchema, ORG_ID } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () =>
    seo({
      title: `${SITE.name} — ${SITE.tagline}`,
      description: SITE.description,
      path: "/",
      // The brand mark is the above-the-fold LCP candidate.
      links: [
        {
          rel: "preload",
          as: "image",
          href: "/logo-128.webp",
          type: "image/webp",
          fetchPriority: "high",
        },
      ],
      jsonLd: [
        organizationSchema(),
        websiteSchema(),
        localBusinessSchema(),
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "@id": `${SITE.url}/#faq`,
          publisher: { "@id": ORG_ID },
          mainEntity: FAQS.slice(0, 6).map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        },
      ],
    }),
  component: HomePage,
});
