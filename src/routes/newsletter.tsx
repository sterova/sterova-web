import { createFileRoute } from "@tanstack/react-router";
import NewsletterPage from "@/pages/NewsletterPage";
import { seo, breadcrumbSchema, webPageSchema } from "@/lib/seo";

const description =
  "Subscribe to the Sterova newsletter — engineering insights, product thinking, and industry updates, delivered monthly.";

export const Route = createFileRoute("/newsletter")({
  head: () =>
    seo({
      title: "Newsletter",
      description,
      path: "/newsletter",
      jsonLd: [
        webPageSchema("Newsletter", description, "/newsletter"),
        breadcrumbSchema([
          { name: "Resources", path: "/resources" },
          { name: "Newsletter", path: "/newsletter" },
        ]),
      ],
    }),
  component: NewsletterPage,
});
