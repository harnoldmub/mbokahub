import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  const appUrl = getSiteUrl();
  return {
    rules: [
      {
        allow: "/",
        disallow: ["/admin/", "/dashboard/", "/api/", "/checkout/"],
        userAgent: "*",
      },
    ],
    host: appUrl,
    sitemap: `${appUrl}/sitemap.xml`,
  };
}
