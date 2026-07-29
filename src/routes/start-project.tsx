import { createFileRoute } from "@tanstack/react-router";
import StartProjectPage from "@/pages/StartProjectPage";
import { seo, breadcrumbSchema, absoluteUrl } from "@/lib/seo";
import { SITE } from "@/data/constants";

const description =
  "Send Sterova a project brief — pick a service, share scope, budget and timeline, and get a reply within 24 hours.";

export const Route = createFileRoute("/start-project")({
  validateSearch: (search: Record<string, unknown>) => ({
    service: typeof search.service === "string" ? search.service : undefined,
  }),
  head: () =>
    seo({
      title: "Start a project",
      description,
      path: "/start-project",
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: "Start a project with Sterova",
          description,
          url: absoluteUrl("/start-project"),
          mainEntity: {
            "@type": "Organization",
            name: SITE.name,
            url: SITE.url,
            email: SITE.email,
          },
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
