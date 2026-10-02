import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { SITE_HOST, SITE_URL } from "@/lib/site";

// Dev and prod run the same image, so decide per request: only the production
// host may be crawled; every other host (dev, stage, previews) is blocked.
export default async function robots(): Promise<MetadataRoute.Robots> {
  const requestHeaders = await headers();
  const host = (requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "")
    .split(",")[0]
    .trim()
    .toLowerCase()
    .replace(/:\d+$/, "");
  const isProduction = host === SITE_HOST || host === `www.${SITE_HOST}`;

  if (!isProduction) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/"] },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
