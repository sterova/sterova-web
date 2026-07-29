import { createFileRoute } from "@tanstack/react-router";
import PrivacyPage from "@/pages/PrivacyPage";
import { seo, breadcrumbSchema, webPageSchema } from "@/lib/seo";

const description = "How Sterova collects, uses, and protects the information you share with us.";

export const Route = createFileRoute("/privacy")({
  head: () =>
    seo({
      title: "Privacy Policy",
      description,
      path: "/privacy",
      jsonLd: [
        webPageSchema("Privacy Policy", description, "/privacy"),
        breadcrumbSchema([{ name: "Privacy Policy", path: "/privacy" }]),
      ],
    }),
  component: PrivacyPage,
});
