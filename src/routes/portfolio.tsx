import { createFileRoute } from "@tanstack/react-router";
import PortfolioPage from "@/pages/PortfolioPage";
import { seo, breadcrumbSchema, absoluteUrl } from "@/lib/seo";
import { fetchCaseStudies } from "@/lib/api";

const description =
  "Explore Sterova's portfolio of custom web apps, SaaS platforms, mobile apps, and enterprise solutions built across industries.";

export const Route = createFileRoute("/portfolio")({
  loader: async () => {
    try {
      return await fetchCaseStudies();
    } catch {
      return [];
    }
  },
  head: () =>
    seo({
      title: "Portfolio — Sterova | Web Apps, SaaS & Mobile Projects",
      description,
      path: "/portfolio",
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Sterova Portfolio",
          description,
          url: absoluteUrl("/portfolio"),
        },
        breadcrumbSchema([{ name: "Portfolio", path: "/portfolio" }]),
      ],
    }),
  component: PortfolioPage,
});
