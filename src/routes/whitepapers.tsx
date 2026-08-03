import { createFileRoute } from "@tanstack/react-router";
import WhitepapersPage from "@/pages/WhitepapersPage";
import { seo, breadcrumbSchema, webPageSchema } from "@/lib/seo";

const description =
  "In-depth technical research, architectural guides, and engineering playbooks published by the Sterova team.";

export const Route = createFileRoute("/whitepapers")({
  head: () =>
    seo({
      title: "Whitepapers & Technical Guides",
      description,
      path: "/whitepapers",
      jsonLd: [
        webPageSchema("Whitepapers", description, "/whitepapers"),
        breadcrumbSchema([
          { name: "Resources", path: "/resources" },
          { name: "Whitepapers", path: "/whitepapers" },
        ]),
      ],
    }),
  component: WhitepapersPage,
});
