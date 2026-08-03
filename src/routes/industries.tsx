import { createFileRoute } from "@tanstack/react-router";
import IndustriesPage from "@/pages/IndustriesPage";
import { seo, breadcrumbSchema } from "@/lib/seo";
import { fetchIndustries } from "@/lib/api";

const description =
  "Discover the industries we serve and the tailored software solutions we build for each sector.";

export const Route = createFileRoute("/industries")({
  loader: async () => {
    try {
      return await fetchIndustries();
    } catch {
      return [];
    }
  },
  head: () =>
    seo({
      title: "Industries Served | Sterova Tech",
      description,
      path: "/industries",
      jsonLd: [breadcrumbSchema([{ name: "Industries", path: "/industries" }])],
    }),
  component: IndustriesPage,
});
