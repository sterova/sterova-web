import { createFileRoute } from "@tanstack/react-router";
import CareersPage from "@/pages/CareersPage";
import { seo, breadcrumbSchema, webPageSchema } from "@/lib/seo";

const description =
  "Join Sterova. Open engineering and design roles for people who like owning what they ship.";

export const Route = createFileRoute("/careers")({
  head: () =>
    seo({
      title: "Careers",
      description,
      path: "/careers",
      jsonLd: [
        webPageSchema("Careers at Sterova", description, "/careers"),
        breadcrumbSchema([{ name: "Careers", path: "/careers" }]),
      ],
    }),
  component: CareersPage,
});
