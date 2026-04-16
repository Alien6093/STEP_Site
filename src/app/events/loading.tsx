/* ─── /events loading skeleton ───────────────────────────────────────── */

function SkeletonEventCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 flex flex-col gap-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-5 w-20 bg-slate-100 rounded-full" />
        <div className="h-4 w-24 bg-slate-100 rounded" />
      </div>
      <div className="h-6 bg-slate-100 rounded w-4/5" />
      <div className="space-y-2">
        <div className="h-3 bg-slate-100 rounded w-full" />
        <div className="h-3 bg-slate-100 rounded w-3/4" />
      </div>
      <div className="space-y-1.5 mt-auto">
        <div className="h-3 bg-slate-100 rounded w-2/5" />
        <div className="h-3 bg-slate-100 rounded w-3/5" />
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <div className="w-full">
      {/* Hero skeleton */}
      <div className="pt-32 pb-16 bg-slate-900 flex flex-col items-center gap-4 px-4">
        <div className="h-4 w-36 bg-slate-700 rounded-full animate-pulse" />
        <div className="h-10 w-2/3 max-w-lg bg-slate-700 rounded-xl animate-pulse" />
        <div className="h-5 w-1/2 max-w-md bg-slate-800 rounded-lg animate-pulse" />
      </div>

      {/* Cards skeleton */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonEventCard key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
