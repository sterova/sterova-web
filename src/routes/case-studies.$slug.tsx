import { createFileRoute } from "@tanstack/react-router";
import CaseStudyDetailsPage from "@/pages/CaseStudyDetailsPage";
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
import { fetchCaseStudyBySlug } from "@/lib/api";

export const Route = createFileRoute("/case-studies/$slug")({
  loader: async ({ params, abortController }) => {
    try {
      const study = await fetchCaseStudyBySlug(params.slug, abortController.signal);
      if (!study) return null;
      return study;
    } catch {
      return null;
    }
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) return privateSeo("Case Study unavailable", "noindex, follow");

    const path = `/case-studies/${params.slug}`;
    return seo({
      title: `${loaderData.title} | Case Study`,
      description: loaderData.problem,
      path,
      type: "article",
      image: loaderData.cover_image,
      jsonLd: [
        organizationSchema(),
        {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: loaderData.title,
          description: loaderData.problem,
          image: loaderData.cover_image ? absoluteUrl(loaderData.cover_image) : undefined,
          mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(path) },
          publisher: { "@id": ORG_ID },
        },
        breadcrumbSchema([
          { name: "Case Studies", path: "/case-studies" },
          { name: loaderData.title, path },
        ]),
      ],
    });
  },
  component: CaseStudyDetailsPage,
  errorComponent: ({ error, reset }) => (
    <RouteErrorState
      error={error}
      reset={reset}
      boundary="case_study_details_route"
      title="This case study failed to load"
      description="We couldn't fetch this case study. Retry, or head back to the case studies index."
    />
  ),
  notFoundComponent: () => <NotFoundPage />,
});
