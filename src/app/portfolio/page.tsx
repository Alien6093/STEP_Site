/**
 * Route Segment Config — Incremental Static Regeneration
 *
 * Caches the fully-rendered HTML + RSC payload for up to 1 hour (3 600 s).
 * After expiry the next request triggers a background regeneration while
 * the stale page is served immediately (stale-while-revalidate semantics).
 *
 * Why ISR instead of force-dynamic?
 *   The portfolio dataset changes infrequently; serving a cached version is
 *   perfectly acceptable and dramatically reduces cold-start latency and
 *   Sanity API quota usage.
 *
 * Why not force-static?
 *   We use `client.fetch` with runtime env vars, so we need at least ISR
 *   rather than full build-time static generation.
 */
export const revalidate = 3600; // regenerate at most once per hour

import { Suspense } from "react";
import { client } from "@/sanity/client";
import { urlFor } from "@/sanity/image";
import type { Startup } from "@/lib/data/startups";
import PortfolioHero from "@/components/portfolio/PortfolioHero";
import PortfolioGrid from "@/components/portfolio/PortfolioGrid";
import { PortfolioGridSkeleton } from "@/components/portfolio/PortfolioGridSkeleton";

export const metadata = {
  title:       "Portfolio — JSS STEP",
  description: "Deep-tech startups incubated and accelerated by JSS STEP.",
};

/* ─── GROQ query ──────────────────────────────────────────────────────── */

const PORTFOLIO_QUERY = `
  *[_type == "portfolio"] | order(cohortYear desc) {
    _id,
    startupName,
    "slug": slug.current,
    founderNames,
    sector,
    description,
    logo,
    websiteUrl,
    status,
    cohortYear,
    isFeatured
  }
`;

/* ─── Sanity result type ──────────────────────────────────────────────── */

interface SanityStartup {
  _id:          string;
  startupName:  string;
  slug:         string;
  founderNames: string | null;
  sector:       string | null;
  description:  string | null;
  logo:         { asset: { _ref: string } } | null;
  websiteUrl:   string | null;
  status:       "Active" | "Acquired" | "Alumni" | "Dead" | null;
  cohortYear:   number | null;
  isFeatured?:  boolean;          // optional — false/undefined on existing docs
}

/* ─── Data layer (async Server Component) ─────────────────────────────── */
/*
 * This is intentionally a separate async function so it can be streamed
 * independently of the page shell.
 *
 * Architecture:
 *   PortfolioPage (sync shell) → renders PortfolioHero instantly
 *                              → suspends at <Suspense fallback={<PortfolioGridSkeleton />}>
 *                                            ↓
 *                              → StartupGridData fetches & streams in the real grid
 *
 * This is the "component-level streaming" pattern (similar to how YouTube
 * shows the page chrome immediately while video recommendations load in).
 */
async function StartupGridData() {
  const sanityData = await client.fetch<SanityStartup[]>(
    PORTFOLIO_QUERY,
    {},
    { next: { revalidate: 3600 } }      // explicit per-fetch TTL — belt & suspenders
  );

  /* Map Sanity shape → existing Startup type used by PortfolioGrid */
  const startups: Startup[] = sanityData.map((item) => ({
    id:          item._id,
    name:        item.startupName,
    slug:        item.slug ?? "",
    founders:    item.founderNames ?? "—",
    sector:      item.sector       ?? "Other",
    description: item.description  ?? "",
    website:     item.websiteUrl   ?? "",
    stage:       (item.status ?? "Active") as Startup["stage"],
    cohortYear:  item.cohortYear != null ? String(item.cohortYear) : String(new Date().getFullYear()),
    logo:        item.logo
      ? urlFor(item.logo).width(120).height(120).fit("crop").url()
      : null,
  }));

  return <PortfolioGrid startups={startups} />;
}

/* ─── Page shell (sync — renders immediately) ─────────────────────────── */
/*
 * PortfolioPage itself is NOT async — it has no awaits.
 * This means the hero section (`PortfolioHero`) streams to the browser
 * immediately, with zero wait for Sanity data.
 *
 * The `<Suspense>` boundary tells React to:
 *   1. Stream the fallback (`<PortfolioGridSkeleton />`) to the browser right away.
 *   2. Resolve `<StartupGridData />` on the server in a concurrent stream.
 *   3. Swap in the real grid when the data is ready, without a full page reload.
 *
 * Note: loading.tsx is intentionally kept alongside this file.
 * It covers the *initial hard navigation* (browser loads the URL for the first
 * time and Next.js hasn't cached the RSC payload yet). The <Suspense> boundary
 * here covers *subsequent soft navigations* (client-side route transitions
 * via the Next.js router). Both layers working together = zero loading spinners.
 */
export default function PortfolioPage() {
  return (
    <div className="w-full">
      {/* Renders synchronously — no data needed, streams instantly */}
      <PortfolioHero />

      {/*
       * Suspense boundary:
       *   - fallback: pulsing skeleton grid (same shimmer UI as loading.tsx)
       *   - children: async StartupGridData server component
       *
       * The hero is already painted when this boundary first suspends,
       * so the user sees meaningful content within milliseconds.
       */}
      <Suspense fallback={<PortfolioGridSkeleton />}>
        <StartupGridData />
      </Suspense>
    </div>
  );
}
