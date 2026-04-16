"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";
import SectionHeading from "@/components/shared/SectionHeading";
import ScrollFadeIn from "@/components/shared/ScrollFadeIn";
import Badge from "@/components/shared/Badge";

/* ─── Data ───────────────────────────────────────────────────────────── */

const STARTUPS = [
  {
    name: "NovaBio Diagnostics",
    sector: "Health-Tech",
    description: "AI-powered rapid diagnostics platform reducing disease detection time by 80%.",
    badge: "primary" as const,
  },
  {
    name: "Aethon Robotics",
    sector: "Robotics",
    description: "Autonomous inspection drones for critical infrastructure monitoring at scale.",
    badge: "secondary" as const,
  },
  {
    name: "GreenVolt Systems",
    sector: "Clean-Tech",
    description: "Next-gen EV battery management systems optimized for Indian road conditions.",
    badge: "success" as const,
  },
  {
    name: "NeuraLink AI",
    sector: "Deep Tech & AI",
    description: "Edge-AI inference chips delivering GPT-class results at milliwatt power budgets.",
    badge: "primary" as const,
  },
  {
    name: "FabriSense IoT",
    sector: "Industry 4.0",
    description: "Smart textile sensors enabling real-time worker safety monitoring in factories.",
    badge: "secondary" as const,
  },
  {
    name: "ImmersaVR",
    sector: "AR/VR",
    description: "Surgical training simulations using photorealistic mixed-reality environments.",
    badge: "outline" as const,
  },
];

/* ─── Card ───────────────────────────────────────────────────────────── */

function StartupCard({
  name,
  sector,
  description,
  badge,
}: (typeof STARTUPS)[0]) {
  return (
    <div
      className="group bg-white rounded-2xl border border-slate-100 p-6
                 hover:shadow-xl hover:shadow-slate-200/60 hover:-translate-y-1
                 transition-all duration-300 flex flex-col gap-4"
    >
      {/* Logo placeholder */}
      <div
        className="w-full h-20 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200
                   flex items-center justify-center"
      >
        <span className="text-2xl font-black text-slate-300 tracking-tighter">
          {name.slice(0, 2).toUpperCase()}
        </span>
      </div>

      {/* Meta */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 mb-1">{name}</h3>
          <Badge variant={badge}>{sector}</Badge>
        </div>
        <ExternalLink
          size={15}
          className="text-slate-300 group-hover:text-cyan-500 transition-colors duration-200 shrink-0 mt-0.5"
        />
      </div>

      <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
    </div>
  );
}

/* ─── Section ────────────────────────────────────────────────────────── */

export default function PortfolioSpotlight() {
  return (
    <section className="py-24 bg-slate-50" aria-labelledby="portfolio-heading">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">

        <ScrollFadeIn>
          <SectionHeading
            label="Portfolio"
            title={<span id="portfolio-heading">Startups We&apos;ve Launched</span>}
            align="center"
            className="mb-14"
          />
        </ScrollFadeIn>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {STARTUPS.map((startup, i) => (
            <ScrollFadeIn key={startup.name} delay={i * 0.08}>
              <StartupCard {...startup} />
            </ScrollFadeIn>
          ))}
        </div>

        {/* CTA */}
        <ScrollFadeIn>
          <div className="flex justify-center">
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full
                         bg-slate-900 text-white text-sm font-semibold
                         hover:bg-cyan-600 hover:shadow-lg hover:shadow-cyan-500/20
                         hover:-translate-y-0.5 transition-all duration-300"
            >
              View All Startups
              <ExternalLink size={14} />
            </Link>
          </div>
        </ScrollFadeIn>
      </div>
    </section>
  );
}
