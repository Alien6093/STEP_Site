export const dynamic = "force-dynamic";

import Image from "next/image";
import { ExternalLink, TrendingUp } from "lucide-react";
import { client } from "@/sanity/client";
import { urlFor } from "@/sanity/image";

export const metadata = {
  title:       "Investors — JSS STEP Ecosystem",
  description: "Meet the investors and venture funds backing deep-tech startups at JSS STEP.",
};

/* ─── Type ────────────────────────────────────────────────────────────── */

interface SanityInvestor {
  _id:        string;
  name:       string;
  logo:       { asset: { _ref: string } } | null;
  description: string | null;
  websiteUrl: string | null;
  focusArea:  string | null;
}

/* ─── GROQ ────────────────────────────────────────────────────────────── */

const QUERY = `*[_type == "investor"] | order(name asc) {
  _id, name, logo, description, websiteUrl, focusArea
}`;

/* ─── Helpers ─────────────────────────────────────────────────────────── */

function initials(name: string) {
  return name.split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

/* ─── Card ────────────────────────────────────────────────────────────── */

function InvestorCard({ entity }: { entity: SanityInvestor }) {
  const logoUrl = entity.logo
    ? urlFor(entity.logo).width(160).height(160).fit("crop").auto("format").url()
    : null;

  return (
    <article
      className="bg-white rounded-2xl border border-slate-200 p-6
                 hover:shadow-xl hover:shadow-slate-200/70 hover:-translate-y-1
                 transition-all duration-300 flex flex-col h-full group"
    >
      {/* Logo / initials */}
      <div className="flex items-start gap-4 mb-4">
        <div
          className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0
                     ring-2 ring-slate-100 group-hover:ring-cyan-200 transition-all"
        >
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={entity.name}
              fill
              sizes="64px"
              className="object-contain p-1"
            />
          ) : (
            <div
              className="w-full h-full bg-gradient-to-br from-cyan-500 to-slate-700
                         flex items-center justify-center text-white text-lg font-bold select-none"
            >
              {initials(entity.name)}
            </div>
          )}
        </div>

        <div className="min-w-0">
          <h3 className="font-bold text-slate-900 leading-snug truncate">{entity.name}</h3>
          {entity.focusArea && (
            <span
              className="inline-flex items-center gap-1 mt-1 px-2.5 py-0.5 rounded-full
                         bg-cyan-50 border border-cyan-200 text-cyan-700 text-xs font-medium"
            >
              <TrendingUp size={10} />
              {entity.focusArea}
            </span>
          )}
        </div>
      </div>

      {/* Description */}
      {entity.description && (
        <p className="text-sm text-slate-600 leading-relaxed line-clamp-3 flex-grow mb-4">
          {entity.description}
        </p>
      )}

      {/* Footer link */}
      <div className="mt-auto pt-4 border-t border-slate-100">
        {entity.websiteUrl ? (
          <a
            href={entity.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Visit ${entity.name} website`}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400
                       hover:text-cyan-600 transition-colors duration-200"
          >
            <ExternalLink size={13} />
            Visit Website
          </a>
        ) : (
          <span className="text-xs text-slate-300">No website listed</span>
        )}
      </div>
    </article>
  );
}

/* ─── Page ────────────────────────────────────────────────────────────── */

export default async function InvestorsPage() {
  const investors = await client.fetch<SanityInvestor[]>(QUERY, {}, { cache: "no-store" });

  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      {/* Hero */}
      <section className="bg-[#0F172A] pt-28 pb-16 px-4 text-center">
        <span
          className="inline-block px-3 py-1 mb-4 rounded-full border border-cyan-500/30
                     bg-cyan-500/10 text-cyan-400 text-xs font-semibold tracking-widest uppercase"
        >
          Ecosystem · Investors
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
          Our Investor Network
        </h1>
        <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          The venture funds, angels, and family offices backing JSS STEP&apos;s
          deep-tech cohort from seed through Series A.
        </p>
      </section>

      {/* Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {investors.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <TrendingUp size={40} className="text-slate-300 mb-4" />
            <h2 className="text-lg font-semibold text-slate-700 mb-2">Investors coming soon.</h2>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {investors.map((investor) => (
              <InvestorCard key={investor._id} entity={investor} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
