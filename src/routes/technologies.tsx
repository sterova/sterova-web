import { createFileRoute } from "@tanstack/react-router";
import TechnologiesPage from "@/pages/TechnologiesPage";
import { seo, breadcrumbSchema, webPageSchema } from "@/lib/seo";

const description =
  "Sterova's core technology stack — React, TypeScript, Node.js, PostgreSQL, Supabase, and more. We choose reliability, performance, and developer experience.";

export const Route = createFileRoute("/technologies")({
  head: () =>
    seo({
      title: "Technologies — Sterova | React, TypeScript, Node.js & More",
      description,
      path: "/technologies",
      jsonLd: [
        webPageSchema("Sterova Technology Stack", description, "/technologies"),
        breadcrumbSchema([{ name: "Technologies", path: "/technologies" }]),
      ],
    }),
  component: TechnologiesPage,
});
