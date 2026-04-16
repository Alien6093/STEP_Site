"use client";

import { Fragment } from "react";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ScrollFadeIn from "@/components/shared/ScrollFadeIn";

/* ─── Data ───────────────────────────────────────────────────────────── */

const STAGES = [
  {
    step: "01",
    phase: "Pre-Incubation",
    tag: "Idea Stage",
    programs: "NIDHI EIR & BIZZNESS",
    description:
      "Validate your idea, build early prototypes, and discover product-market fit with expert mentorship.",
    href: "/programs#pre-incubation",
    accent: "from-cyan-500 to-blue-500",
  },
  {
    step: "02",
    phase: "Incubation",
    tag: "Build Stage",
    programs: "Core Incubation Track",
    description:
      "Get access to world-class labs, co-working space, and initial seed funding to develop your MVP.",
    href: "/programs#incubation",
    accent: "from-violet-500 to-purple-600",
  },
  {
    step: "03",
    phase: "Acceleration",
    tag: "Scale Stage",
    programs: "Global Startupreneur",
    description:
      "Drive market entry, connect with top-tier VCs, and accelerate international growth.",
    href: "/programs#acceleration",
    accent: "from-orange-400 to-rose-500",
  },
];

/* ─── Card ───────────────────────────────────────────────────────────── */

function ProgramCard({
  step,
  phase,
  tag,
  programs,
  description,
  href,
  accent,
}: (typeof STAGES)[0]) {
  return (
    <div className="flex-1 h-full bg-slate-800 rounded-2xl p-8 border border-slate-700
                    flex flex-col gap-5 hover:border-slate-600 transition-colors duration-300">
      {/* Step pill */}
      <div className="flex items-center justify-between">
        <span
          className={`text-xs font-bold px-3 py-1 rounded-full bg-gradient-to-r ${accent}
                      text-white tracking-wider uppercase`}
        >
          {step}
        </span>
        <span className="text-xs text-slate-500 font-medium tracking-widest uppercase">
          {tag}
        </span>
      </div>

      {/* Heading */}
      <div>
        <h3 className="text-xl font-bold text-white mb-1">{phase}</h3>
        <p className={`text-sm font-semibold bg-clip-text text-transparent bg-gradient-to-r ${accent}`}>
          {programs}
        </p>
      </div>

      {/* Description */}
      <p className="text-sm text-slate-400 leading-relaxed flex-grow">{description}</p>

      {/* CTA */}
      <Link
        href={href}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-300
                   hover:text-white transition-colors duration-200 mt-auto group"
      >
        Learn More
        <ArrowRight
          size={14}
          className="transition-transform duration-200 group-hover:translate-x-1"
        />
      </Link>
    </div>
  );
}

/* ─── Section ────────────────────────────────────────────────────────── */

export default function ProgramsPreview() {
  return (
    <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-slate-900" aria-labelledby="programs-heading">
      <div className="max-w-6xl mx-auto">

        {/* Heading — forced white palette */}
        <ScrollFadeIn>
          <div className="text-center mb-14">
            <p className="text-sm font-semibold tracking-widest uppercase text-purple-400 mb-2">
              Our Programs
            </p>
            <h2
              id="programs-heading"
              className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4"
            >
              Tailored to Every Stage
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
              From raw idea to scalable business, we have a structured path for your startup.
            </p>
          </div>
        </ScrollFadeIn>

        {/* Funnel layout */}
        {/* Desktop */}
        <div className="hidden md:flex items-center justify-between gap-4">
          {STAGES.map((stage, i) => (
            <Fragment key={stage.step}>
              <ScrollFadeIn delay={i * 0.12} className="flex-1">
                <ProgramCard {...stage} />
              </ScrollFadeIn>

              {/* Arrow connector — desktop only */}
              {i < STAGES.length - 1 && (
                <div className="hidden lg:flex items-center justify-center text-slate-600 shrink-0 mx-4">
                  <ArrowRight size={22} />
                </div>
              )}
            </Fragment>
          ))}
        </div>

        {/* Mobile */}
        <div className="flex md:hidden flex-col gap-8 relative">
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-700/50" />
          {STAGES.map((stage, i) => (
            <ScrollFadeIn key={stage.step} delay={i * 0.12} className="pl-14 relative">
              <ProgramCard {...stage} />
            </ScrollFadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
