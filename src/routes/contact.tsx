import { createFileRoute } from "@tanstack/react-router";
import ContactPage from "@/pages/ContactPage";
import { seo, breadcrumbSchema, absoluteUrl } from "@/lib/seo";
import { SITE } from "@/data/constants";

const description =
  "Tell us about your project and get a fixed-scope quote from the engineers who will build it.";

export const Route = createFileRoute("/contact")({
  head: () =>
    seo({
      title: "Contact",
      description,
      path: "/contact",
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: "Contact Sterova",
          description,
          url: absoluteUrl("/contact"),
          mainEntity: {
            "@type": "Organization",
            name: SITE.name,
            url: SITE.url,
            email: SITE.email,
            telephone: SITE.whatsapp,
          },
        },
        breadcrumbSchema([{ name: "Contact", path: "/contact" }]),
      ],
    }),
  component: ContactPage,
});
