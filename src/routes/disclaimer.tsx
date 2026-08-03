import { createFileRoute } from "@tanstack/react-router";
import DisclaimerPage from "@/pages/DisclaimerPage";
import { seo, breadcrumbSchema, webPageSchema } from "@/lib/seo";

const description =
  "Legal disclaimer for information published on the Sterova website and in our communications.";

export const Route = createFileRoute("/disclaimer")({
  head: () =>
    seo({
      title: "Disclaimer",
      description,
      path: "/disclaimer",
      jsonLd: [
        webPageSchema("Disclaimer", description, "/disclaimer"),
        breadcrumbSchema([{ name: "Disclaimer", path: "/disclaimer" }]),
      ],
    }),
  component: DisclaimerPage,
});
