import { createFileRoute } from "@tanstack/react-router";
import ContactPage from "@/pages/ContactPage";
import { seo, breadcrumbSchema, absoluteUrl, ORG_ID } from "@/lib/seo";

const description =
  "Contact Sterova for a free project consultation. Tell us about your idea and get a fixed-scope quote from the engineers who will build it.";

export const Route = createFileRoute("/contact")({
  head: () =>
    seo({
      title: "Contact Sterova — Get a Free Project Quote",
      description,
      path: "/contact",
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: "Contact Sterova",
          description,
          url: absoluteUrl("/contact"),
          mainEntity: { "@id": ORG_ID },
        },
        breadcrumbSchema([{ name: "Contact", path: "/contact" }]),
      ],
    }),
  component: ContactPage,
});
