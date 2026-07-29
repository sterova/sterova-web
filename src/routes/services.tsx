import { createFileRoute } from "@tanstack/react-router";
import ServicesPage from "@/pages/ServicesPage";
import { seo, breadcrumbSchema, absoluteUrl } from "@/lib/seo";
import { SITE, FAQS } from "@/data/constants";

const description =
  "Custom software, web platforms, mobile apps, SaaS products, UI/UX design, and API integration.";

export const Route = createFileRoute("/services")({
  head: () =>
    seo({
      title: "Services",
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
          provider: { "@type": "Organization", name: SITE.name, url: SITE.url },
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
