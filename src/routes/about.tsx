import { createFileRoute } from "@tanstack/react-router";
import AboutPage from "@/pages/AboutPage";
import { seo, breadcrumbSchema, webPageSchema } from "@/lib/seo";

const description =
  "Meet the engineering team behind Sterova — how we work, what we value, and why clients keep us on long after launch.";

export const Route = createFileRoute("/about")({
  head: () =>
    seo({
      title: "About Sterova Tech",
      description,
      path: "/about",
      jsonLd: [
        webPageSchema("About Sterova", description, "/about"),
        breadcrumbSchema([{ name: "About", path: "/about" }]),
      ],
    }),
  component: AboutPage,
});
