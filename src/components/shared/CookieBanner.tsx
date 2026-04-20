"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X } from "lucide-react";

/* ─── Constants ───────────────────────────────────────────────────────── */

const STORAGE_KEY = "jss_step_cookie_consent";

/* ─── Component ───────────────────────────────────────────────────────── */

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  /* Check localStorage on mount — only runs client-side */
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        /* Small delay so it doesn't flash immediately on paint */
        const timer = setTimeout(() => setIsVisible(true), 800);
        return () => clearTimeout(timer);
      }
    } catch {
      /* localStorage unavailable (private mode / SSR guard) */
    }
  }, []);

  const dismiss = (choice: "accepted" | "declined") => {
    try {
      localStorage.setItem(STORAGE_KEY, choice);
    } catch {
      /* Fail silently */
    }
    setIsVisible(false);
  };

  const acceptCookies  = () => dismiss("accepted");
  const declineCookies = () => dismiss("declined");

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="cookie-banner"
          initial={{ y: "110%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "110%", opacity: 0 }}
          transition={{ type: "spring", stiffness: 220, damping: 26 }}
          className="fixed bottom-0 left-0 w-full z-50 p-3 sm:p-4"
          role="dialog"
          aria-label="Cookie consent"
          aria-live="polite"
        >
          <div
            className="max-w-4xl mx-auto
                       bg-slate-900 border border-slate-700/80
                       shadow-2xl shadow-slate-950/60
                       rounded-2xl p-4 sm:p-6
                       flex flex-col sm:flex-row items-start sm:items-center
                       justify-between gap-4"
          >
            {/* Icon + text */}
            <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
              <div className="shrink-0 w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20
                              flex items-center justify-center mt-0.5 sm:mt-0">
                <Cookie size={17} className="text-cyan-400" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white">
                  We use cookies
                </p>
                <p className="text-xs sm:text-sm text-slate-400 mt-0.5 leading-relaxed">
                  We use cookies to enhance your browsing experience and analyze site traffic.
                  Read our{" "}
                  <a
                    href="/privacy"
                    className="underline text-slate-300 hover:text-cyan-400 transition-colors"
                  >
                    Privacy Policy
                  </a>
                  .
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
              {/* Decline */}
              <button
                type="button"
                onClick={declineCookies}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5
                           px-4 py-2.5 rounded-xl text-sm font-medium
                           text-slate-400 border border-slate-700
                           hover:text-slate-200 hover:border-slate-500 hover:bg-slate-800
                           transition-all duration-150"
              >
                Decline
              </button>

              {/* Accept All */}
              <button
                type="button"
                onClick={acceptCookies}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5
                           px-5 py-2.5 rounded-xl text-sm font-semibold
                           bg-cyan-400 text-slate-900
                           hover:bg-cyan-300 hover:shadow-lg hover:shadow-cyan-400/20
                           active:scale-[0.97] transition-all duration-150"
              >
                Accept All
              </button>

              {/* Dismiss X — desktop shortcut */}
              <button
                type="button"
                onClick={declineCookies}
                aria-label="Dismiss cookie banner"
                className="hidden sm:flex items-center justify-center
                           w-8 h-8 rounded-lg text-slate-600
                           hover:text-slate-300 hover:bg-slate-800
                           transition-colors duration-150"
              >
                <X size={15} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
