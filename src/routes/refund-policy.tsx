import { createFileRoute } from "@tanstack/react-router";
import RefundPolicyPage from "@/pages/RefundPolicyPage";
import { seo, breadcrumbSchema, webPageSchema } from "@/lib/seo";

const description =
  "Sterova's refund and cancellation policy for software development and retainer engagements.";

export const Route = createFileRoute("/refund-policy")({
  head: () =>
    seo({
      title: "Refund Policy",
      description,
      path: "/refund-policy",
      jsonLd: [
        webPageSchema("Refund Policy", description, "/refund-policy"),
        breadcrumbSchema([{ name: "Refund Policy", path: "/refund-policy" }]),
      ],
    }),
  component: RefundPolicyPage,
});
