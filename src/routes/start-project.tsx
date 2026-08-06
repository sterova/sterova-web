import { createFileRoute } from "@tanstack/react-router";
import StartProjectPage from "@/pages/StartProjectPage";
import { seo, breadcrumbSchema, absoluteUrl, ORG_ID } from "@/lib/seo";

const description =
  "Start a project with Sterova — pick a service, share your scope, budget, and timeline, and get a reply within 24 hours. Free consultation included.";

export const Route = createFileRoute("/start-project")({
  validateSearch: (search: Record<string, unknown>) => ({
    service: typeof search.service === "string" ? search.service : undefined,
  }),
  head: () =>
    seo({
      title: "Start a Project — Sterova | Free Consultation Within 24 Hours",
      description,
      path: "/start-project",
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: "Start a Project with Sterova",
          description,
          url: absoluteUrl("/start-project"),
          mainEntity: { "@id": ORG_ID },
        },
        breadcrumbSchema([{ name: "Start a project", path: "/start-project" }]),
      ],
    }),
  component: StartProjectRoute,
});

function StartProjectRoute() {
  const { service } = Route.useSearch();
  return <StartProjectPage serviceSlug={service} />;
}
