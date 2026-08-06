import { createFileRoute } from "@tanstack/react-router";
import ServicesPage from "@/pages/ServicesPage";
import { seo, breadcrumbSchema, absoluteUrl, ORG_ID } from "@/lib/seo";
import { SITE, FAQS } from "@/data/constants";

const description =
  "Sterova offers custom software development, web platforms, mobile apps, SaaS products, UI/UX design, and API integration services. Get a free consultation.";

export const Route = createFileRoute("/services/")({
  head: () =>
    seo({
      title: "Services — Sterova | Custom Software, Web & Mobile Development",
      description,
      path: "/services",
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Custom Software Development Services",
          description,
          url: absoluteUrl("/services"),
          serviceType: "Software engineering",
          provider: { "@id": ORG_ID },
          areaServed: [
            { "@type": "Country", name: "India" },
            { "@type": "Place", name: "Worldwide" },
          ],
        },
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.filter((f) => f.is_active).map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
          })),
        },
        breadcrumbSchema([{ name: "Services", path: "/services" }]),
      ],
    }),
  component: ServicesPage,
});
