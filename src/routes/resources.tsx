import { createFileRoute } from "@tanstack/react-router";
import ResourcesPage from "@/pages/ResourcesPage";
import { seo, breadcrumbSchema, webPageSchema } from "@/lib/seo";

const description =
  "Explore Sterova's knowledge hub: engineering blog, whitepapers, documentation, API docs, changelog, press kit, and more.";

export const Route = createFileRoute("/resources")({
  head: () =>
    seo({
      title: "Resources",
      description,
      path: "/resources",
      jsonLd: [
        webPageSchema("Resources", description, "/resources"),
        breadcrumbSchema([{ name: "Resources", path: "/resources" }]),
      ],
    }),
  component: ResourcesPage,
});
