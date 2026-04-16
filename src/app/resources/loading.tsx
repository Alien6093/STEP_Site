/* ─── /resources loading skeleton ───────────────────────────────────── */

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 flex items-center gap-4 animate-pulse">
      <div className="w-12 h-12 rounded-xl bg-slate-100 shrink-0" />
      <div className="flex flex-col gap-2 flex-1 min-w-0">
        <div className="h-4 bg-slate-100 rounded w-3/4" />
        <div className="h-3 bg-slate-100 rounded w-full" />
        <div className="h-3 bg-slate-100 rounded w-1/2" />
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <div className="w-full">
      {/* Hero skeleton */}
      <div className="pt-32 pb-16 bg-slate-900 flex flex-col items-center gap-4 px-4">
        <div className="h-4 w-32 bg-slate-700 rounded-full animate-pulse" />
        <div className="h-10 w-2/3 max-w-md bg-slate-700 rounded-xl animate-pulse" />
        <div className="h-5 w-1/2 max-w-sm bg-slate-800 rounded-lg animate-pulse" />
      </div>

      {/* Cards skeleton */}
      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-16 space-y-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
