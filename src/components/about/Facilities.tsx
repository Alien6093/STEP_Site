"use client";

import { Building2, Briefcase, Cpu, Wrench, type LucideIcon } from "lucide-react";
import ScrollFadeIn from "@/components/shared/ScrollFadeIn";

/* ─── Data ───────────────────────────────────────────────────────────── */

const FACILITIES: { icon: LucideIcon; stat: string; label: string }[] = [
  {
    icon: Building2,
    stat: "18,000 Sq.Ft.",
    label: "Dedicated Incubation Space",
  },
  {
    icon: Briefcase,
    stat: "35+",
    label: "Plug & Play Cabins",
  },
  {
    icon: Cpu,
    stat: "PLM",
    label: "Competency Centre",
  },
  {
    icon: Wrench,
    stat: "CAMT",
    label: "Advanced Manufacturing Labs",
  },
];

/* ─── Section ────────────────────────────────────────────────────────── */

export default function Facilities() {
  return (
    <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white" aria-labelledby="facilities-heading">
      <div className="max-w-6xl mx-auto">

        {/* Heading — forced white palette */}
        <ScrollFadeIn>
          <div className="text-center mb-14">
            <p className="text-sm font-semibold tracking-widest uppercase text-cyan-400 mb-2">
              Infrastructure
            </p>
            <h2
              id="facilities-heading"
              className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4"
            >
              World-Class Facilities
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Located inside the 28-acre lush green campus of JSSATEN, Sector 62, Noida.
            </p>
          </div>
        </ScrollFadeIn>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {FACILITIES.map(({ icon: Icon, stat, label }, i) => (
            <ScrollFadeIn key={label} delay={i * 0.08}>
              <div
                className="p-6 rounded-2xl bg-slate-800 border border-slate-700 text-center
                           hover:-translate-y-2 hover:border-slate-600 hover:bg-slate-750
                           transition-all duration-300 group"
              >
                {/* Icon */}
                <div
                  className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4
                             bg-slate-700 text-slate-300 group-hover:bg-cyan-500/20 group-hover:text-cyan-400
                             transition-colors duration-300"
                >
                  <Icon size={22} strokeWidth={1.75} />
                </div>

                {/* Stat */}
                <p className="text-2xl font-extrabold text-white mb-1 tracking-tight">
                  {stat}
                </p>

                {/* Label */}
                <p className="text-sm text-slate-400 leading-snug">{label}</p>
              </div>
            </ScrollFadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
