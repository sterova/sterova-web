import { createFileRoute } from "@tanstack/react-router";
import CaseStudiesPage from "@/pages/CaseStudiesPage";
import { seo, breadcrumbSchema, absoluteUrl, ORG_ID } from "@/lib/seo";
import { fetchCaseStudies } from "@/lib/api";

const description =
  "Explore deep dives into the challenges our clients faced and the solutions we engineered.";

export const Route = createFileRoute("/case-studies/")({
  loader: async () => {
    try {
      return await fetchCaseStudies();
    } catch {
      return [];
    }
  },
  head: () =>
    seo({
      title: "Case Studies — Sterova Tech",
      description,
      path: "/case-studies",
      jsonLd: [breadcrumbSchema([{ name: "Case Studies", path: "/case-studies" }])],
    }),
  component: CaseStudiesPage,
});
