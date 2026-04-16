"use client";

import {
  GraduationCap, Microscope, Users, Globe,
  Sparkles, TrendingUp, UsersRound, FlaskConical,
  type LucideIcon,
} from "lucide-react";
import ScrollFadeIn from "@/components/shared/ScrollFadeIn";

/* ─── Data ───────────────────────────────────────────────────────────── */

const AUDIENCE: { icon: LucideIcon; label: string; desc: string }[] = [
  { icon: GraduationCap, label: "Student Entrepreneurs",  desc: "Pursuing B.Tech, M.Tech, MBA or Ph.D at JSSATEN or any Indian university." },
  { icon: Microscope,    label: "Faculty Innovators",     desc: "Academics with patentable research ready to commercialise." },
  { icon: Users,         label: "JSSATEN Alumni",         desc: "Graduates who want to build on the JSS ecosystem and network." },
  { icon: Globe,         label: "External Tech Founders", desc: "Deep-tech founders from across India building scalable solutions." },
];

const CRITERIA: { icon: LucideIcon; label: string; desc: string }[] = [
  { icon: Sparkles,       label: "Innovation & Tech-Focus",        desc: "A genuine technology-driven solution addressing a real market gap." },
  { icon: TrendingUp,     label: "Scalability",                    desc: "Clear potential to scale beyond regional boundaries." },
  { icon: UsersRound,     label: "Dedicated Core Team",            desc: "At least two committed founders with complementary skill-sets." },
  { icon: FlaskConical,   label: "Prototype / MVP Readiness",      desc: "Required for Incubation & Acceleration tracks; idea-stage OK for EIR." },
];

/* ─── List item ──────────────────────────────────────────────────────── */

function CriteriaItem({ icon: Icon, label, desc }: { icon: LucideIcon; label: string; desc: string }) {
  return (
    <li className="flex items-start gap-4">
      <div className="shrink-0 w-9 h-9 rounded-lg bg-slate-700 flex items-center justify-center text-cyan-400">
        <Icon size={16} strokeWidth={1.75} />
      </div>
      <div>
        <p className="text-sm font-semibold text-white">{label}</p>
        <p className="text-sm text-slate-400 mt-0.5 leading-relaxed">{desc}</p>
      </div>
    </li>
  );
}

/* ─── Section ────────────────────────────────────────────────────────── */

export default function EligibilityCriteria() {
  return (
    <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white" aria-labelledby="eligibility-heading">
      <div className="max-w-5xl mx-auto">

        {/* Heading — forced white */}
        <ScrollFadeIn>
          <div className="text-center mb-14">
            <p className="text-sm font-semibold tracking-widest uppercase text-purple-400 mb-2">
              Requirements
            </p>
            <h2
              id="eligibility-heading"
              className="text-3xl md:text-4xl font-bold tracking-tight text-white"
            >
              Who Can Apply?
            </h2>
          </div>
        </ScrollFadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 md:gap-12">

          {/* Col 1 — Target Audience */}
          <ScrollFadeIn delay={0.05}>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-cyan-400 mb-6">
                Target Audience
              </h3>
              <ul className="space-y-6">
                {AUDIENCE.map((item) => (
                  <CriteriaItem key={item.label} {...item} />
                ))}
              </ul>
            </div>
          </ScrollFadeIn>

          {/* Col 2 — Selection Criteria */}
          <ScrollFadeIn delay={0.12}>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-violet-400 mb-6">
                Selection Criteria
              </h3>
              <ul className="space-y-6">
                {CRITERIA.map((item) => (
                  <CriteriaItem key={item.label} {...item} />
                ))}
              </ul>
            </div>
          </ScrollFadeIn>
        </div>
      </div>
    </section>
  );
}
