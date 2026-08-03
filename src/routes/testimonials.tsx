import { createFileRoute } from "@tanstack/react-router";
import TestimonialsPage from "@/pages/TestimonialsPage";
import { seo, breadcrumbSchema, webPageSchema } from "@/lib/seo";

const description =
  "Real feedback from the startups and enterprises Sterova has built software for — client reviews, ratings, and success stories.";

export const Route = createFileRoute("/testimonials")({
  head: () =>
    seo({
      title: "Client Testimonials & Reviews",
      description,
      path: "/testimonials",
      jsonLd: [
        webPageSchema("Client Testimonials", description, "/testimonials"),
        breadcrumbSchema([{ name: "Testimonials", path: "/testimonials" }]),
      ],
    }),
  component: TestimonialsPage,
});
