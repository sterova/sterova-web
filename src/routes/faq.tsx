import { createFileRoute } from "@tanstack/react-router";
import FAQPage from "@/pages/FAQPage";
import { seo, breadcrumbSchema, ORG_ID } from "@/lib/seo";
import { fetchFAQs } from "@/lib/api";

const description =
  "Everything you need to know about how we work, what we charge, and what you can expect when partnering with us.";

export const Route = createFileRoute("/faq")({
  loader: async () => {
    try {
      return await fetchFAQs();
    } catch {
      return [];
    }
  },
  head: ({ loaderData }) => {
    const jsonLd: Record<string, unknown>[] = [breadcrumbSchema([{ name: "FAQ", path: "/faq" }])];

    if (loaderData && loaderData.length > 0) {
      jsonLd.push({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: loaderData.map((f: { question: string; answer: string }) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      });
    }

    return seo({
      title: "Frequently Asked Questions | Sterova Tech",
      description,
      path: "/faq",
      jsonLd,
    });
  },
  component: FAQPage,
});
