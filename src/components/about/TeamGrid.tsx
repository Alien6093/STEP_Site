"use client";

import { useState } from "react";
import Image from "next/image";
import { Linkedin } from "lucide-react";
import SectionHeading from "@/components/shared/SectionHeading";
import ScrollFadeIn from "@/components/shared/ScrollFadeIn";

/* ─── Types ─────────────────────────────────────────────────────────── */

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  imageSrc: string;
  initials: string;
  linkedin: string;
  gradient: string;
}

/* ─── Data ───────────────────────────────────────────────────────────── */

const TEAM: TeamMember[] = [
  {
    name: "Prof. (Dr.) Satyendra Patnaik",
    role: "Chief Executive Officer, JSSATE-STEP",
    bio: "Seasoned startup evangelist and educational leader with extensive experience scaling innovation ecosystems.",
    imageSrc: "/ceo-profile.jpg",
    initials: "SP",
    linkedin: "#",
    gradient: "from-cyan-400 to-blue-500",
  },
  {
    name: "Anshika Aggarwal",
    role: "Assistant Incubation Manager",
    bio: "Driving day-to-day startup operations and program management. Bridging scientific innovation with operational execution.",
    imageSrc: "/manager-profile.jpg",
    initials: "AA",
    linkedin: "#",
    gradient: "from-violet-400 to-purple-500",
  },
];

/* ─── Card ───────────────────────────────────────────────────────────── */

function TeamCard({
  name,
  role,
  bio,
  imageSrc,
  initials,
  linkedin,
  gradient,
}: TeamMember) {
  const [imgError, setImgError] = useState(false);
  return (
    <div
      className="group relative overflow-hidden rounded-2xl bg-slate-50
                 border border-slate-200 cursor-pointer
                 hover:shadow-xl hover:shadow-slate-200/70 transition-all duration-300"
    >
      {/* Photo area */}
      <div className="relative w-full h-56 sm:h-64 overflow-hidden bg-slate-200">
        {!imgError ? (
          <Image
            src={imageSrc}
            alt={name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover object-top grayscale group-hover:grayscale-0
                       transition-all duration-500 ease-in-out"
            onError={() => setImgError(true)}
          />
        ) : (
          <div
            className={`absolute inset-0 flex items-center justify-center
                        bg-gradient-to-br ${gradient}`}
            aria-hidden
          >
            <span className="text-7xl font-black text-white/40 select-none">
              {initials}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-6 flex flex-col gap-3 items-center text-center">
        <div>
          <h3 className="text-sm sm:text-base font-medium text-slate-900 leading-tight">{name}</h3>
          <p className="text-xs font-semibold text-cyan-600 mt-0.5">{role}</p>
        </div>

        <p className="text-sm text-slate-500 leading-relaxed">{bio}</p>

        {/* LinkedIn */}
        <a
          href={linkedin}
          aria-label={`${name} on LinkedIn`}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400
                     hover:text-cyan-600 transition-colors duration-200 mt-1 w-fit"
        >
          <Linkedin size={14} />
          LinkedIn Profile
        </a>
      </div>
    </div>
  );
}

/* ─── Section ────────────────────────────────────────────────────────── */

export default function TeamGrid() {
  return (
    <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-white" aria-labelledby="team-heading">
      <div className="max-w-5xl mx-auto">

        <ScrollFadeIn>
          <SectionHeading
            label="Leadership"
            title={<span id="team-heading">Meet Our Core Team</span>}
            align="center"
            className="mb-14"
          />
        </ScrollFadeIn>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {TEAM.map((member, i) => (
            <ScrollFadeIn key={member.name} delay={i * 0.12}>
              <TeamCard {...member} />
            </ScrollFadeIn>
          ))}
        </div>

        {/* Image note */}
        <p className="mt-8 text-center text-xs text-slate-400">
          * Profile photos should be placed at{" "}
          <code className="font-mono">/public/ceo-profile.jpg</code> &amp;{" "}
          <code className="font-mono">/public/manager-profile.jpg</code>
        </p>
      </div>
    </section>
  );
}
