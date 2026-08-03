import { createFileRoute } from "@tanstack/react-router";
import ChangelogPage from "@/pages/ChangelogPage";
import { seo, breadcrumbSchema, webPageSchema } from "@/lib/seo";

const description =
  "A running record of what's new at Sterova — product updates, service improvements, and notable milestones.";

export const Route = createFileRoute("/changelog")({
  head: () =>
    seo({
      title: "Changelog",
      description,
      path: "/changelog",
      jsonLd: [
        webPageSchema("Changelog", description, "/changelog"),
        breadcrumbSchema([
          { name: "Resources", path: "/resources" },
          { name: "Changelog", path: "/changelog" },
        ]),
      ],
    }),
  component: ChangelogPage,
});
