import type { Metadata } from "next";
import { Suspense } from "react";
import { CalendarDays } from "lucide-react";
import { client } from "@/sanity/client";
import EventCard from "@/components/events/EventCard";
import type { SanityEvent } from "@/components/events/EventCard";
import SectionHeading from "@/components/shared/SectionHeading";
import ScrollFadeIn from "@/components/shared/ScrollFadeIn";
import { Skeleton } from "@/components/ui/Skeleton";

export const revalidate = 1800; // ISR — regenerate at most every 30 minutes

/* ─── Metadata ────────────────────────────────────────────────────────── */

export const metadata: Metadata = {
  title: "Events | JSS STEP",
  description:
    "Join JSS STEP workshops, demo days, and founder mixers. Connect with investors, mentors, and the deep-tech startup community.",
};

/* ─── GROQ query ──────────────────────────────────────────────────────── */

const EVENTS_QUERY = `
  *[_type == "event"] | order(date desc) {
    _id,
    title,
    eventType,
    date,
    time,
    venue,
    description,
    externalRegistrationUrl,
    isPastEvent
  }
`;

/* ─── Hero ────────────────────────────────────────────────────────────── */

function EventsHero() {
  return (
    <section className="relative pt-32 pb-16 bg-slate-900 text-white text-center overflow-hidden">
      {/* Orbs */}
      <div className="absolute w-[380px] h-[380px] rounded-full bg-cyan-500/10
                      blur-[100px] -top-20 -left-16 pointer-events-none" />
      <div className="absolute w-[280px] h-[280px] rounded-full bg-violet-500/10
                      blur-[90px] bottom-0 right-0 pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col items-center gap-5 animate-[fadeUp_0.65s_cubic-bezier(0.16,1,0.3,1)_both]">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border
                           border-cyan-500/30 bg-cyan-500/10 text-cyan-400
                           text-xs font-semibold tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Community &amp; Events
          </span>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tighter
                         text-white leading-[1.06]">
            Events, Workshops &amp;{" "}
            <span className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(90deg,#06B6D4 0%,#8B5CF6 100%)" }}>
              Demo Days
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-xl">
            Join the JSS STEP community and connect with investors, mentors, and fellow founders
            at our curated events throughout the year.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ─── Empty state ─────────────────────────────────────────────────────── */

function NoEvents() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center gap-5">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center
                      ring-1 ring-slate-200 shadow-inner">
        <CalendarDays size={28} className="text-slate-400" strokeWidth={1.5} />
      </div>
      <div className="flex flex-col gap-1.5 max-w-xs">
        <h3 className="text-lg font-semibold text-slate-800">
          No upcoming events at the moment
        </h3>
        <p className="text-sm text-slate-500 leading-relaxed">
          Check back soon — we regularly host workshops, demo days, and founder mixers.
        </p>
      </div>
    </div>
  );
}

/* ─── Skeleton grid (used as Suspense fallback) ─────────────────────────── */

function EventsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl border border-slate-100 p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
          <Skeleton className="h-6 w-4/5 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-3 w-full rounded" />
            <Skeleton className="h-3 w-3/4 rounded" />
          </div>
          <div className="space-y-1.5 mt-auto">
            <Skeleton className="h-3 w-2/5 rounded" />
            <Skeleton className="h-3 w-3/5 rounded" />
          </div>
          <Skeleton className="h-10 w-full rounded-full mt-2" />
        </div>
      ))}
    </div>
  );
}

/* ─── Data layer (async Server Component, streams independently) ────────── */

async function EventsData() {
  const events = await client.fetch<SanityEvent[]>(
    EVENTS_QUERY,
    {},
    { next: { revalidate: 1800 } }
  );

  const upcoming = events.filter((e) => !e.isPastEvent);
  const past     = events.filter((e) =>  e.isPastEvent);

  /* ── No events at all ── */
  if (!events || events.length === 0) {
    return <NoEvents />;
  }

  return (
    <div className="space-y-16">

      {/* ── Upcoming Events ── */}
      <section aria-labelledby="upcoming-heading">
        <ScrollFadeIn>
          <SectionHeading
            title={<span id="upcoming-heading">Upcoming Events</span>}
            align="left"
            className="mb-8"
          />
        </ScrollFadeIn>

        {upcoming.length === 0 ? (
          <NoEvents />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {upcoming.map((event, i) => (
              <ScrollFadeIn key={event._id} delay={i * 0.09}>
                <EventCard event={event} />
              </ScrollFadeIn>
            ))}
          </div>
        )}
      </section>

      {/* Only render Past Events section if there are any */}
      {past.length > 0 && (
        <>
          <hr className="border-slate-100" />

          <section aria-labelledby="past-heading">
            <ScrollFadeIn>
              <SectionHeading
                title={<span id="past-heading">Past Events</span>}
                align="left"
                className="mb-8"
              />
            </ScrollFadeIn>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 opacity-80">
              {past.map((event, i) => (
                <ScrollFadeIn key={event._id} delay={i * 0.09}>
                  <EventCard event={event} />
                </ScrollFadeIn>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

/* ─── Page ────────────────────────────────────────────────────────────── */

export default function EventsPage() {
  return (
    <div className="w-full">
      {/* Hero renders synchronously — no data dependency */}
      <EventsHero />

      {/* Events grid streams in once Sanity responds */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-24">
        <Suspense fallback={<EventsGridSkeleton />}>
          <EventsData />
        </Suspense>
      </div>
    </div>
  );
}
