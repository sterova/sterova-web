import type { MetadataRoute } from "next";
import { SITE } from "@/data/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/"],
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
