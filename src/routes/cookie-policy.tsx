import { createFileRoute } from "@tanstack/react-router";
import CookiePolicyPage from "@/pages/CookiePolicyPage";
import { seo, breadcrumbSchema, webPageSchema } from "@/lib/seo";

const description = "How Sterova uses cookies and similar tracking technologies on this website.";

export const Route = createFileRoute("/cookie-policy")({
  head: () =>
    seo({
      title: "Cookie Policy",
      description,
      path: "/cookie-policy",
      jsonLd: [
        webPageSchema("Cookie Policy", description, "/cookie-policy"),
        breadcrumbSchema([{ name: "Cookie Policy", path: "/cookie-policy" }]),
      ],
    }),
  component: CookiePolicyPage,
});
