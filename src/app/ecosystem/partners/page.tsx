export const dynamic = "force-dynamic";

import Image from "next/image";
import { ExternalLink, Handshake } from "lucide-react";
import { client } from "@/sanity/client";
import { urlFor } from "@/sanity/image";

export const metadata = {
  title:       "Partners — JSS STEP Ecosystem",
  description: "The technology, legal, academic, and government partners strengthening the JSS STEP ecosystem.",
};

/* ─── Type ────────────────────────────────────────────────────────────── */

interface SanityPartner {
  _id:         string;
  name:        string;
  logo:        { asset: { _ref: string } } | null;
  description: string | null;
  websiteUrl:  string | null;
  partnerType: string | null;
}

/* ─── GROQ ────────────────────────────────────────────────────────────── */

const QUERY = `*[_type == "partner"] | order(name asc) {
  _id, name, logo, description, websiteUrl, partnerType
}`;

/* ─── Helpers ─────────────────────────────────────────────────────────── */

function initials(name: string) {
  return name.split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

/* ─── Card ────────────────────────────────────────────────────────────── */

function PartnerCard({ entity }: { entity: SanityPartner }) {
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
                     ring-2 ring-slate-100 group-hover:ring-emerald-200 transition-all"
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
              className="w-full h-full bg-gradient-to-br from-emerald-500 to-teal-700
                         flex items-center justify-center text-white text-lg font-bold select-none"
            >
              {initials(entity.name)}
            </div>
          )}
        </div>

        <div className="min-w-0">
          <h3 className="font-bold text-slate-900 leading-snug truncate">{entity.name}</h3>
          {entity.partnerType && (
            <span
              className="inline-flex items-center gap-1 mt-1 px-2.5 py-0.5 rounded-full
                         bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium"
            >
              <Handshake size={10} />
              {entity.partnerType}
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

export default async function PartnersPage() {
  const partners = await client.fetch<SanityPartner[]>(QUERY, {}, { cache: "no-store" });

  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      {/* Hero */}
      <section className="bg-[#0F172A] pt-28 pb-16 px-4 text-center">
        <span
          className="inline-block px-3 py-1 mb-4 rounded-full border border-emerald-500/30
                     bg-emerald-500/10 text-emerald-400 text-xs font-semibold tracking-widest uppercase"
        >
          Ecosystem · Partners
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
          Ecosystem Partners
        </h1>
        <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Technology providers, legal advisors, academic institutions, and
          government bodies that power the JSS STEP innovation engine.
        </p>
      </section>

      {/* Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {partners.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Handshake size={40} className="text-slate-300 mb-4" />
            <h2 className="text-lg font-semibold text-slate-700 mb-2">Partners coming soon.</h2>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {partners.map((partner) => (
              <PartnerCard key={partner._id} entity={partner} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
