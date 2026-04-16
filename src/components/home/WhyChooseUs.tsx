"use client";

import { Award, Coins, Microscope, Briefcase, Scale, MapPin, type LucideIcon } from "lucide-react";
import SectionHeading from "@/components/shared/SectionHeading";
import ScrollFadeIn from "@/components/shared/ScrollFadeIn";

/* ─── Data ───────────────────────────────────────────────────────────── */

const REASONS: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Award,
    title: "DST-Recognised Incubator",
    description:
      "Official Technology Business Incubator supported by the Department of Science & Technology, Govt. of India.",
  },
  {
    icon: Coins,
    title: "NIDHI Seed Funding",
    description:
      "Access to seed support up to ₹50 Lakhs for prototyping, market entry, and commercialization.",
  },
  {
    icon: Microscope,
    title: "World-Class Labs",
    description:
      "18,000 sq. ft. facility with co-working spaces, PLM Competency Centre, and advanced manufacturing labs.",
  },
  {
    icon: Briefcase,
    title: "Elite Mentorship",
    description:
      "1-on-1 guidance from IIT alumni, industry veterans, and global CEOs.",
  },
  {
    icon: Scale,
    title: "IP & Legal Support",
    description:
      "End-to-end assistance with company formation, patents, and legal compliance.",
  },
  {
    icon: MapPin,
    title: "Strategic NCR Location",
    description:
      "Situated in the heart of Noida's IT hub inside the lush 28-acre JSSATEN campus.",
  },
];

/* ─── Card ───────────────────────────────────────────────────────────── */

function ReasonCard({ icon: Icon, title, description }: (typeof REASONS)[0]) {
  return (
    <div
      className="bg-slate-50 rounded-2xl p-5 sm:p-6 lg:p-8 border border-slate-100
                 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
    >
      <div className="inline-flex items-center justify-center w-11 h-11 rounded-lg
                      bg-cyan-100 text-cyan-600 mb-4">
        <Icon size={20} strokeWidth={1.75} />
      </div>
      <h3 className="text-base font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
    </div>
  );
}

/* ─── Section ────────────────────────────────────────────────────────── */

export default function WhyChooseUs() {
  return (
    <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-white" aria-labelledby="why-heading">
      <div className="max-w-6xl mx-auto">
        <ScrollFadeIn>
          <SectionHeading
            label="Why JSS STEP"
            title={<span id="why-heading">Why Founders Choose Us</span>}
            subtitle="We provide the infrastructure, funding, and mentorship required to scale deep-tech startups globally."
            align="center"
            className="mb-14"
          />
        </ScrollFadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {REASONS.map((item, i) => (
            <ScrollFadeIn key={item.title} delay={i * 0.09}>
              <ReasonCard {...item} />
            </ScrollFadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
