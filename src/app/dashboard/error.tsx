"use client";

/**
 * Dashboard Error Boundary — src/app/dashboard/error.tsx
 *
 * Scoped to the /dashboard segment only. Next.js renders this instead of
 * the global error.tsx when a Server Component inside /dashboard/ throws.
 *
 * Key design decision: this renders INSIDE the dashboard layout (beside the
 * sidebar), so it must NOT be full-screen. A card UI fits the available
 * content column naturally without breaking the surrounding nav chrome.
 *
 * Constraints:
 *  - Must be "use client" (React error boundaries are always client-side).
 *  - dashboard/layout.tsx is already "use client" — the error boundary is
 *    separate so Next.js can independently unmount/remount the failed segment
 *    without re-mounting the whole layout.
 */

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, Home } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  /* Log locally for debugging — server digest maps to full trace in logs */
  useEffect(() => {
    console.error("[DashboardError] Segment error:", error);
  }, [error]);

  return (
    <div
      className="w-full flex items-start justify-center pt-4"
      role="alert"
      aria-live="assertive"
    >
      <div
        className="w-full max-w-lg bg-white rounded-2xl border border-red-100
                   shadow-lg shadow-red-50/60 p-8 text-center"
      >
        {/* Icon */}
        <div className="flex items-center justify-center w-14 h-14 mx-auto mb-5
                        rounded-xl bg-red-50 border border-red-100">
          <AlertCircle size={28} className="text-red-400" strokeWidth={1.75} />
        </div>

        {/* Heading */}
        <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-2">
          Dashboard failed to load
        </h2>

        {/* Body */}
        <p className="text-sm text-slate-500 leading-relaxed mb-2">
          An error occurred while loading this page. Your data is safe —
          try reloading, or return to the homepage if the problem persists.
        </p>

        {/* Digest */}
        {error.digest && (
          <p className="text-[11px] text-slate-400 font-mono mb-6">
            Ref:&nbsp;
            <span className="text-slate-500">{error.digest}</span>
          </p>
        )}

        {!error.digest && <div className="mb-6" />}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">

          {/* Primary — reload the failed segment only */}
          <button
            id="dashboard-error-reload"
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
                       bg-slate-900 text-white text-sm font-semibold
                       hover:bg-cyan-600 hover:shadow-md hover:shadow-cyan-500/20
                       hover:-translate-y-0.5 transition-all duration-200 w-full sm:w-auto"
          >
            <RefreshCw size={14} />
            Reload Dashboard
          </button>

          {/* Secondary — escape to homepage */}
          <Link
            id="dashboard-error-home"
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
                       text-slate-500 text-sm font-medium border border-slate-200
                       hover:text-slate-800 hover:border-slate-300 hover:bg-slate-50
                       hover:-translate-y-0.5 transition-all duration-200 w-full sm:w-auto"
          >
            <Home size={14} />
            Go to homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
