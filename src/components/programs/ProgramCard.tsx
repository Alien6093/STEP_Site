"use client";

import Link from "next/link";
import { CheckCircle2, Clock, DollarSign, ArrowRight } from "lucide-react";
import Badge from "@/components/shared/Badge";

/* ─── Props ──────────────────────────────────────────────────────────── */

interface ProgramCardProps {
  title: string;
  tagline: string;
  duration: string;
  funding?: string;
  benefits: string[];
  link?: string;
}

/* ─── Component ──────────────────────────────────────────────────────── */

export default function ProgramCard({
  title,
  tagline,
  duration,
  funding,
  benefits,
  link = "/apply",
}: ProgramCardProps) {
  return (
    <div
      className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm
                 hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-300
                 grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8"
    >
      {/* ── Left: Identity ── */}
      <div className="flex flex-col gap-5">
        {/* Title + tagline */}
        <div>
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">
            {title}
          </h3>
          <p className="text-sm text-slate-500 leading-relaxed">{tagline}</p>
        </div>

        {/* Duration & Funding pills */}
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium
                           text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full">
            <Clock size={12} />
            {duration}
          </span>

          {funding && (
            <Badge variant="primary">
              <span className="flex items-center gap-1">
                <DollarSign size={10} />
                {funding}
              </span>
            </Badge>
          )}
        </div>

        {/* CTA */}
        <div className="mt-auto pt-4">
          <Link
            href={link}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full
                       w-full sm:w-auto bg-slate-900 text-white text-sm font-semibold
                       hover:bg-cyan-600 hover:shadow-md hover:shadow-cyan-500/20
                       hover:-translate-y-0.5 transition-all duration-300 group"
          >
            Apply for this Program
            <ArrowRight
              size={14}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>

      {/* ── Right: Benefits ── */}
      <div className="flex flex-col gap-3">
        <p className="text-xs font-semibold tracking-widest uppercase text-slate-400 mb-1">
          What you get
        </p>
        <ul className="space-y-3">
          {benefits.map((benefit) => (
            <li
              key={benefit}
              className="flex items-start gap-3 text-sm text-slate-600"
            >
              <CheckCircle2
                size={16}
                className="text-emerald-500 shrink-0 mt-0.5"
                strokeWidth={2.5}
              />
              {benefit}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
