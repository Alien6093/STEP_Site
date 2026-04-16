"use client";

import Link from "next/link";
import { Calendar, Clock, MapPin, ArrowRight } from "lucide-react";
import Badge from "@/components/shared/Badge";
import type { Event } from "@/lib/data/events";

/* ─── Badge variant for event type ──────────────────────────────────── */

function typeBadgeVariant(type: Event["type"]): "primary" | "secondary" | "success" | "outline" {
  switch (type) {
    case "Demo Day":    return "primary";
    case "Workshop":    return "success";
    case "Webinar":     return "secondary";
    case "Conference":  return "primary";
    default:            return "outline";   // Mixer
  }
}

/* ─── Component ──────────────────────────────────────────────────────── */

export default function EventCard({ event }: { event: Event }) {
  const {
    title, date, time, venue, type,
    description, link, isPastEvent,
  } = event;

  return (
    <article
      className="relative bg-white rounded-2xl p-6 border border-slate-200 overflow-hidden
                 flex flex-col h-full hover:shadow-xl hover:shadow-slate-200/70
                 hover:-translate-y-1 transition-all duration-300 group"
    >
      {/* Accent top stripe */}
      <div
        className={`absolute inset-x-0 top-0 h-1 rounded-t-2xl
          ${isPastEvent
            ? "bg-slate-300"
            : "bg-gradient-to-r from-cyan-500 to-violet-500"}`}
        aria-hidden
      />

      {/* Type + status badges */}
      <div className="flex items-center gap-2 flex-wrap mt-2">
        <Badge variant={typeBadgeVariant(type)}>{type}</Badge>
        {isPastEvent && (
          <Badge variant="secondary">Completed</Badge>
        )}
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-slate-900 mt-4 leading-snug">
        {title}
      </h3>

      {/* Details */}
      <ul className="my-4 space-y-2">
        <li className="flex items-center gap-2 text-sm text-slate-600">
          <Calendar size={14} className="text-slate-400 shrink-0" />
          {date}
        </li>
        <li className="flex items-center gap-2 text-sm text-slate-600">
          <Clock size={14} className="text-slate-400 shrink-0" />
          {time}
        </li>
        <li className="flex items-start gap-2 text-sm text-slate-600">
          <MapPin size={14} className="text-slate-400 shrink-0 mt-0.5" />
          {venue}
        </li>
      </ul>

      {/* Description */}
      <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 flex-grow">
        {description}
      </p>

      {/* Footer CTA */}
      <div className="pt-5 mt-auto">
        <Link
          href={link}
          className={`inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-semibold
                      transition-all duration-300 group/btn w-full sm:w-auto mt-4
                      ${isPastEvent
                        ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        : "bg-slate-900 text-white hover:bg-cyan-600 hover:shadow-md hover:shadow-cyan-500/20 hover:-translate-y-0.5"
                      }`}
        >
          {isPastEvent ? "View Recap" : "Register Now"}
          <ArrowRight
            size={14}
            className="transition-transform duration-200 group-hover/btn:translate-x-1"
          />
        </Link>
      </div>
    </article>
  );
}
