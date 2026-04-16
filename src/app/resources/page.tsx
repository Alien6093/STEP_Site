import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import ResourceCard from "@/components/resources/ResourceCard";
import SectionHeading from "@/components/shared/SectionHeading";
import ScrollFadeIn from "@/components/shared/ScrollFadeIn";
import { resourcesData, ecosystemLinks } from "@/lib/data/resources";

/* ─── Metadata ───────────────────────────────────────────────────────── */

export const metadata: Metadata = {
  title: "Resources | JSS STEP",
  description:
    "Download pitch deck templates, NIDHI guidelines, IP handbooks, and access key ecosystem links for Indian deep-tech founders.",
};

/* ─── Hero ───────────────────────────────────────────────────────────── */

function ResourcesHero() {
  return (
    <section className="relative pt-32 pb-16 bg-slate-900 text-white text-center overflow-hidden">
      <div className="absolute w-[380px] h-[380px] rounded-full bg-cyan-500/10
                      blur-[100px] -top-20 -left-16 pointer-events-none" />
      <div className="absolute w-[280px] h-[280px] rounded-full bg-violet-500/10
                      blur-[90px] bottom-0 right-0 pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col items-center gap-5 animate-[fadeUp_0.65s_cubic-bezier(0.16,1,0.3,1)_both]">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border
                           border-cyan-500/30 bg-cyan-500/10 text-cyan-400
                           text-xs font-semibold tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Founder Toolkit
          </span>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tighter
                         text-white leading-[1.06]">
            Resources for{" "}
            <span className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(90deg,#06B6D4 0%,#8B5CF6 100%)" }}>
              Founders
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-xl">
            Templates, guidelines, and links curated by the JSS STEP team to help you
            build, fund, and scale your deep-tech startup.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────── */

export default function ResourcesPage() {
  return (
    <div className="w-full">
      <ResourcesHero />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-24 space-y-16">

        {/* ── Download Library ── */}
        <section aria-labelledby="downloads-heading">
          <ScrollFadeIn>
            <SectionHeading
              title={<span id="downloads-heading">Download Library</span>}
              subtitle="Free resources to help you structure your startup from day one."
              align="left"
              className="mb-8"
            />
          </ScrollFadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {resourcesData.map((resource, i) => (
              <ScrollFadeIn key={resource.id} delay={i * 0.07}>
                <ResourceCard resource={resource} />
              </ScrollFadeIn>
            ))}
          </div>
        </section>

        {/* Divider */}
        <hr className="border-slate-100" />

        {/* ── Ecosystem Links ── */}
        <section aria-labelledby="ecosystem-heading">
          <ScrollFadeIn>
            <SectionHeading
              title={<span id="ecosystem-heading">Ecosystem Links</span>}
              subtitle="Key government portals and support infrastructure for Indian startups."
              align="left"
              className="mb-8"
            />
          </ScrollFadeIn>

          <div className="flex flex-col gap-3">
            {ecosystemLinks.map((link, i) => (
              <ScrollFadeIn key={link.href} delay={i * 0.06}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between gap-4 bg-white rounded-xl
                             px-5 py-4 border border-slate-200 hover:border-cyan-400
                             hover:shadow-md hover:shadow-cyan-500/10 transition-all duration-300"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900 text-sm group-hover:text-cyan-700
                                  transition-colors">{link.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                      {link.description}
                    </p>
                  </div>
                  <ExternalLink
                    size={15}
                    className="shrink-0 text-slate-300 group-hover:text-cyan-500
                               transition-colors duration-200"
                  />
                </a>
              </ScrollFadeIn>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
