import { createFileRoute } from "@tanstack/react-router";
import ResourcesPage from "@/pages/ResourcesPage";
import { seo } from "@/lib/seo";
import { SITE } from "@/data/constants";

export const Route = createFileRoute("/resources")({
  component: ResourcesPage,
  head: () => ({
    meta: seo({
      title: "Resources | " + SITE.name,
      description: "Explore our technical insights, guides, and engineering standards.",
      path: "/resources",
    }).meta,
  }),
});
