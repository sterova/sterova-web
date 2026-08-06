import { createFileRoute } from "@tanstack/react-router";
import IndustriesPage from "@/pages/IndustriesPage";
import { seo, breadcrumbSchema, webPageSchema } from "@/lib/seo";

const description =
  "Sterova builds custom software for FinTech, Healthcare, E-commerce, EdTech, Logistics, Real Estate, and more. Industry-specific digital solutions.";

export const Route = createFileRoute("/industries")({
  head: () =>
    seo({
      title: "Industries We Serve — Sterova | FinTech, Healthcare, E-commerce & More",
      description,
      path: "/industries",
      jsonLd: [
        webPageSchema("Industries Served by Sterova", description, "/industries"),
        breadcrumbSchema([{ name: "Industries", path: "/industries" }]),
      ],
    }),
  component: IndustriesPage,
});
