import { createFileRoute } from "@tanstack/react-router";
import ProcessPage from "@/pages/ProcessPage";
import { seo, breadcrumbSchema, webPageSchema } from "@/lib/seo";

const description =
  "How a Sterova project runs: discovery, fixed-scope quotes, engineering sprints, launch, and post-launch support.";

export const Route = createFileRoute("/process")({
  head: () =>
    seo({
      title: "Process",
      description,
      path: "/process",
      jsonLd: [
        webPageSchema("Our Process", description, "/process"),
        breadcrumbSchema([{ name: "Process", path: "/process" }]),
      ],
    }),
  component: ProcessPage,
});
