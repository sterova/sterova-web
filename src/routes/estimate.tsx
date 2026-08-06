import { createFileRoute, notFound } from "@tanstack/react-router";
import EstimatePage from "@/pages/EstimatePage";
import { fetchSiteSettings } from "@/lib/settings-api";
import { seo, webPageSchema, breadcrumbSchema } from "@/lib/seo";

const description =
  "Get an instant, interactive cost and timeline estimate for your custom software project from Sterova. No commitment required.";

export const Route = createFileRoute("/estimate")({
  beforeLoad: async () => {
    const settings = await fetchSiteSettings();
    if (settings.features.estimator === false) {
      throw notFound();
    }
  },
  head: () =>
    seo({
      title: "Project Estimator — Sterova | Get an Instant Cost Estimate",
      description,
      path: "/estimate",
      jsonLd: [
        webPageSchema("Sterova Project Estimator", description, "/estimate"),
        breadcrumbSchema([{ name: "Estimate", path: "/estimate" }]),
      ],
    }),
  component: EstimatePage,
});
