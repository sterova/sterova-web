import { createFileRoute } from "@tanstack/react-router";
import IndustriesPage from "@/pages/IndustriesPage";
import { seo, breadcrumbSchema } from "@/lib/seo";

const description =
  "Practical websites, ecommerce stores, booking flows, and business tools for local and growing companies.";

export const Route = createFileRoute("/industries")({
  head: () =>
    seo({
      title: "Industries Served | Sterova Tech",
      description,
      path: "/industries",
      jsonLd: [breadcrumbSchema([{ name: "Industries", path: "/industries" }])],
    }),
  component: IndustriesPage,
});
