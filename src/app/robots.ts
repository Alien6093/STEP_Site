import type { MetadataRoute } from "next";

/**
 * Next.js native robots.ts — served at /robots.txt.
 *
 * Policy:
 *   - All public user agents may crawl all public routes.
 *   - Private/operational routes are disallowed to prevent indexing of
 *     auth-gated dashboards, API internals, and the Sanity Studio.
 *   - Sitemap URL is declared for automated discovery by Google/Bing.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow:     "/",
        disallow:  [
          "/api/",           // API routes — never index
          "/dashboard/",     // auth-gated user dashboards
          "/studio/",        // Sanity Studio — internal CMS
          "/_next/",         // Next.js build assets
        ],
      },
    ],
    sitemap: "https://www.jssstepnoida.in/sitemap.xml",
  };
}
