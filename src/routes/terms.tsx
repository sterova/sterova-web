import { createFileRoute } from "@tanstack/react-router";
import TermsPage from "@/pages/TermsPage";
import { seo, breadcrumbSchema, webPageSchema } from "@/lib/seo";

const description =
  "The terms that govern the use of Sterova's website and engagement with our services.";

export const Route = createFileRoute("/terms")({
  head: () =>
    seo({
      title: "Terms of Service",
      description,
      path: "/terms",
      jsonLd: [
        webPageSchema("Terms of Service", description, "/terms"),
        breadcrumbSchema([{ name: "Terms of Service", path: "/terms" }]),
      ],
    }),
  component: TermsPage,
});
