import { createFileRoute } from "@tanstack/react-router";
import DocsPage from "@/pages/DocsPage";
import { seo, breadcrumbSchema, webPageSchema } from "@/lib/seo";

const description =
  "Sterova documentation: onboarding guides, integration references, and technical documentation for clients and partners.";

export const Route = createFileRoute("/docs")({
  head: () =>
    seo({
      title: "Documentation",
      description,
      path: "/docs",
      jsonLd: [
        webPageSchema("Documentation", description, "/docs"),
        breadcrumbSchema([
          { name: "Resources", path: "/resources" },
          { name: "Documentation", path: "/docs" },
        ]),
      ],
    }),
  component: DocsPage,
});
