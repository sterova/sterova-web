import { createFileRoute } from "@tanstack/react-router";
import BlogPage from "@/pages/BlogPage";
import { seo, breadcrumbSchema, absoluteUrl } from "@/lib/seo";

const description =
  "Engineering notes, architecture write-ups, and practical guidance from the Sterova team.";

export const Route = createFileRoute("/blog/")({
  head: () =>
    seo({
      title: "Blog",
      description,
      path: "/blog",
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "Blog",
          name: "Sterova Blog",
          description,
          url: absoluteUrl("/blog"),
        },
        breadcrumbSchema([{ name: "Blog", path: "/blog" }]),
      ],
    }),
  component: BlogPage,
});
