export const revalidate = 60;

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
import ScrollFadeIn from "@/components/shared/ScrollFadeIn";

/* ─── Sanity type ─────────────────────────────────────────────────────── */

interface SanityPortfolio {
  _id:          string;
  startupName:  string;
  sector:       string | null;
  description:  string | null;
  keyHighlight: string | null;
  logo:         { asset: { _ref: string } } | null;
  websiteUrl:   string | null;
}

/* ─── GROQ ────────────────────────────────────────────────────────────── */

/**
 * Primary: portfolios explicitly marked as featured, newest first, max 4.
 * Fallback: if none are featured yet, show the 4 most recent portfolios
 * so the section is never empty while the CMS is being populated.
 */
const FEATURED_QUERY = `
  *[_type == "portfolio" && isFeatured == true] | order(_createdAt desc)[0...4] {
    _id,
    startupName,
    sector,
    description,
    keyHighlight,
    logo,
    websiteUrl
  }
`;

const FALLBACK_QUERY = `
  *[_type == "portfolio"] | order(_createdAt desc)[0...4] {
    _id,
    startupName,
    sector,
    description,
    keyHighlight,
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

  const CardContent = (
    <div
      className="group bg-white rounded-2xl border border-slate-100 p-6
                 hover:shadow-xl hover:shadow-slate-200/60 hover:-translate-y-1
                 transition-all duration-300 flex flex-col gap-4 h-full"
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

        {/* External link icon — always visible, animates on hover */}
        <ExternalLink
          size={15}
          className="shrink-0 mt-0.5 text-slate-300 group-hover:text-cyan-500
                     transition-colors duration-200"
          aria-hidden
        />
      </div>

      {/* Description */}
      {startup.description && (
        <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 flex-grow">
          {startup.description}
        </p>
      )}

      {/* Key highlight badge */}
      {startup.keyHighlight && (
        <span
          className="inline-block self-start px-2.5 py-1 rounded-lg text-[11px] font-semibold
                     bg-amber-50 border border-amber-200 text-amber-700"
        >
          🏆 {startup.keyHighlight}
        </span>
      )}
    </div>
  );

  /* Wrap entire card in an anchor if websiteUrl exists, otherwise plain div */
  if (startup.websiteUrl) {
    return (
      <a
        href={startup.websiteUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Visit ${startup.startupName} website`}
        className="block focus-visible:outline-none focus-visible:ring-2
                   focus-visible:ring-cyan-500 rounded-2xl"
      >
        {CardContent}
      </a>
    );
  }

  return <div>{CardContent}</div>;
}

/* ─── Page ────────────────────────────────────────────────────────────── */

export default async function Home() {
  /*
   * Two-step fallback strategy:
   *   1. Try to fetch portfolios flagged isFeatured == true in Sanity Studio.
   *   2. If none are flagged yet (empty result), fall back to the 4 most
   *      recently created portfolios so the section never shows an empty state.
   *
   * Both fetches share the same ISR revalidate window so there is no
   * caching inconsistency between the two code paths.
   */
  const ISR_OPTIONS = { next: { revalidate: 60 } } as const;

  let featuredStartups = await client.fetch<SanityPortfolio[]>(
    FEATURED_QUERY,
    {},
    ISR_OPTIONS
  );

  if (!featuredStartups || featuredStartups.length === 0) {
    featuredStartups = await client.fetch<SanityPortfolio[]>(
      FALLBACK_QUERY,
      {},
      ISR_OPTIONS
    );
  }

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
            /* Graceful empty state — shown until isFeatured is toggled in Sanity Studio */
            <p className="text-center text-sm text-slate-400 py-12">
              Our featured startups will appear here soon — check back shortly!
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {featuredStartups.map((startup, i) => (
                <ScrollFadeIn key={startup._id} delay={i * 0.08}>
                  <FeaturedCard startup={startup} />
                </ScrollFadeIn>
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
