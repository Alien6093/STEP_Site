export const dynamic = 'force-dynamic';
export const revalidate = 0;

import Link from "next/link";
import Image from "next/image";
import { client } from "@/sanity/client";
import { urlFor } from "@/sanity/image";
import { CalendarDays, ExternalLink, Users } from "lucide-react";

export const metadata = {
  title: "Mentors — JSS STEP",
  description: "Meet the industry experts and investors mentoring JSS STEP incubatees.",
};

/* ─── GROQ query ──────────────────────────────────────────────────────── */

const MENTORS_QUERY = `
  *[_type == "mentor"] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    designation,
    organisation,
    domain,
    bio,
    photo,
    linkedinUrl,
    isAvailableForBooking
  }
`;

/* ─── Types ───────────────────────────────────────────────────────────── */

interface SanityMentor {
  _id: string;
  name: string;
  slug: string;
  designation: string | null;
  organisation: string | null;
  domain: string | null;
  bio: string | null;
  photo: { asset: { _ref: string } } | null;
  linkedinUrl: string | null;
  isAvailableForBooking: boolean;
}

/* ─── Domain label map ───────────────────────────────────────────────── */

const DOMAIN_LABELS: Record<string, string> = {
  "deep-tech": "Deep Tech",
  "fintech": "FinTech",
  "healthtech": "HealthTech",
  "agritech": "AgriTech",
  "cleantech": "CleanTech",
  "ai-ml": "AI / ML",
  "hardware-iot": "Hardware & IoT",
  "saas": "SaaS",
  "venture": "Venture & Investment",
};

/* ─── Mentor card ─────────────────────────────────────────────────────── */

function MentorCard({ mentor }: { mentor: SanityMentor }) {
  const photoUrl = mentor.photo
    ? urlFor(mentor.photo).width(200).height(200).fit("crop").auto("format").url()
    : null;

  const initials = mentor.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const domainLabel = mentor.domain ? (DOMAIN_LABELS[mentor.domain] ?? mentor.domain) : null;

  return (
    <article className="bg-white rounded-2xl border border-slate-200 p-6
                        hover:shadow-xl hover:shadow-slate-200/70 hover:-translate-y-1
                        transition-all duration-300 flex flex-col h-full group">

      {/* Avatar */}
      <div className="flex items-start gap-4 mb-4">
        <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0
                        ring-2 ring-slate-100 group-hover:ring-cyan-200 transition-all">
          {photoUrl ? (
            <Image
              src={photoUrl}
              alt={mentor.name}
              fill
              className="object-cover"
              sizes="64px"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-cyan-500 to-slate-700
                            flex items-center justify-center text-white text-lg font-bold select-none">
              {initials}
            </div>
          )}
        </div>

        <div className="min-w-0">
          <h3 className="font-bold text-slate-900 leading-snug truncate">{mentor.name}</h3>
          {mentor.designation && (
            <p className="text-xs text-slate-500 mt-0.5 leading-snug line-clamp-2">
              {mentor.designation}
            </p>
          )}
        </div>
      </div>

      {/* Domain badge */}
      {domainLabel && (
        <span className="inline-flex self-start mb-3 px-2.5 py-1 rounded-full
                         bg-cyan-50 border border-cyan-200 text-cyan-700 text-xs font-medium">
          {domainLabel}
        </span>
      )}

      {/* Bio excerpt */}
      {mentor.bio && (
        <p className="text-sm text-slate-600 leading-relaxed line-clamp-3 flex-grow mb-4">
          {mentor.bio}
        </p>
      )}

      {/* Footer */}
      <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between gap-3">

        {/* Availability badge */}
        <span className={`flex items-center gap-1.5 text-xs font-medium
          ${mentor.isAvailableForBooking
            ? "text-emerald-600"
            : "text-slate-400"
          }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${mentor.isAvailableForBooking ? "bg-emerald-500 animate-pulse" : "bg-slate-300"}`} />
          {mentor.isAvailableForBooking ? "Accepting bookings" : "Fully booked"}
        </span>

        {/* Action links */}
        <div className="flex items-center gap-2">
          {mentor.linkedinUrl && (
            <a
              href={mentor.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${mentor.name} on LinkedIn`}
              className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 transition-all"
            >
              <ExternalLink size={14} />
            </a>
          )}
          {mentor.slug && mentor.isAvailableForBooking && (
            <Link
              href={`/mentors/${mentor.slug}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                         bg-slate-900 text-white text-xs font-semibold
                         hover:bg-cyan-600 transition-colors duration-150"
            >
              <CalendarDays size={12} />
              Book
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}

/* ─── Page ────────────────────────────────────────────────────────────── */

export default async function MentorsPage() {
  const mentors = await client.fetch<SanityMentor[]>(
    MENTORS_QUERY,
    {},
    { cache: 'no-store' }
  );

  const available = mentors.filter((m) => m.isAvailableForBooking);
  const full = mentors.filter((m) => !m.isAvailableForBooking);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      {/* ── Hero ── */}
      <section className="bg-[#0F172A] pt-28 pb-16 px-4 text-center">
        <span className="inline-block px-3 py-1 mb-4 rounded-full border border-cyan-500/30
                         bg-cyan-500/10 text-cyan-400 text-xs font-semibold tracking-widest uppercase">
          Mentor Network
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
          Learn from the Best
        </h1>
        <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Our mentor pool brings together investors, serial entrepreneurs, and domain experts
          committed to accelerating JSS STEP's deep-tech cohort.
        </p>

        {/* Quick stats */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-8">
          <div className="text-center">
            <p className="text-3xl font-bold text-white">{mentors.length}</p>
            <p className="text-xs text-slate-500 mt-1 uppercase tracking-wide">Mentors</p>
          </div>
          <div className="w-px h-10 bg-slate-700 hidden sm:block" />
          <div className="text-center">
            <p className="text-3xl font-bold text-cyan-400">{available.length}</p>
            <p className="text-xs text-slate-500 mt-1 uppercase tracking-wide">Accepting Bookings</p>
          </div>
          <div className="w-px h-10 bg-slate-700 hidden sm:block" />
          <div className="flex items-center gap-2 text-slate-400">
            <Users size={18} />
            <span className="text-sm">1:1 · 60 min sessions</span>
          </div>
        </div>
      </section>

      {/* ── Mentor grid ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {mentors.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Users size={40} className="text-slate-300 mb-4" />
            <h2 className="text-lg font-semibold text-slate-700 mb-2">No mentors yet</h2>
            <p className="text-sm text-slate-400">Check back soon.</p>
          </div>
        ) : (
          <>
            {available.length > 0 && (
              <div className="mb-14">
                <h2 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Accepting Bookings
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {available.map((mentor) => (
                    <MentorCard key={mentor._id} mentor={mentor} />
                  ))}
                </div>
              </div>
            )}

            {full.length > 0 && (
              <div className="opacity-75">
                <h2 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-slate-300" />
                  Fully Booked
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {full.map((mentor) => (
                    <MentorCard key={mentor._id} mentor={mentor} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
