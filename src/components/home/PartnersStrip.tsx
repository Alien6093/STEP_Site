"use client";

import ScrollFadeIn from "@/components/shared/ScrollFadeIn";

/* ─── Data ───────────────────────────────────────────────────────────── */

const PARTNERS = [
  { name: "DST",                 abbr: "DST" },
  { name: "Startup India",       abbr: "STARTUP INDIA" },
  { name: "NIDHI PRAYAS",        abbr: "NIDHI PRAYAS" },
  { name: "JSS Mahavidyapeetha", abbr: "JSSPEETHA" },
  { name: "MSME",                abbr: "MSME" },
  { name: "ASSOCHAM",            abbr: "ASSOCHAM" },
];

/* ─────────────────────────────────────────────────────────────────────
   Duplicate the set so the -50% translate creates a seamless loop:
   [A B C D E F] [A B C D E F]  →  translateX(-50%)  →  seamless
───────────────────────────────────────────────────────────────────── */
const MARQUEE_ITEMS = [...PARTNERS, ...PARTNERS];

/* ─── Section ────────────────────────────────────────────────────────── */

export default function PartnersStrip() {
  return (
    <section
      className="py-16 bg-white border-t border-slate-100"
      aria-label="Ecosystem Partners"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-8">

        {/* Label */}
        <ScrollFadeIn>
          <p className="text-center text-sm font-semibold tracking-widest uppercase
                        text-slate-400 mb-10">
            Backed by Ecosystem Leaders
          </p>
        </ScrollFadeIn>

        {/* Marquee container */}
        <div className="relative overflow-hidden">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          <div
            className="flex items-center gap-8 sm:gap-16 w-max
                       animate-[marquee_30s_linear_infinite]
                       hover:[animation-play-state:paused]"
            aria-hidden="true"
          >
            {MARQUEE_ITEMS.map(({ name, abbr }, i) => (
              <span
                key={`${name}-${i}`}
                title={name}
                className="font-black text-xl md:text-2xl text-slate-300
                           hover:text-slate-600 transition-colors duration-300
                           cursor-default select-none tracking-tight shrink-0"
              >
                {abbr}
              </span>
            ))}
          </div>
        </div>

        {/* Accessible version for screen readers */}
        <ul className="sr-only">
          {PARTNERS.map(({ name }) => (
            <li key={name}>{name}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

