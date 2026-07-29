import { createFileRoute } from "@tanstack/react-router";
import NotFoundPage from "@/pages/NotFoundPage";
import { SITE } from "@/data/constants";

export const Route = createFileRoute("/$")({
  head: () => ({
    meta: [
      { title: `Page not found — ${SITE.name}` },
      {
        name: "description",
        content:
          "The page you're looking for doesn't exist. Browse services, portfolio, process and blog instead.",
      },
      { name: "robots", content: "noindex, follow" },
      { property: "og:title", content: `Page not found — ${SITE.name}` },
      {
        property: "og:description",
        content: "This page doesn't exist. Find your way back to the Sterova site.",
      },
    ],
  }),
  component: NotFoundPage,
});
