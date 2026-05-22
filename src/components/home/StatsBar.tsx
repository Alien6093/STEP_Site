"use client";

import { SITE_CONFIG } from "@/lib/constants";
import AnimatedNumber from "@/components/shared/AnimatedNumber";
import ScrollFadeIn from "@/components/shared/ScrollFadeIn";

/* ─── Data ───────────────────────────────────────────────────────────── */

/*
 * AnimatedNumber expects a numeric `value` and a string `suffix`.
 * SITE_CONFIG.stats stores combined strings like "300+" or "50L+".
 * parseStat splits them: numeric prefix → value, remainder → suffix.
 */
function parseStat(raw: string): { value: number; suffix: string } {
  const match = raw.match(/^(\d+)(.*)$/);
  return match
    ? { value: parseInt(match[1], 10), suffix: match[2] }
    : { value: 0, suffix: raw };
}

const STATS = [
  {
    ...parseStat(SITE_CONFIG.stats.startupsSupported),
    label: "Startups Supported",
    note: null,
  },
  {
    ...parseStat(SITE_CONFIG.stats.seedFunding),
    label: "Seed Funding (₹)",
    note: "via NIDHI / Start In UP",
  },
  {
    ...parseStat(SITE_CONFIG.stats.successfulExits),
    label: "Successful Exits",
    note: null,
  },
  {
    ...parseStat(SITE_CONFIG.stats.yearsOfLegacy),
    label: "Years of Legacy",
    note: null,
  },
];

/* ─── Component ──────────────────────────────────────────────────────── */

export default function StatsBar() {
  return (
    /* The negative margin creates the hero-overlap effect */
    <div className="relative z-10 -mt-12 px-4 md:px-8">
      <ScrollFadeIn>
        <div
          className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl shadow-slate-200/60
                     border border-slate-100 overflow-hidden py-8 px-4 sm:p-8"
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-6 md:gap-8 w-full">
            {STATS.map((stat, i) => (
              <div
                key={stat.label}
                className="flex flex-col items-center justify-center text-center gap-1"
              >
                {/* Animated number */}
                <p className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900">
                  <AnimatedNumber
                    value={stat.value}
                    suffix={stat.suffix}
                  />
                </p>

                {/* Label */}
                <p className="text-xs sm:text-sm font-medium text-slate-500 text-center">
                  {stat.label}
                </p>

                {/* Optional sub-note */}
                {stat.note && (
                  <p className="text-xs text-cyan-600 font-medium mt-0.5">
                    {stat.note}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </ScrollFadeIn>
    </div>
  );
}
