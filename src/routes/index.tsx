import { createFileRoute } from "@tanstack/react-router";
import HomePage from "@/pages/HomePage";
import { SITE, FAQS } from "@/data/constants";
import { seo, webPageSchema } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () =>
    seo({
      title: `${SITE.name} — ${SITE.tagline}`,
      description: SITE.description,
      path: "/",
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "Organization",
          "@id": "https://sterova.tech/#organization",
          "name": "Sterova",
          "url": "https://sterova.tech",
          "logo": {
            "@type": "ImageObject",
            "url": "https://sterova.tech/logo.png",
            "width": 512,
            "height": 512
          },
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+91-97864-75035",
            "contactType": "customer service",
            "areaServed": "Worldwide",
            "availableLanguage": "English"
          },
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Dindigul",
            "addressRegion": "Tamil Nadu",
            "addressCountry": "IN"
          },
          "sameAs": [
            "https://www.linkedin.com/company/sterova",
            "https://github.com/sterova",
            "https://x.com/sterova"
          ]
        },
        {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "@id": "https://sterova.tech/#website",
          "url": "https://sterova.tech",
          "name": "Sterova",
          "publisher": {
            "@id": "https://sterova.tech/#organization"
          },
          "inLanguage": "en-US"
        },
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "@id": "https://sterova.tech/#faq",
          "mainEntity": FAQS.slice(0, 6).map((faq) => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": faq.answer
            }
          }))
        }
      ],
    }),
  component: HomePage,
});
