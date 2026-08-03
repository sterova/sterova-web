import { createFileRoute } from "@tanstack/react-router";
import ProcessPage from "@/pages/ProcessPage";
import { seo, breadcrumbSchema } from "@/lib/seo";

export const Route = createFileRoute("/process")({
  head: () =>
    seo({
      title: "Our Process | Sterova Tech",
      description:
        "A proven methodology focused on clear communication, rapid iteration, and delivering measurable business value.",
      path: "/process",
      jsonLd: [breadcrumbSchema([{ name: "Process", path: "/process" }])],
    }),
  component: ProcessPage,
});
