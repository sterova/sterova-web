import { createFileRoute } from "@tanstack/react-router";
import ResourcesPage from "@/pages/ResourcesPage";
import { seo, breadcrumbSchema, webPageSchema } from "@/lib/seo";

const description =
  "Explore Sterova's technical insights, engineering guides, blog posts, and technology stack documentation.";

export const Route = createFileRoute("/resources")({
  component: ResourcesPage,
  head: () =>
    seo({
      title: "Resources — Sterova | Guides, Blog & Tech Stack",
      description,
      path: "/resources",
      jsonLd: [
        webPageSchema("Sterova Resources", description, "/resources"),
        breadcrumbSchema([{ name: "Resources", path: "/resources" }]),
      ],
    }),
});
