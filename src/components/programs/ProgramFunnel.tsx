"use client";

import { Fragment } from "react";

import { Lightbulb, FlaskConical, Rocket, Globe, type LucideIcon } from "lucide-react";
import SectionHeading from "@/components/shared/SectionHeading";
import ScrollFadeIn from "@/components/shared/ScrollFadeIn";

/* ─── Data ───────────────────────────────────────────────────────────── */

const STAGES: {
  icon: LucideIcon;
  step: string;
  label: string;
  program: string;
  description: string;
  accent: string;
  iconBg: string;
}[] = [
  {
    icon: Lightbulb,
    step: "01",
    label: "Idea",
    program: "NIDHI EIR & BIZZNESS",
    description: "Validate your idea, discover product-market fit, and form your founding team.",
    accent: "text-yellow-600",
    iconBg: "bg-yellow-50 border-yellow-200",
  },
  {
    icon: FlaskConical,
    step: "02",
    label: "Pre-Incubation",
    program: "Prototyping & MVP",
    description: "Build functional prototypes using our PLM labs and CAMT manufacturing centre.",
    accent: "text-cyan-600",
    iconBg: "bg-cyan-50 border-cyan-200",
  },
  {
    icon: Rocket,
    step: "03",
    label: "Incubation",
    program: "Seed Funding up to ₹50L & Go-To-Market",
    description: "Secure seed funding, access co-working space, IP support, and GTM strategy.",
    accent: "text-violet-600",
    iconBg: "bg-violet-50 border-violet-200",
  },
  {
    icon: Globe,
    step: "04",
    label: "Acceleration",
    program: "Global Startupreneur & Scaling",
    description: "Enter global markets, network with top VCs, and scale your business internationally.",
    accent: "text-emerald-600",
    iconBg: "bg-emerald-50 border-emerald-200",
  },
];

/* ─── Stage Node ─────────────────────────────────────────────────────── */

function StageNode({
  icon: Icon,
  step,
  label,
  program,
  description,
  accent,
  iconBg,
}: (typeof STAGES)[0]) {
  return (
    <div className="flex flex-col items-start md:items-center text-left md:text-center gap-3 flex-1 min-w-0 px-2 lg:items-center lg:text-center">
      {/* Circle icon */}
      <div
        className={`w-16 h-16 rounded-full border-2 flex items-center justify-center
                    shrink-0 ${iconBg} ${accent} transition-transform duration-300
                    hover:scale-110`}
      >
        <Icon size={24} strokeWidth={1.75} />
      </div>

      {/* Step number */}
      <span className="text-xs font-bold tracking-widest text-slate-400 uppercase">
        Step {step}
      </span>

      {/* Label */}
      <h3 className={`text-base font-bold ${accent}`}>{label}</h3>

      {/* Program name */}
      <p className="text-xs font-semibold text-slate-500 leading-snug">{program}</p>

      {/* Description */}
      <p className="text-xs text-slate-400 leading-relaxed max-w-[160px]">{description}</p>
    </div>
  );
}

/* ─── Connector ──────────────────────────────────────────────────────── */

function Connector() {
  return (
    <div
      className="hidden lg:flex items-center justify-center w-10 shrink-0 self-start mt-8"
      aria-hidden
    >
      <div className="w-full border-t-2 border-dashed border-slate-300" />
    </div>
  );
}

/* ─── Section ────────────────────────────────────────────────────────── */

export default function ProgramFunnel() {
  return (
    <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-slate-50" aria-labelledby="funnel-heading">
      <div className="max-w-6xl mx-auto">

        <ScrollFadeIn>
          <SectionHeading
            title={<span id="funnel-heading">The Incubation Journey</span>}
            subtitle="A structured path to turn your innovation into a global enterprise."
            align="center"
            className="mb-14"
          />
        </ScrollFadeIn>

        {/* Funnel row */}
        {/* Desktop */}
        <div className="hidden md:flex items-center justify-between gap-4">
          {STAGES.map((stage, i) => (
            <Fragment key={stage.step}>
              <ScrollFadeIn delay={i * 0.1}>
                <StageNode {...stage} />
              </ScrollFadeIn>
              {i < STAGES.length - 1 && <Connector />}
            </Fragment>
          ))}
        </div>

        {/* Mobile */}
        <div className="flex md:hidden flex-col gap-6 relative">
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-300" />
          {STAGES.map((stage, i) => (
            <ScrollFadeIn key={stage.step} delay={i * 0.1} className="pl-14 relative w-full">
              <StageNode {...stage} />
            </ScrollFadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
