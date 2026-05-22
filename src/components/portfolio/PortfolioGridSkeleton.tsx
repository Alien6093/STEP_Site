/**
 * PortfolioGridSkeleton
 *
 * Shared shimmer placeholder for the portfolio card grid.
 * Used in TWO places:
 *   1. src/app/portfolio/loading.tsx  — Next.js route-level Suspense (hard navigation)
 *   2. src/app/portfolio/page.tsx     — React <Suspense> fallback (component streaming)
 *
 * Keeping both in sync via a single source of truth eliminates layout shift
 * between the two loading contexts.
 */

import { Skeleton } from "@/components/ui/Skeleton";

/* ─── Single card skeleton ────────────────────────────────────────────── */
/*
 * Mirrors StartupCard exactly:
 *   bg-white rounded-2xl p-6 border border-slate-200 flex flex-col h-full
 */
export function StartupCardSkeleton() {
  return (
    <article
      className="bg-white rounded-2xl p-6 border border-slate-200 flex flex-col h-full"
      aria-hidden="true"
    >
      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {/* Logo — w-12 h-12 rounded-xl */}
          <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
          {/* Company name */}
          <Skeleton className="h-5 w-2/3 rounded-lg" />
        </div>
        {/* External-link icon placeholder */}
        <Skeleton className="w-4 h-4 rounded-sm shrink-0 mt-0.5" />
      </div>

      {/* ── Badges ──────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <Skeleton className="h-5 w-20 rounded-full" />
        <Skeleton className="h-5 w-14 rounded-full" />
      </div>

      {/* ── Description (3 lines, trailing line short) ───────────────── */}
      <div className="flex flex-col gap-2 flex-grow">
        <Skeleton className="h-3.5 w-full rounded-md" />
        <Skeleton className="h-3.5 w-full rounded-md" />
        <Skeleton className="h-3.5 w-5/6 rounded-md" />
      </div>

      {/* ── Footer ──────────────────────────────────────────────────── */}
      <div className="border-t border-slate-100 pt-4 mt-6 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Skeleton className="w-3.5 h-3.5 rounded-sm shrink-0" />
          <Skeleton className="h-3 w-48 rounded-md" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="w-3.5 h-3.5 rounded-sm shrink-0" />
          <Skeleton className="h-3 w-24 rounded-md" />
        </div>
      </div>
    </article>
  );
}

/* ─── Filter bar skeleton ─────────────────────────────────────────────── */
export function FilterBarSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      <Skeleton className="h-10 flex-1 rounded-xl" />
      <Skeleton className="h-10 w-full sm:w-44 rounded-xl" />
      <Skeleton className="h-10 w-full sm:w-36 rounded-xl" />
    </div>
  );
}

/* ─── Full grid skeleton (fallback for <Suspense> + loading.tsx) ─────── */

const MOCK_CARD_COUNT = 10;

export function PortfolioGridSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Filter bar */}
      <FilterBarSkeleton />

      {/* Result count placeholder */}
      <Skeleton className="h-4 w-32 rounded-md mb-6" />

      {/* Card grid — identical breakpoints to PortfolioGrid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: MOCK_CARD_COUNT }).map((_, i) => (
          <StartupCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
