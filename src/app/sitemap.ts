import type { MetadataRoute } from "next";
import { client } from "@/sanity/client";

const BASE_URL = "https://www.jssstepnoida.in";

/**
 * Next.js native sitemap generator.
 * Served at /sitemap.xml — automatically discovered by Google via robots.txt.
 *
 * Priority guidance (0.0 – 1.0):
 *   1.0  Home             — canonical entry point
 *   0.9  Apply            — highest-value conversion page
 *   0.8  Portfolio/Events — freshest content, high crawl value
 *   0.7  Programs         — evergreen, low churn
 *   0.6  About            — trust signal, low churn
 *
 * changeFrequency guidance:
 *   "always"  — real-time data feeds (not applicable here)
 *   "daily"   — blog / news feeds
 *   "weekly"  — portfolio & events (updated regularly via Sanity CMS)
 *   "monthly" — static informational pages
 *   "yearly"  — legal / policy pages
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  /* ── Static routes ──────────────────────────────────────────────────── */

  const staticRoutes: MetadataRoute.Sitemap = [
    /* ── Tier 1 — Core conversion & brand ─────────────────────────────── */
    {
      url:             `${BASE_URL}/`,
      lastModified:    now,
      changeFrequency: "weekly",
      priority:        1.0,
    },
    {
      url:             `${BASE_URL}/apply`,
      lastModified:    now,
      changeFrequency: "monthly",
      priority:        0.9,
    },

    /* ── Tier 2 — High-value content (CMS-driven, updated frequently) ─── */
    {
      url:             `${BASE_URL}/portfolio`,
      lastModified:    now,
      changeFrequency: "weekly",
      priority:        0.8,
    },
    {
      url:             `${BASE_URL}/events`,
      lastModified:    now,
      changeFrequency: "weekly",
      priority:        0.8,
    },
    {
      url:             `${BASE_URL}/mentors`,
      lastModified:    now,
      changeFrequency: "weekly",
      priority:        0.8,
    },

    /* ── Tier 3 — Evergreen informational ─────────────────────────────── */
    {
      url:             `${BASE_URL}/programs`,
      lastModified:    now,
      changeFrequency: "monthly",
      priority:        0.7,
    },
    {
      url:             `${BASE_URL}/ecosystem`,
      lastModified:    now,
      changeFrequency: "monthly",
      priority:        0.7,
    },
    {
      url:             `${BASE_URL}/resources`,
      lastModified:    now,
      changeFrequency: "monthly",
      priority:        0.6,
    },
    {
      url:             `${BASE_URL}/about`,
      lastModified:    now,
      changeFrequency: "monthly",
      priority:        0.6,
    },
  ];

  /* ── Dynamic mentor routes (from Sanity CMS) ────────────────────────── */

  let mentorRoutes: MetadataRoute.Sitemap = [];
  try {
    const mentors = await client.fetch<{ slug: string }[]>(
      `*[_type == "mentor" && defined(slug.current)]{ "slug": slug.current }`
    );
    mentorRoutes = mentors.map((m) => ({
      url:             `${BASE_URL}/mentors/${m.slug}`,
      lastModified:    now,
      changeFrequency: "monthly" as const,
      priority:        0.7,
    }));
  } catch (error) {
    /*
     * Graceful degradation: if the Sanity fetch fails (network error, timeout,
     * or missing env vars during build), the sitemap still returns all static
     * routes. The build does NOT crash. Individual mentor pages will still be
     * discovered by Google via the /mentors listing page crawl.
     */
    console.error("[sitemap] Failed to fetch mentor slugs from Sanity:", error);
  }

  return [...staticRoutes, ...mentorRoutes];
}
