"use client";

import Link from "next/link";
import { CalendarDays, Clock, MapPin, ArrowRight } from "lucide-react";
import SectionHeading from "@/components/shared/SectionHeading";
import ScrollFadeIn from "@/components/shared/ScrollFadeIn";
import Badge from "@/components/shared/Badge";
import { eventsData, type Event } from "@/lib/data/events";

/* ─── Derived data — 2 nearest upcoming events ───────────────────────── */

const PREVIEW_EVENTS = eventsData
  .filter((e) => !e.isPastEvent)
  .slice(0, 2);

/* ─── Badge variant by type ──────────────────────────────────────────── */

function typeBadge(type: Event["type"]): "primary" | "secondary" | "success" | "outline" {
  if (type === "Demo Day")  return "primary";
  if (type === "Workshop")  return "success";
  if (type === "Webinar")   return "secondary";
  return "outline";
}

/* ─── Card ───────────────────────────────────────────────────────────── */

function EventPreviewCard({ event }: { event: Event }) {
  return (
    <div
      className="group relative bg-white rounded-2xl border border-slate-200 p-6
                 hover:shadow-xl hover:shadow-slate-200/60 hover:-translate-y-1
                 transition-all duration-300 flex flex-col gap-4 overflow-hidden"
    >
      {/* Accent bar */}
      <div
        className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r
                   from-cyan-500 to-violet-500 opacity-0 group-hover:opacity-100
                   transition-opacity duration-300"
      />

      {/* Badge + Date row */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <Badge variant={typeBadge(event.type)}>{event.type}</Badge>
        <span className="text-xs font-semibold text-slate-400 tracking-wide">
          {event.date}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold text-slate-900 leading-snug group-hover:text-cyan-700
                     transition-colors duration-200">
        {event.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 flex-grow">
        {event.description}
      </p>

      {/* Meta detail row */}
      <div className="flex flex-col gap-1.5 text-xs text-slate-400">
        <span className="flex items-center gap-1.5">
          <Clock size={12} className="shrink-0 text-cyan-500" />
          {event.time}
        </span>
        <span className="flex items-center gap-1.5">
          <MapPin size={12} className="shrink-0 text-cyan-500" />
          {event.venue}
        </span>
      </div>

      {/* CTA */}
      <Link
        href="/events"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-600
                   hover:text-cyan-700 transition-colors duration-200 mt-auto group/cta"
      >
        <CalendarDays size={14} />
        View Details
        <ArrowRight
          size={13}
          className="transition-transform duration-200 group-hover/cta:translate-x-1"
        />
      </Link>
    </div>
  );
}

/* ─── Section ────────────────────────────────────────────────────────── */

export default function EventsPreview() {
  return (
    <section className="py-24 bg-white" aria-labelledby="events-heading">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">

        <ScrollFadeIn>
          <SectionHeading
            label="Upcoming Events"
            title={<span id="events-heading">Connect with the Ecosystem</span>}
            subtitle="Workshops, demo days, and founder mixers — stay plugged into the JSS STEP community."
            align="center"
            className="mb-14"
          />
        </ScrollFadeIn>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {PREVIEW_EVENTS.map((event, i) => (
            <ScrollFadeIn key={event.id} delay={i * 0.1}>
              <EventPreviewCard event={event} />
            </ScrollFadeIn>
          ))}
        </div>

        {/* CTA */}
        <ScrollFadeIn delay={0.25}>
          <div className="flex justify-center">
            <Link
              href="/events"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full
                         bg-slate-900 text-white text-sm font-semibold
                         hover:bg-cyan-600 hover:shadow-lg hover:shadow-cyan-500/20
                         hover:-translate-y-0.5 transition-all duration-300"
            >
              View All Events
              <ArrowRight size={15} />
            </Link>
          </div>
        </ScrollFadeIn>
      </div>
    </section>
  );
}
