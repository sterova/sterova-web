import { createFileRoute } from "@tanstack/react-router";
import ServiceDetailsPage from "@/pages/ServiceDetailsPage";
import RouteErrorState from "@/components/shared/RouteErrorState";
import NotFoundPage from "@/pages/NotFoundPage";
import {
  seo,
  breadcrumbSchema,
  absoluteUrl,
  privateSeo,
  organizationSchema,
  ORG_ID,
} from "@/lib/seo";
import { fetchServiceBySlug } from "@/lib/api";

export const Route = createFileRoute("/services/$slug")({
  loader: async ({ params, abortController }) => {
    try {
      const service = await fetchServiceBySlug(params.slug, abortController.signal);
      if (!service) return null;
      return service;
    } catch {
      return null;
    }
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) return privateSeo("Service unavailable", "noindex, follow");

    const path = `/services/${params.slug}`;
    return seo({
      title: `${loaderData.title} Services`,
      description: loaderData.overview,
      path,
      type: "article",
      jsonLd: [
        organizationSchema(),
        {
          "@context": "https://schema.org",
          "@type": "Service",
          name: loaderData.title,
          description: loaderData.overview,
          url: absoluteUrl(path),
          serviceType: "Software engineering",
          provider: { "@id": ORG_ID },
        },
        breadcrumbSchema([
          { name: "Services", path: "/services" },
          { name: loaderData.title, path },
        ]),
      ],
    });
  },
  component: ServiceDetailsPage,
  errorComponent: ({ error, reset }) => (
    <RouteErrorState
      error={error}
      reset={reset}
      boundary="service_details_route"
      title="This service failed to load"
      description="We couldn't fetch this service page. Retry, or head back to the services index."
    />
  ),
  notFoundComponent: () => <NotFoundPage />,
});
