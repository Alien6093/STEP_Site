"use client";

import { Target, Eye } from "lucide-react";
import ScrollFadeIn from "@/components/shared/ScrollFadeIn";

/* ─── Data ───────────────────────────────────────────────────────────── */

const CARDS = [
  {
    icon: Target,
    heading: "Our Mission",
    accent: "text-cyan-600 bg-cyan-50",
    body: "To meticulously identify, deeply engage, and steadfastly hand-hold potential innovations. We are committed to building a world-class knowledge pool of mentors to support founders in robust capacity building.",
  },
  {
    icon: Eye,
    heading: "Our Vision",
    accent: "text-violet-600 bg-violet-50",
    body: "Nourishing entrepreneurial spirit in technocrats for achieving global excellence. We aim to be the premier launchpad for deep-tech innovation in India.",
  },
] as const;

/* ─── Section ────────────────────────────────────────────────────────── */

export default function MissionVision() {
  return (
    <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-white" aria-label="Mission and Vision">
      <div className="max-w-5xl mx-auto">
        <ScrollFadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {CARDS.map(({ icon: Icon, heading, accent, body }) => (
              <div
                key={heading}
                className="bg-slate-50 rounded-3xl p-10 border border-slate-100
                           hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                {/* Icon */}
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-6 ${accent}`}
                >
                  <Icon size={22} strokeWidth={1.75} />
                </div>

                {/* Heading */}
                <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">
                  {heading}
                </h2>

                {/* Body */}
                <p className="text-base text-slate-500 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </ScrollFadeIn>
      </div>
    </section>
  );
}
