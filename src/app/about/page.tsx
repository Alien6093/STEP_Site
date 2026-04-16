import type { Metadata } from "next";
import MissionVision from "@/components/about/MissionVision";
import Timeline from "@/components/about/Timeline";
import Facilities from "@/components/about/Facilities";
import TeamGrid from "@/components/about/TeamGrid";

/* ─── Metadata ───────────────────────────────────────────────────────── */

export const metadata: Metadata = {
  title: "About Us | JSS STEP",
  description:
    "Learn about the mission, legacy, and leadership driving the JSS STEP deep-tech incubator ecosystem.",
};

/* ─── About Hero ─────────────────────────────────────────────────────── */

function AboutHero() {
  return (
    <section
      className="min-h-[40vh] flex flex-col items-center justify-center
                 bg-slate-50 pt-20 pb-12 px-4 text-center"
      aria-label="About page hero"
    >
      {/* Eyebrow */}
      <p className="text-sm font-semibold tracking-widest uppercase text-cyan-600 mb-4">
        Est. 2000 · DST Recognised
      </p>

      {/* Title */}
      <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tighter
                     text-slate-900 leading-[1.05] mb-6">
        About{" "}
        <span
          className="bg-clip-text text-transparent"
          style={{
            backgroundImage: "linear-gradient(90deg, #06B6D4 0%, #8B5CF6 100%)",
          }}
        >
          JSS STEP
        </span>
      </h1>

      {/* Sub */}
      <p className="text-lg text-slate-500 max-w-2xl leading-relaxed">
        Discover the heritage and the visionary leaders powering India&apos;s pioneering
        Technology Business Incubator — two decades of turning ideas into impact.
      </p>
    </section>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────── */

export default function AboutPage() {
  return (
    <div className="w-full">
      <AboutHero />
      <MissionVision />
      <Timeline />
      <Facilities />
      <TeamGrid />
    </div>
  );
}
