import { createFileRoute } from "@tanstack/react-router";
import OpenSourcePage from "@/pages/OpenSourcePage";
import { seo, breadcrumbSchema, webPageSchema } from "@/lib/seo";

const description =
  "Open-source tools, libraries, and projects created and maintained by the Sterova engineering team.";

export const Route = createFileRoute("/open-source")({
  head: () =>
    seo({
      title: "Open Source",
      description,
      path: "/open-source",
      jsonLd: [
        webPageSchema("Open Source", description, "/open-source"),
        breadcrumbSchema([
          { name: "Resources", path: "/resources" },
          { name: "Open Source", path: "/open-source" },
        ]),
      ],
    }),
  component: OpenSourcePage,
});
