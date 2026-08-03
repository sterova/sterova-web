import { createFileRoute } from "@tanstack/react-router";
import TechnologiesPage from "@/pages/TechnologiesPage";
import { seo, breadcrumbSchema } from "@/lib/seo";

export const Route = createFileRoute("/technologies")({
  head: () =>
    seo({
      title: "Technologies | Sterova Tech",
      description:
        "We choose the right tools for the job, favoring reliability, performance, and developer experience.",
      path: "/technologies",
      jsonLd: [breadcrumbSchema([{ name: "Technologies", path: "/technologies" }])],
    }),
  component: TechnologiesPage,
});
