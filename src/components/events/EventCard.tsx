"use client";

import { Calendar, Clock, MapPin, ArrowRight } from "lucide-react";
import Badge from "@/components/shared/Badge";

/* ─── Sanity event shape (matches event schema) ────────────────────────── */

export interface SanityEvent {
  _id:                     string;
  title:                   string;
  eventType:               "Workshop" | "Demo Day" | "Webinar" | "Mixer" | "Conference";
  date:                    string;   // ISO date string from Sanity, e.g. "2026-04-28"
  time:                    string | null;
  venue:                   string | null;
  description:             string | null;
  externalRegistrationUrl: string | null;
  isPastEvent:             boolean;
}

/* ─── Badge variant helper ─────────────────────────────────────────────── */

function typeBadgeVariant(
  type: SanityEvent["eventType"]
): "primary" | "secondary" | "success" | "outline" {
  switch (type) {
    case "Demo Day":   return "primary";
    case "Workshop":   return "success";
    case "Webinar":    return "secondary";
    case "Conference": return "primary";
    default:           return "outline"; // Mixer
  }
}

/* ─── Date formatter ───────────────────────────────────────────────────── */
/*
 * Sanity date fields return ISO strings ("2026-04-28").
 * We format them for display without a heavy date library.
 */
function formatDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  const d = new Date(year, month - 1, day);
  return d.toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric",
  });
}

/* ─── Component ────────────────────────────────────────────────────────── */

export default function EventCard({ event }: { event: SanityEvent }) {
  const {
    title, eventType, date, time, venue,
    description, externalRegistrationUrl, isPastEvent,
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
        <Badge variant={typeBadgeVariant(eventType)}>{eventType}</Badge>
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
          {formatDate(date)}
        </li>
        {time && (
          <li className="flex items-center gap-2 text-sm text-slate-600">
            <Clock size={14} className="text-slate-400 shrink-0" />
            {time}
          </li>
        )}
        {venue && (
          <li className="flex items-start gap-2 text-sm text-slate-600">
            <MapPin size={14} className="text-slate-400 shrink-0 mt-0.5" />
            {venue}
          </li>
        )}
      </ul>

      {/* Description */}
      {description && (
        <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 flex-grow">
          {description}
        </p>
      )}

      {/* Footer CTA */}
      <div className="pt-5 mt-auto">
        {isPastEvent ? (
          /* Past events — no registration link, show a muted label */
          <span
            className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5
                       rounded-full text-sm font-semibold w-full sm:w-auto mt-4
                       bg-slate-100 text-slate-500 cursor-default select-none"
          >
            Event Completed
          </span>
        ) : externalRegistrationUrl ? (
          /* Upcoming event with a registration link — external anchor */
          <a
            href={externalRegistrationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5
                       rounded-full text-sm font-semibold w-full sm:w-auto mt-4
                       bg-slate-900 text-white hover:bg-cyan-600
                       hover:shadow-md hover:shadow-cyan-500/20 hover:-translate-y-0.5
                       transition-all duration-300 group/btn"
          >
            Register Now
            <ArrowRight
              size={14}
              className="transition-transform duration-200 group-hover/btn:translate-x-1"
            />
          </a>
        ) : (
          /* Upcoming event but no external URL yet */
          <span
            className="inline-flex items-center justify-center px-5 py-2.5
                       rounded-full text-sm font-medium w-full sm:w-auto mt-4
                       bg-slate-100 text-slate-500 cursor-default select-none"
          >
            Registration Coming Soon
          </span>
        )}
      </div>
    </article>
  );
}
