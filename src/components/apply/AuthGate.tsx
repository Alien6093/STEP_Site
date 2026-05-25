"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { LogIn, Loader2, Lock } from "lucide-react";
import MultiStepForm from "@/components/apply/MultiStepForm";
import type { User } from "@supabase/supabase-js";

/**
 * AuthGate
 *
 * Wraps the MultiStepForm with a Supabase session check.
 *
 * States:
 *  1. loading  → subtle skeleton pill (prevents layout shift)
 *  2. authed   → renders <MultiStepForm> with name + email pre-filled
 *  3. anon     → premium dark CTA asking the user to log in
 *
 * Why a separate component instead of checking in page.tsx?
 *   page.tsx is a Server Component (needed for export const metadata).
 *   Auth checks that rely on live Supabase sessions must run client-side.
 *   This wrapper keeps the Server Component boundary clean.
 */

export default function AuthGate() {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  // W3/W4 Audit Fix: tracks whether a live session just expired mid-use.
  const [sessionExpired, setSessionExpired] = useState(false);

  useEffect(() => {
    let mounted = true;

    /*
     * W3 Audit Fix: replaced getSession() with getUser().
     *
     * getSession() reads from the local cookie/storage cache and does NOT
     * re-validate the JWT with the Supabase Auth server. A revoked or expired
     * token could pass this check until onAuthStateChange fires.
     *
     * getUser() makes a network request to Supabase Auth on every mount,
     * eliminating the stale-cache window entirely.
     */
    supabase.auth.getUser().then(({ data }) => {
      if (mounted) {
        setUser(data?.user ?? null);
        setLoading(false);
      }
    }).catch(() => {
      if (mounted) setLoading(false);
    });

    /*
     * W4 Audit Fix: detect SIGNED_OUT while the user had an active session.
     *
     * onAuthStateChange fires for every auth event (SIGNED_IN, SIGNED_OUT,
     * TOKEN_REFRESHED, etc.). If we receive SIGNED_OUT while `user` is
     * non-null, the session expired mid-fill and we set `sessionExpired`
     * so the anon gate can display a contextual warning instead of a
     * silent blank form wipe.
     */
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) return;
        if (event === "SIGNED_OUT") {
          // Only flag expiry if they were previously logged in (mid-use expiry)
          setUser((prev) => {
            if (prev !== null) setSessionExpired(true);
            return null;
          });
        } else {
          setUser(session?.user ?? null);
        }
        setLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  /* ── 1. Loading state ─────────────────────────────────────────────── */
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-10 relative z-10 pb-16">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 md:p-12
                        flex items-center justify-center min-h-[420px]">
          <Loader2 size={32} className="text-cyan-500 animate-spin" />
        </div>
      </div>
    );
  }

  /* ── 2. Anonymous state — auth gate ───────────────────────────────── */
  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-10 relative z-10 pb-16">
        <div
          className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 md:p-16
                     flex flex-col items-center text-center gap-6"
        >
          {/* Session-expiry alert — only shown when a live session expired mid-use */}
          {sessionExpired && (
            <div
              role="alert"
              className="w-full flex items-start gap-3 px-4 py-3 rounded-xl
                         bg-amber-50 border border-amber-200 text-left"
            >
              <span className="text-amber-500 text-lg leading-none mt-0.5" aria-hidden>⚠</span>
              <p className="text-sm text-amber-800 font-medium leading-relaxed">
                Your session expired for your security. Please log in again to continue.
              </p>
            </div>
          )}

          {/* Lock icon */}
          <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center
                          ring-1 ring-slate-700 shadow-lg">
            <Lock size={26} className="text-cyan-400" strokeWidth={1.75} />
          </div>

          {/* Heading */}
          <div className="flex flex-col gap-2 max-w-md">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Sign in to apply
            </h2>
            <p className="text-slate-500 text-base leading-relaxed">
              Please log in or create an account to submit your incubation
              application.
            </p>
          </div>

          {/* CTA */}
          <button
            id="apply-login-cta"
            onClick={() => {
              /*
               * Dispatch a custom event that LoginModal listens for.
               * This avoids prop-drilling through the layout and keeps
               * AuthGate decoupled from the modal implementation.
               * LoginModal must addEventListener("open-login-modal") or
               * we fall back to the URL approach below.
               */
              window.dispatchEvent(new CustomEvent("open-login-modal"));
            }}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full
                       bg-slate-900 text-white text-sm font-semibold
                       hover:bg-cyan-600 hover:shadow-lg hover:shadow-cyan-500/20
                       hover:-translate-y-0.5 transition-all duration-300"
          >
            <LogIn size={16} />
            Log In / Create Account
          </button>

          <p className="text-xs text-slate-400">
            Your progress is saved automatically once you are signed in.
          </p>
        </div>
      </div>
    );
  }

  /* ── 3. Authenticated — extract name + email, render form ─────────── */
  const fullName = user.user_metadata?.full_name
    ?? user.user_metadata?.name
    ?? "";
  const email = user.email ?? "";

  return (
    <MultiStepForm
      initialData={{ fullName, email }}
    />
  );
}
