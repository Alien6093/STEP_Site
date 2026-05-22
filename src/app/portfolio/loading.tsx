/**
 * loading.tsx — Portfolio Route Skeleton Screen (Hard Navigation)
 *
 * Next.js automatically renders this file as the Suspense fallback for the
 * entire route segment during the initial page load (hard navigation).
 *
 * Architecture note:
 *   - This file covers HARD navigations: browser first loads /portfolio,
 *     Next.js shows this skeleton while it fetches the RSC payload.
 *   - The <Suspense> boundary in page.tsx covers SOFT navigations: client-side
 *     route transitions where the page shell is already rendered.
 *
 * Both share the same skeleton components (PortfolioGridSkeleton) from
 * src/components/portfolio/PortfolioGridSkeleton.tsx — one source of truth,
 * no layout shift between the two loading contexts.
 */

import { Skeleton } from "@/components/ui/Skeleton";
import { PortfolioGridSkeleton } from "@/components/portfolio/PortfolioGridSkeleton";

/* ─── Skeleton for the PortfolioHero section ─────────────────────────── */

function HeroSkeleton() {
  return (
    <section
      className="relative pt-32 pb-20 bg-slate-900 overflow-hidden"
      aria-hidden="true"
    >
      {/* Ambient orbs — kept for visual continuity with the real hero */}
      <div className="absolute w-[400px] h-[400px] rounded-full bg-cyan-500/10 blur-[100px] -top-20 -left-16 pointer-events-none" />
      <div className="absolute w-[300px] h-[300px] rounded-full bg-violet-500/10 blur-[100px] bottom-0 right-0 pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-8 flex flex-col items-center gap-6">
        {/* Breadcrumb */}
        <Skeleton className="h-4 w-28 rounded-full bg-slate-700/60" />

        {/* Eyebrow pill */}
        <Skeleton className="h-7 w-44 rounded-full bg-slate-700/60" />

        {/* Headline */}
        <div className="flex flex-col items-center gap-3 w-full">
          <Skeleton className="h-10 sm:h-12 md:h-14 w-3/4 max-w-md rounded-xl bg-slate-700/60" />
          <Skeleton className="h-10 sm:h-12 md:h-14 w-1/2 max-w-xs rounded-xl bg-slate-700/60" />
        </div>

        {/* Sub-headline */}
        <div className="flex flex-col items-center gap-2 w-full max-w-2xl">
          <Skeleton className="h-4 w-full rounded-md bg-slate-700/60" />
          <Skeleton className="h-4 w-4/5 rounded-md bg-slate-700/60" />
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-6 flex-wrap justify-center mt-2">
          {[80, 56, 72].map((w, i) => (
            <div key={i} className="flex items-center gap-2">
              {i > 0 && (
                <span className="hidden sm:block w-px h-4 bg-slate-700" />
              )}
              <Skeleton className="w-3.5 h-3.5 rounded-sm bg-slate-700/60" />
              <Skeleton className="h-4 rounded-md bg-slate-700/60" style={{ width: `${w}px` }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Full route loading UI ───────────────────────────────────────────── */

export default function PortfolioLoading() {
  return (
    <div className="w-full">
      {/* Hero skeleton — mirrors PortfolioHero */}
      <HeroSkeleton />

      {/*
       * Grid skeleton — imported from the shared component so it is byte-for-byte
       * identical to the <Suspense> fallback in page.tsx, preventing any
       * visual jump when transitioning between loading states.
       */}
      <PortfolioGridSkeleton />
    </div>
  );
}
