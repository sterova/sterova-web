import { createFileRoute } from "@tanstack/react-router";
import PricingPage from "@/pages/PricingPage";
import { seo, breadcrumbSchema } from "@/lib/seo";

export const Route = createFileRoute("/pricing")({
  head: () =>
    seo({
      title: "Pricing & Engagement Models | Sterova Tech",
      description:
        "Transparent, value-driven engagement models. Whether you need an entire engineering team or a one-off product build.",
      path: "/pricing",
      jsonLd: [breadcrumbSchema([{ name: "Pricing", path: "/pricing" }])],
    }),
  component: PricingPage,
});
