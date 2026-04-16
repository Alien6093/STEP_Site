"use client";

import Link from "next/link";
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
  } = startup;

  return (
    <article
      className="bg-white rounded-2xl p-6 border border-slate-200
                 hover:shadow-xl hover:shadow-slate-200/70 hover:-translate-y-1
                 transition-all duration-300 flex flex-col h-full group"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="text-xl font-bold text-slate-900 leading-tight">
          {name}
        </h3>

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
