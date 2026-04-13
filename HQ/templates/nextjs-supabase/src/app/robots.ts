import type { MetadataRoute } from "next";

// Block indexing on Vercel preview deploys; allow on production.
const isProduction =
  process.env.VERCEL_ENV === "production" ||
  process.env.NODE_ENV === "production";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export default function robots(): MetadataRoute.Robots {
  if (!isProduction) {
    return {
      rules: { userAgent: "*", disallow: "/" },
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // TODO per-client: add private paths here, e.g. ["/dashboard", "/api"]
        disallow: ["/api"],
      },
    ],
    sitemap: `${appUrl}/sitemap.xml`,
  };
}
