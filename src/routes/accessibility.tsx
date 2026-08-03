import { createFileRoute } from "@tanstack/react-router";
import AccessibilityPage from "@/pages/AccessibilityPage";
import { seo, breadcrumbSchema, webPageSchema } from "@/lib/seo";

const description =
  "Sterova's commitment to web accessibility and our statement of conformance with WCAG guidelines.";

export const Route = createFileRoute("/accessibility")({
  head: () =>
    seo({
      title: "Accessibility Statement",
      description,
      path: "/accessibility",
      jsonLd: [
        webPageSchema("Accessibility Statement", description, "/accessibility"),
        breadcrumbSchema([{ name: "Accessibility", path: "/accessibility" }]),
      ],
    }),
  component: AccessibilityPage,
});
