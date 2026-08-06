import { createFileRoute } from "@tanstack/react-router";
import BlogPage from "@/pages/BlogPage";
import { seo, breadcrumbSchema, absoluteUrl, ORG_ID } from "@/lib/seo";

const description =
  "Engineering notes, architecture write-ups, and practical guidance from the Sterova team on software development, design, and product engineering.";

export const Route = createFileRoute("/blog/")({
  head: () =>
    seo({
      title: "Blog — Sterova | Engineering Notes & Technical Insights",
      description,
      path: "/blog",
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "Blog",
          name: "Sterova Engineering Blog",
          description,
          url: absoluteUrl("/blog"),
          publisher: { "@id": ORG_ID },
        },
        breadcrumbSchema([{ name: "Blog", path: "/blog" }]),
      ],
    }),
  component: BlogPage,
});
