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
import { PROCESS_STEPS, SERVICES, SITE } from "@/data/constants";
import { getServicePage } from "@/data/service-pages";

export const Route = createFileRoute("/services_/$slug")({
  loader: ({ params }) => {
    const service = SERVICES.find((entry) => entry.slug === params.slug);
    if (!service) return null;

    return {
      id: service.id,
      title: service.title,
      slug: service.slug,
      overview: service.description,
      benefits: service.features,
      process: PROCESS_STEPS.map((step) => step.title),
      display_order: service.display_order,
      is_active: service.is_active,
      created_at: "",
      updated_at: "",
    };
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) return privateSeo("Service unavailable", "noindex, follow");

    const path = `/services/${params.slug}`;
    const page = getServicePage(loaderData.slug);
    const serviceName = page?.title ?? loaderData.title;
    const description = page?.seoDescription ?? loaderData.overview;
    return seo({
      title: page?.seoTitle ?? `${serviceName} Services`,
      description,
      path,
      type: "website",
      jsonLd: [
        organizationSchema(),
        {
          "@context": "https://schema.org",
          "@type": "Service",
          name: serviceName,
          description,
          url: absoluteUrl(path),
          serviceType: serviceName,
          provider: { "@id": ORG_ID },
          areaServed: [
            { "@type": "Country", name: "India" },
            { "@type": "Place", name: "Worldwide" },
          ],
          availableChannel: {
            "@type": "ServiceChannel",
            serviceUrl: absoluteUrl("/start-project"),
            serviceSmsNumber: SITE.phone,
          },
        },
        ...(page?.faqs.length
          ? [
              {
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: page.faqs.map((faq) => ({
                  "@type": "Question",
                  name: faq.question,
                  acceptedAnswer: { "@type": "Answer", text: faq.answer },
                })),
              },
            ]
          : []),
        breadcrumbSchema([
          { name: "Services", path: "/services" },
          { name: serviceName, path },
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
