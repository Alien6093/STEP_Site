"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  CalendarPlus,
  XCircle,
  Clock,
  Video,
  CalendarDays,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

/* ─── Types ───────────────────────────────────────────────────────────── */

export type BookingStatus = "upcoming" | "past" | "cancelled";

export interface Booking {
  id:           string;
  slot_id:      string;
  mentor_name:  string;
  mentor_title: string;
  mentor_email: string;
  topic:        string;
  slot_date:    string;   // ISO date string, e.g. "2026-04-23"
  slot_time:    string;   // e.g. "10:00 AM"
  platform:     string;
  status:       BookingStatus;
}

/* ─── Helpers ─────────────────────────────────────────────────────────── */

function formatDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-GB", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
}

/* ─── Avatar ──────────────────────────────────────────────────────────── */

function MentorAvatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-cyan-500/80 to-slate-600
                    flex items-center justify-center text-white text-sm font-bold shrink-0 select-none">
      {initials}
    </div>
  );
}

/* ─── Status badge ────────────────────────────────────────────────────── */

function StatusBadge({ status }: { status: BookingStatus }) {
  if (status === "upcoming") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
                       bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
        Upcoming
      </span>
    );
  }
  if (status === "cancelled") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
                       bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium">
        <XCircle size={11} />
        Cancelled
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
                     bg-slate-700/50 border border-slate-600/40 text-slate-400 text-xs font-medium">
      <CheckCircle2 size={11} />
      Completed
    </span>
  );
}

/* ─── Booking card ────────────────────────────────────────────────────── */

function BookingCard({
  booking,
  index,
  onCancel,
}: {
  booking:  Booking;
  index:    number;
  onCancel: (id: string) => void;
}) {
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelError,  setCancelError]  = useState("");

  const isUpcoming  = booking.status === "upcoming";
  const isCancelled = booking.status === "cancelled";

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this session? The slot will be reopened.")) return;

    setCancelError("");
    setIsCancelling(true);

    try {
      const res = await fetch("/api/bookings/cancel", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId:   booking.id,
          slotId:      booking.slot_id,
          mentorName:  booking.mentor_name,
          mentorEmail: booking.mentor_email,
          date:        formatDate(booking.slot_date),
          time:        booking.slot_time,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error ?? "Cancellation failed.");
      }

      /* Optimistic UI — remove card from the list immediately */
      onCancel(booking.id);
    } catch (err: unknown) {
      setCancelError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.35, delay: index * 0.07, ease: "easeOut" }}
      className={`bg-slate-800/50 border rounded-xl p-5 sm:p-6 transition-shadow duration-200
        ${isUpcoming
          ? "border-slate-700 hover:border-slate-600 hover:shadow-lg hover:shadow-slate-900/40"
          : "border-slate-700/50 opacity-60"
        }`}
    >
      {/* Card top row */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex items-start gap-3">
          <MentorAvatar name={booking.mentor_name} />
          <div>
            <p className="text-sm font-semibold text-white leading-snug">{booking.mentor_name}</p>
            <p className="text-xs text-slate-400 mt-0.5 leading-snug">{booking.mentor_title}</p>
          </div>
        </div>
        <StatusBadge status={booking.status} />
      </div>

      {/* Topic */}
      <div className="mt-4 px-3 py-2.5 rounded-lg bg-slate-700/30 border border-slate-700/40">
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-0.5">Topic</p>
        <p className="text-sm text-slate-200 font-medium">{booking.topic}</p>
      </div>

      {/* Meta row */}
      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-400">
        <span className="flex items-center gap-1.5">
          <CalendarDays size={13} className="text-slate-500" />
          {formatDate(booking.slot_date)}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock size={13} className="text-slate-500" />
          {booking.slot_time}
        </span>
        <span className="flex items-center gap-1.5">
          <Video size={13} className="text-slate-500" />
          {booking.platform}
        </span>
      </div>

      {/* Error feedback */}
      {cancelError && (
        <p className="mt-3 flex items-center gap-1.5 text-xs text-red-400">
          <AlertCircle size={12} />{cancelError}
        </p>
      )}

      {/* Actions — upcoming only */}
      {isUpcoming && !isCancelled && (
        <div className="mt-5 flex flex-wrap items-center gap-3 pt-4 border-t border-slate-700/50">
          <a
            href={(() => {
              /* Build a Google Calendar "add event" URL from slot data */
              const startIso = `${booking.slot_date}T${
                /* Convert "10:00 AM" → "10:00:00" */
                (() => {
                  const [time, meridiem] = booking.slot_time.split(" ");
                  const [h, m] = time.split(":");
                  let hour = parseInt(h, 10);
                  if (meridiem === "PM" && hour !== 12) hour += 12;
                  if (meridiem === "AM" && hour === 12) hour = 0;
                  return `${String(hour).padStart(2, "0")}:${m}:00`;
                })()
              }`;
              const params = new URLSearchParams({
                action: "TEMPLATE",
                text:   `Mentoring Session with ${booking.mentor_name}`,
                dates:  `${startIso.replace(/[-:]/g, "")}/${startIso.replace(/[-:]/g, "")}`,
                details: booking.topic,
              });
              return `https://calendar.google.com/calendar/render?${params.toString()}`;
            })()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                       text-slate-300 bg-slate-700/40 border border-slate-600/60
                       hover:text-white hover:bg-slate-700 hover:border-slate-500
                       transition-all duration-150"
          >
            <CalendarPlus size={14} />
            Add to Calendar
          </a>

          <button
            type="button"
            onClick={handleCancel}
            disabled={isCancelling}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                       text-slate-400 border border-slate-700
                       hover:text-red-400 hover:border-red-500/40 hover:bg-red-500/5
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-150"
          >
            {isCancelling ? (
              <><Loader2 size={14} className="animate-spin" /> Cancelling…</>
            ) : (
              <><XCircle size={14} /> Cancel Session</>
            )}
          </button>
        </div>
      )}
    </motion.div>
  );
}

