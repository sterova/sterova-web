import { createFileRoute } from "@tanstack/react-router";
import PressKitPage from "@/pages/PressKitPage";
import { seo, breadcrumbSchema, webPageSchema } from "@/lib/seo";

const description =
  "Sterova press kit: official logos, brand assets, boilerplate copy, leadership bios, and media contact information.";

export const Route = createFileRoute("/press-kit")({
  head: () =>
    seo({
      title: "Press Kit & Brand Assets",
      description,
      path: "/press-kit",
      jsonLd: [
        webPageSchema("Press Kit", description, "/press-kit"),
        breadcrumbSchema([
          { name: "Resources", path: "/resources" },
          { name: "Press Kit", path: "/press-kit" },
        ]),
      ],
    }),
  component: PressKitPage,
});
