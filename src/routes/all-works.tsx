import { createFileRoute } from "@tanstack/react-router";
import AllWorksPage from "@/pages/AllWorksPage";
import { seo } from "@/lib/seo";
import { SITE } from "@/data/constants";

export const Route = createFileRoute("/all-works")({
  component: AllWorksPage,
  head: () => {
    return {
      meta: seo({
        title: "All Works | " + SITE.name,
        description:
          "Explore our portfolio of shipped products, deep-dive case studies, and hear directly from the founders and teams we partner with.",
        path: "/all-works",
      }).meta,
    };
  },
});
