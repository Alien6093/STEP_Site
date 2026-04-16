"use client";

import { Cpu, Zap, HeartPulse, Server, Crosshair, Glasses } from "lucide-react";
import SectionHeading from "@/components/shared/SectionHeading";
import ScrollFadeIn from "@/components/shared/ScrollFadeIn";
import { type LucideIcon } from "lucide-react";

/* ─── Data ───────────────────────────────────────────────────────────── */

const DOMAINS: {
  icon: LucideIcon;
  title: string;
  description: string;
}[] = [
  {
    icon: Cpu,
    title: "Deep Tech & AI",
    description:
      "Artificial intelligence, machine learning, and next-generation computing solutions.",
  },
  {
    icon: Zap,
    title: "Clean-Tech & EV",
    description:
      "Sustainable energy systems, electric mobility, and green-tech innovations.",
  },
  {
    icon: HeartPulse,
    title: "Health-Tech",
    description:
      "Digital health, medical devices, diagnostics, and biomedical engineering breakthroughs.",
  },
  {
    icon: Server,
    title: "Industry 4.0 & IoT",
    description:
      "Smart manufacturing, connected devices, and industrial automation at scale.",
  },
  {
    icon: Crosshair,
    title: "Robotics & Drones",
    description:
      "Autonomous systems, UAVs, precision robotics for defence and logistics.",
  },
  {
    icon: Glasses,
    title: "AR/VR & Web3",
    description:
      "Immersive experiences, spatial computing, and decentralised application platforms.",
  },
];

/* ─── Card ───────────────────────────────────────────────────────────── */

function DomainCard({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div
      className="group bg-white rounded-2xl border border-slate-100 p-5 sm:p-6 lg:p-8 cursor-pointer
                 hover:-translate-y-2 hover:shadow-xl hover:shadow-slate-200/70
                 transition-all duration-300"
    >
      {/* Icon container */}
      <div
        className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4
                   bg-slate-100 text-slate-400
                   group-hover:bg-cyan-50 group-hover:text-cyan-600
                   transition-colors duration-300"
      >
        <Icon size={22} strokeWidth={1.75} />
      </div>

      {/* Text */}
      <h3 className="text-base font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
    </div>
  );
}

/* ─── Section ────────────────────────────────────────────────────────── */

export default function FocusAreas() {
  return (
    <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-slate-50" aria-labelledby="focus-areas-heading">
      <div className="max-w-6xl mx-auto">

        {/* Heading */}
        <ScrollFadeIn>
          <SectionHeading
            label="Our Domains"
            title={<span id="focus-areas-heading">Focus Areas</span>}
            subtitle="We back founders building the future in high-impact, technology-driven sectors."
            align="center"
            className="mb-14"
          />
        </ScrollFadeIn>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {DOMAINS.map((domain, i) => (
            <ScrollFadeIn key={domain.title} delay={i * 0.08}>
              <DomainCard
                icon={domain.icon}
                title={domain.title}
                description={domain.description}
              />
            </ScrollFadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