/* ─── Section ─────────────────────────────────────────────────────────── */

function Section({
  title,
  bookings,
  emptyMessage,
  startIndex,
  onCancel,
}: {
  title:        string;
  bookings:     Booking[];
  emptyMessage: string;
  startIndex:   number;
  onCancel:     (id: string) => void;
}) {
  return (
    <section>
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-base font-semibold text-white">{title}</h2>
        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-700
                         text-xs font-semibold text-slate-300">
          {bookings.length}
        </span>
      </div>

      {bookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 rounded-xl
                        border border-dashed border-slate-700/60 text-center">
          <AlertCircle size={28} className="text-slate-600 mb-3" />
          <p className="text-sm text-slate-500">{emptyMessage}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {bookings.map((b, i) => (
            <BookingCard
              key={b.id}
              booking={b}
              index={startIndex + i}
              onCancel={onCancel}
            />
          ))}
        </div>
      )}
    </section>
  );
}

/* ─── Root component ──────────────────────────────────────────────────── */

export default function BookingsList({
  initialBookings,
}: {
  initialBookings: Booking[];
}) {
  const router = useRouter();

  /* Local state drives optimistic UI; router.refresh() syncs server data */
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);

  const handleCancel = (cancelledId: string) => {
    /* Optimistically remove from list */
    setBookings((prev) => prev.filter((b) => b.id !== cancelledId));
    /* Revalidate server data in background */
    router.refresh();
  };

  const upcoming = bookings.filter((b) => b.status === "upcoming");
  const past      = bookings.filter((b) => b.status !== "upcoming");

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-white">My Bookings</h1>
        <p className="mt-1 text-sm text-slate-400">
          Manage your upcoming mentoring sessions and review past meetings.
        </p>
      </div>

      <Section
        title="Upcoming Sessions"
        bookings={upcoming}
        emptyMessage="You have no upcoming sessions. Book a mentoring call to get started."
        startIndex={0}
        onCancel={handleCancel}
      />

      <Section
        title="Past Sessions"
        bookings={past}
        emptyMessage="No completed sessions yet."
        startIndex={upcoming.length}
        onCancel={handleCancel}
      />
    </div>
  );
}
