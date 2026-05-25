"use client";

/**
 * Global Error Boundary — src/app/error.tsx
 *
 * Next.js App Router renders this component whenever a Server Component
 * in ANY route segment throws an unhandled error. Without this file,
 * users would see a blank white screen in production.
 *
 * Constraints:
 *  - Must be "use client" (React error boundaries are always client-side).
 *  - Receives `error` (the thrown Error) and `reset` (re-renders the segment).
 *  - `error.digest` is a server-generated hash that maps to the full stack
 *    trace in Vercel / server logs without leaking it to the client.
 */

import { useEffect } from "react";
import Link from "next/link";
import { ServerCrash, RefreshCw, Home } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  /* Log to the browser console for local debugging — never shown to users */
  useEffect(() => {
    console.error("[GlobalError] Unhandled application error:", error);
  }, [error]);

  return (
    <div
      className="min-h-screen bg-[#0F172A] flex items-center justify-center px-4 py-16"
      role="alert"
      aria-live="assertive"
    >
      <div className="max-w-md w-full text-center">

        {/* Icon */}
        <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6
                        rounded-2xl bg-red-500/10 border border-red-500/20
                        ring-4 ring-red-500/5">
          <ServerCrash size={36} className="text-red-400" strokeWidth={1.5} />
        </div>

        {/* Heading */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
          Something went wrong
        </h1>

        {/* Body copy */}
        <p className="text-slate-400 text-base leading-relaxed mb-2">
          An unexpected error occurred on our server. Our team has been
          notified. You can try again, or return to the homepage.
        </p>

        {/* Digest — shown only when available; maps to server logs without leaking details */}
        {error.digest && (
          <p className="text-xs text-slate-600 font-mono mb-8">
            Error ID:&nbsp;
            <span className="text-slate-500">{error.digest}</span>
          </p>
        )}

        {!error.digest && <div className="mb-8" />}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">

          {/* Primary — retry */}
          <button
            id="global-error-retry"
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl
                       bg-cyan-400 text-slate-900 text-sm font-semibold
                       hover:bg-cyan-300 hover:shadow-lg hover:shadow-cyan-400/20
                       hover:-translate-y-0.5 transition-all duration-200 w-full sm:w-auto"
          >
            <RefreshCw size={15} />
            Try again
          </button>

          {/* Secondary — go home */}
          <Link
            id="global-error-home"
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl
                       text-slate-300 text-sm font-medium border border-slate-700
                       hover:text-white hover:border-slate-500 hover:bg-slate-800
                       hover:-translate-y-0.5 transition-all duration-200 w-full sm:w-auto"
          >
            <Home size={15} />
            Return to homepage
          </Link>
        </div>

        {/* Subtle brand stamp */}
        <p className="mt-10 text-xs text-slate-700 tracking-wide">
          JSS STEP Incubation Centre
        </p>
      </div>
    </div>
  );
}
