import type { Metadata } from "next";
import EventCard from "@/components/events/EventCard";
import SectionHeading from "@/components/shared/SectionHeading";
import ScrollFadeIn from "@/components/shared/ScrollFadeIn";
import { eventsData } from "@/lib/data/events";

/* ─── Metadata ───────────────────────────────────────────────────────── */

export const metadata: Metadata = {
  title: "Events | JSS STEP",
  description:
    "Join JSS STEP workshops, demo days, and founder mixers. Connect with investors, mentors, and the deep-tech startup community.",
};

/* ─── Derived data ───────────────────────────────────────────────────── */

const upcomingEvents = eventsData.filter((e) => !e.isPastEvent);
const pastEvents     = eventsData.filter((e) =>  e.isPastEvent);

/* ─── Hero ───────────────────────────────────────────────────────────── */

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

/* ─── Page ───────────────────────────────────────────────────────────── */

export default function EventsPage() {
  return (
    <div className="w-full">
      <EventsHero />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-24 space-y-16">

        {/* ── Upcoming Events ── */}
        <section aria-labelledby="upcoming-heading">
          <ScrollFadeIn>
            <SectionHeading
              title={<span id="upcoming-heading">Upcoming Events</span>}
              align="left"
              className="mb-8"
            />
          </ScrollFadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {upcomingEvents.map((event, i) => (
              <ScrollFadeIn key={event.id} delay={i * 0.09}>
                <EventCard event={event} />
              </ScrollFadeIn>
            ))}
          </div>
        </section>

        {/* Divider */}
        <hr className="border-slate-100" />

        {/* ── Past Events ── */}
        <section aria-labelledby="past-heading">
          <ScrollFadeIn>
            <SectionHeading
              title={<span id="past-heading">Past Events</span>}
              align="left"
              className="mb-8"
            />
          </ScrollFadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 opacity-80">
            {pastEvents.map((event, i) => (
              <ScrollFadeIn key={event.id} delay={i * 0.09}>
                <EventCard event={event} />
              </ScrollFadeIn>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
