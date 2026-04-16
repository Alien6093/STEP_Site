import type { Metadata } from "next";
import ProgramHero from "@/components/programs/ProgramHero";
import ProgramFunnel from "@/components/programs/ProgramFunnel";
import ProgramCard from "@/components/programs/ProgramCard";
import EligibilityCriteria from "@/components/programs/EligibilityCriteria";
import ProgramFAQ from "@/components/programs/ProgramFAQ";
import ScrollFadeIn from "@/components/shared/ScrollFadeIn";

/* ─── Metadata ───────────────────────────────────────────────────────── */

export const metadata: Metadata = {
  title: "Programs | JSS STEP",
  description:
    "Explore JSS STEP's incubation programs — NIDHI EIR, Core Incubation, and BIZZNESS — designed to support every stage of your deep-tech startup journey.",
};

/* ─── Program data ───────────────────────────────────────────────────── */

const PROGRAMS = [
  {
    title: "NIDHI EIR",
    tagline:
      "The Entrepreneur-in-Residence program connects researchers and innovators with grant funding and structured mentorship to validate their deep-tech ideas.",
    duration: "12 Months",
    funding: "Grant up to ₹3.6L/year",
    benefits: [
      "Monthly fellowship stipend for focused work",
      "Full access to JSS STEP laboratory infrastructure",
      "1-on-1 mentorship with industry veterans and IIT alumni",
      "IP & legal advisory for early-stage innovations",
      "Transition pathway into the Core Incubation track",
    ],
  },
  {
    title: "Core Incubation",
    tagline:
      "Our flagship incubation program provides deep-tech startups with everything needed to build, validate, and scale — from lab access to investor introductions.",
    duration: "18–24 Months",
    funding: "Up to ₹50 Lakhs",
    benefits: [
      "Plug & play office cabins and co-working space",
      "Seed funding via NIDHI PRAYAS and Start In UP",
      "Comprehensive IP, legal, and compliance support",
      "Direct access to DST, STPI, and MSME national schemes",
      "Investor access and VC networking events",
      "Go-to-market strategy and business development support",
    ],
  },
  {
    title: "BIZZNESS Student Program",
    tagline:
      "Designed for undergraduate and postgraduate students with entrepreneurial ambitions — a 6-month intensive to validate your idea and build a founding team.",
    duration: "6 Months",
    funding: undefined,
    benefits: [
      "Structured business modelling and lean canvas workshops",
      "Dedicated faculty mentorship from JSSATEN experts",
      "Hands-on prototyping support in the CAMT labs",
      "Access to the JSS STEP founder network and alumni",
      "Fast-track pathway to the NIDHI EIR program",
    ],
  },
] satisfies {
  title: string;
  tagline: string;
  duration: string;
  funding?: string;
  benefits: readonly string[];
}[];

/* ─── Page ───────────────────────────────────────────────────────────── */

export default function ProgramsPage() {
  return (
    <div className="w-full">
      <ProgramHero />
      <ProgramFunnel />

      {/* Program cards section */}
      <section className="py-16 bg-white" aria-label="Program listings">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 space-y-8">
          <ScrollFadeIn>
            <div className="text-center mb-10">
              <p className="text-sm font-semibold tracking-widest uppercase text-purple-600 mb-2">
                Our Offerings
              </p>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
                Choose Your Path
              </h2>
            </div>
          </ScrollFadeIn>

          {PROGRAMS.map((program, i) => (
            <ScrollFadeIn key={program.title} delay={i * 0.1}>
              <ProgramCard {...program} />
            </ScrollFadeIn>
          ))}
        </div>
      </section>

      <EligibilityCriteria />
      <ProgramFAQ />
    </div>
  );
}
