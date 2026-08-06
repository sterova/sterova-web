import { createFileRoute } from "@tanstack/react-router";
import ProcessPage from "@/pages/ProcessPage";
import { seo, breadcrumbSchema, webPageSchema } from "@/lib/seo";

const description =
  "Sterova's proven 6-step development process — from discovery and scoping to launch and post-launch support. Transparent, iterative, and results-driven.";

export const Route = createFileRoute("/process")({
  head: () =>
    seo({
      title: "Our Process — Sterova | Discovery to Delivery in 6 Steps",
      description,
      path: "/process",
      jsonLd: [
        webPageSchema("Sterova Development Process", description, "/process"),
        breadcrumbSchema([{ name: "Process", path: "/process" }]),
      ],
    }),
  component: ProcessPage,
});
