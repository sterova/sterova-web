import { createFileRoute } from "@tanstack/react-router";
import EstimatePage from "@/pages/EstimatePage";
import { seo, webPageSchema, breadcrumbSchema } from "@/lib/seo";

const description =
  "Get an instant, interactive cost and timeline estimate for your custom software project.";

export const Route = createFileRoute("/estimate")({
  head: () =>
    seo({
      title: "Project Estimator",
      description,
      path: "/estimate",
      jsonLd: [
        webPageSchema("Project Estimator", description, "/estimate"),
        breadcrumbSchema([{ name: "Estimate", path: "/estimate" }]),
      ],
    }),
  component: EstimatePage,
});
