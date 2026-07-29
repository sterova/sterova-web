import { createFileRoute } from "@tanstack/react-router";
import HomePage from "@/pages/HomePage";
import { SITE } from "@/data/constants";
import { seo, webPageSchema } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () =>
    seo({
      title: `${SITE.name} — ${SITE.tagline}`,
      description: SITE.description,
      path: "/",
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: SITE.name,
          url: SITE.url,
          description: SITE.description,
        },
        {
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          name: SITE.name,
          url: SITE.url,
          description: SITE.description,
          image: `${SITE.url}${SITE.ogImage}`,
          email: SITE.email,
          telephone: SITE.whatsapp,
          areaServed: "Worldwide",
          serviceType: [
            "Custom software development",
            "Web development",
            "Mobile app development",
            "SaaS product engineering",
            "UI/UX design",
            "API integration",
          ],
          priceRange: "$$",
        },
        webPageSchema(`${SITE.name} — ${SITE.tagline}`, SITE.description, "/"),
      ],
    }),
  component: HomePage,
});
