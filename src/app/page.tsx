export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";
import { ExternalLink, ArrowRight } from "lucide-react";
import { client } from "@/sanity/client";
import { urlFor } from "@/sanity/image";
import Hero from "@/components/home/Hero";
import StatsBar from "@/components/home/StatsBar";
import FocusAreas from "@/components/home/FocusAreas";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import Testimonials from "@/components/home/Testimonials";
import PartnersStrip from "@/components/home/PartnersStrip";

/* ─── Sanity type ─────────────────────────────────────────────────────── */

interface SanityPortfolio {
  _id:         string;
  startupName: string;
  sector:      string | null;
  description: string | null;
  logo:        { asset: { _ref: string } } | null;
  websiteUrl:  string | null;
}

/* ─── GROQ ────────────────────────────────────────────────────────────── */

const PORTFOLIO_QUERY = `
  *[_type == "portfolio" && isFeatured == true] | order(_createdAt desc)[0...3] {
    _id,
    startupName,
    sector,
    description,
    logo,
    websiteUrl
  }
`;

/* ─── Helpers ─────────────────────────────────────────────────────────── */

/** 1-2 uppercase initials from a startup name */
function initials(name: string) {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/* ─── Featured startup card ──────────────────────────────────────────── */

function FeaturedCard({ startup }: { startup: SanityPortfolio }) {
  const logoUrl = startup.logo
    ? urlFor(startup.logo).width(160).height(160).fit("crop").auto("format").url()
    : null;

  return (
    <div
      className="group bg-white rounded-2xl border border-slate-100 p-6
                 hover:shadow-xl hover:shadow-slate-200/60 hover:-translate-y-1
                 transition-all duration-300 flex flex-col gap-4"
    >
      {/* Logo / fallback */}
      <div
        className="w-full h-20 rounded-xl overflow-hidden
                   bg-gradient-to-br from-slate-100 to-slate-200
                   flex items-center justify-center shrink-0"
      >
        {logoUrl ? (
          <Image
            src={logoUrl}
            alt={`${startup.startupName} logo`}
            width={80}
            height={80}
            className="object-contain"
          />
        ) : (
          <span className="text-2xl font-black text-slate-300 tracking-tighter select-none">
            {initials(startup.startupName)}
          </span>
        )}
      </div>

      {/* Meta row */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-slate-900 mb-1 truncate">
            {startup.startupName}
          </h3>
          {startup.sector && (
            <span
              className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium
                         bg-cyan-50 border border-cyan-200 text-cyan-700"
            >
              {startup.sector}
            </span>
          )}
        </div>

        {/* External link icon — only shown when URL exists */}
        {startup.websiteUrl ? (
          <a
            href={startup.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Visit ${startup.startupName} website`}
            onClick={(e) => e.stopPropagation()}
            className="shrink-0 mt-0.5 text-slate-300 group-hover:text-cyan-500
                       transition-colors duration-200"
          >
            <ExternalLink size={15} />
          </a>
        ) : (
          <ExternalLink
            size={15}
            className="shrink-0 mt-0.5 text-slate-200"
            aria-hidden
          />
        )}
      </div>

      {/* Description */}
      {startup.description && (
        <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 flex-grow">
          {startup.description}
        </p>
      )}
    </div>
  );
}

/* ─── Page ────────────────────────────────────────────────────────────── */

export default async function Home() {
  const featuredStartups = await client.fetch<SanityPortfolio[]>(
    PORTFOLIO_QUERY,
    {},
    { cache: "no-store" }
  );

  return (
    <div className="w-full">
      <Hero />
      <StatsBar />
      <FocusAreas />
      <WhyChooseUs />

      {/* ── Dynamic Portfolio Glimpse ──────────────────────────────────── */}
      <section className="py-24 bg-slate-50" aria-labelledby="portfolio-heading">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">

          {/* Heading */}
          <div className="text-center mb-14">
            <p className="text-sm font-semibold tracking-widest uppercase text-cyan-600 mb-2">
              Portfolio
            </p>
            <h2
              id="portfolio-heading"
              className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-4"
            >
              Startups We&apos;ve Launched
            </h2>
            <p className="text-base text-slate-500 max-w-xl mx-auto leading-relaxed">
              A curated glimpse into the deep-tech ventures incubated and accelerated by JSS STEP.
            </p>
          </div>

          {featuredStartups.length === 0 ? (
            /* Graceful empty state — shown until isFeatured is toggled in Studio */
            <p className="text-center text-sm text-slate-400 py-12">
              Featured startups coming soon. Check back shortly!
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {featuredStartups.map((startup) => (
                <FeaturedCard key={startup._id} startup={startup} />
              ))}
            </div>
          )}

          {/* CTA */}
          <div className="flex justify-center mt-10">
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full
                         bg-slate-900 text-white text-sm font-semibold
                         hover:bg-cyan-600 hover:shadow-lg hover:shadow-cyan-500/20
                         hover:-translate-y-0.5 transition-all duration-300"
            >
              View All Startups
              <ArrowRight size={15} />
            </Link>
          </div>

        </div>
      </section>

      <Testimonials />
      <PartnersStrip />
    </div>
  );
}
