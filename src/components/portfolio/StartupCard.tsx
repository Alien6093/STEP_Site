"use client";

import Link from "next/link";
import Image from "next/image";
import { ExternalLink, Users, CalendarDays } from "lucide-react";
import Badge from "@/components/shared/Badge";
import type { Startup } from "@/lib/data/startups";

/* ─── Helpers ────────────────────────────────────────────────────────── */

function stageBadgeVariant(
  stage: Startup["stage"]
): "primary" | "success" | "secondary" {
  if (stage === "Active")    return "primary";
  if (stage === "Alumni")    return "success";
  return "secondary"; // Graduated
}

/** Derive 1-2 uppercase initials from a startup name */
function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/* ─── Logo ────────────────────────────────────────────────────────────── */

function StartupLogo({ name, logoUrl }: { name: string; logoUrl?: string | null }) {
  if (logoUrl) {
    return (
      <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-slate-100 shrink-0">
        <Image
          src={logoUrl}
          alt={`${name} logo`}
          fill
          sizes="48px"
          className="object-contain p-1"
        />
      </div>
    );
  }

  /* Stylised initials fallback */
  return (
    <div
      className="w-12 h-12 rounded-xl shrink-0 flex items-center justify-center
                 bg-gradient-to-br from-cyan-500/20 to-slate-200
                 border border-slate-200 select-none"
    >
      <span className="text-sm font-bold text-slate-700 tracking-tight">
        {initials(name)}
      </span>
    </div>
  );
}

/* ─── Component ──────────────────────────────────────────────────────── */

export default function StartupCard({ startup }: { startup: Startup }) {
  const {
    name,
    sector,
    stage,
    cohortYear,
    description,
    founders,
    website,
    logo,
  } = startup;

  return (
    <article
      className="bg-white rounded-2xl p-6 border border-slate-200
                 hover:shadow-xl hover:shadow-slate-200/70 hover:-translate-y-1
                 transition-all duration-300 flex flex-col h-full group"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <StartupLogo name={name} logoUrl={logo} />
          <h3 className="text-xl font-bold text-slate-900 leading-tight truncate">
            {name}
          </h3>
        </div>

        {website ? (
          <Link
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Visit ${name} website`}
            className="shrink-0 text-slate-300 hover:text-cyan-500
                       transition-colors duration-200 mt-0.5"
          >
            <ExternalLink size={16} />
          </Link>
        ) : (
          <span className="shrink-0 text-slate-200 mt-0.5">
            <ExternalLink size={16} />
          </span>
        )}
      </div>

      {/* Badges */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <Badge variant="outline">{sector}</Badge>
        <Badge variant={stageBadgeVariant(stage)}>{stage}</Badge>
      </div>

      {/* Description */}
      <p className="text-sm text-slate-600 leading-relaxed flex-grow">
        {description}
      </p>

      {/* Footer */}
      <div className="border-t border-slate-100 pt-4 mt-6 flex flex-col gap-1.5">
        <div className="flex items-center gap-1.5 text-sm text-slate-500">
          <Users size={13} className="text-slate-400 shrink-0" />
          <span>
            <span className="font-medium text-slate-700">Founders:</span>{" "}
            {founders}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-slate-500">
          <CalendarDays size={13} className="text-slate-400 shrink-0" />
          <span>
            <span className="font-medium text-slate-700">Cohort:</span>{" "}
            {cohortYear}
          </span>
        </div>
      </div>
    </article>
  );
}
