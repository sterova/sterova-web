import { createFileRoute } from "@tanstack/react-router";
import SolutionsPage from "@/pages/SolutionsPage";
import { seo, organizationSchema, ORG_ID, absoluteUrl, breadcrumbSchema } from "@/lib/seo";

export const Route = createFileRoute("/solutions")({
  head: () => {
    const path = "/solutions";
    return seo({
      title: "Solutions | Sterova",
      description:
        "Explore our industry expertise, technology stack, transparent pricing, and engineering process.",
      path,
      jsonLd: [
        organizationSchema(),
        {
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Solutions | Sterova",
          description:
            "Explore our industry expertise, technology stack, transparent pricing, and engineering process.",
          url: absoluteUrl(path),
          publisher: { "@id": ORG_ID },
        },
        breadcrumbSchema([{ name: "Solutions", path }]),
      ],
    });
  },
  component: SolutionsPage,
});
