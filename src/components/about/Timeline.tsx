"use client";

import SectionHeading from "@/components/shared/SectionHeading";
import ScrollFadeIn from "@/components/shared/ScrollFadeIn";

/* ─── Data ───────────────────────────────────────────────────────────── */

const MILESTONES = [
  {
    year: "2000",
    title: "The Genesis",
    description:
      "JSS STEP was established with the steadfast support of JSS Mahavidyapeetha, laying the foundation for a world-class Technology Business Incubator within the JSSATEN campus.",
    accent: "bg-cyan-500",
  },
  {
    year: "2004",
    title: "First TBI Recognition",
    description:
      "Officially recognised and supported by the Department of Science & Technology (DST), Govt. of India — becoming one of India's first formally recognised Technology Business Incubators.",
    accent: "bg-violet-500",
  },
  {
    year: "2019+",
    title: "Ecosystem Expansion",
    description:
      "Expanded to support 300+ startups with dedicated seed funding through NIDHI PRAYAS and Start In UP, building a thriving deep-tech innovation cluster in the NCR.",
    accent: "bg-emerald-500",
  },
  {
    year: "2025–26",
    title: "Deep-Tech Focus",
    description:
      "Scaling the next generation of AI, Clean-Tech, EV, and Health-Tech startups via structured acceleration programs and national VC partnerships.",
    accent: "bg-orange-500",
  },
] as const;

/* ─── Section ────────────────────────────────────────────────────────── */

export default function Timeline() {
  return (
    <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-slate-50" aria-labelledby="timeline-heading">
      <div className="max-w-5xl mx-auto">

        <ScrollFadeIn>
          <SectionHeading
            label="Our Legacy"
            title={<span id="timeline-heading">Two Decades of Innovation</span>}
            align="center"
            className="mb-16"
          />
        </ScrollFadeIn>

        {/* Timeline container */}
        <div className="relative">

          {/* Vertical spine — left-aligned for both mobile and desktop */}
          <div
            className="absolute left-6 md:left-8 top-0 bottom-0 w-0.5 bg-slate-200"
            aria-hidden
          />

          <div className="flex flex-col gap-10 md:gap-12">
            {MILESTONES.map((milestone, i) => (
              <ScrollFadeIn key={milestone.year} delay={i * 0.12}>
                <div className="relative pl-16 md:pl-20">

                  {/* Dot node — overlaps spine */}
                  <div
                    className={`absolute left-[18px] md:left-[26px] top-6 w-4 h-4 rounded-full
                                border-2 border-white shadow-md z-10 ${milestone.accent}`}
                    aria-hidden
                  />

                  {/* Card */}
                  <div
                    className="bg-white rounded-2xl border border-slate-100 p-6 md:p-7
                               shadow-sm hover:shadow-md transition-shadow duration-300"
                  >
                    {/* Year badge */}
                    <span
                      className={`inline-block text-xs sm:text-sm font-bold px-3 py-1 rounded-full
                                  text-white mb-3 ${milestone.accent}`}
                    >
                      {milestone.year}
                    </span>

                    <h3 className="text-lg font-bold text-slate-900 mb-2">
                      {milestone.title}
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      {milestone.description}
                    </p>
                  </div>
                </div>
              </ScrollFadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
