import { createFileRoute } from "@tanstack/react-router";
import PortfolioPage from "@/pages/PortfolioPage";
import { seo, breadcrumbSchema, absoluteUrl } from "@/lib/seo";

const description =
  "Examples of the platforms, integrations, and architectures Sterova engineers across industries.";

export const Route = createFileRoute("/portfolio")({
  head: () =>
    seo({
      title: "Portfolio",
      description,
      path: "/portfolio",
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Portfolio",
          description,
          url: absoluteUrl("/portfolio"),
        },
        breadcrumbSchema([{ name: "Portfolio", path: "/portfolio" }]),
      ],
    }),
  component: PortfolioPage,
});
