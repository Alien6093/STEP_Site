"use client";

import { useState, useEffect } from "react";
import { ChevronRight, Loader2 } from "lucide-react";
import { isSlotBooked } from "@/lib/timeUtils";

/* ─── Types ───────────────────────────────────────────────────────────── */

/** A single slot row from Supabase mentor_slots */
export interface MentorSlot {
  id: string;   // UUID — passed to /api/bookings as slotId
  slot_date: string;   // ISO date, e.g. "2026-04-23"
  slot_time: string;   // "HH:MM:SS" — compared against IST
  is_booked: boolean;  // true if already taken in the DB
}

interface DateGroup {
  isoDate: string;
  day: string;   // "Wed"
  date: string;   // "23"
  month: string;   // "Apr"
  slots: MentorSlot[];
}

/* ─── Props ───────────────────────────────────────────────────────────── */

interface SlotPickerProps {
  slots: MentorSlot[];
  isLoading?: boolean;
  /** Called whenever both a date AND a time slot are selected */
  onSelectSlot: (date: string, time: string, slotId: string) => void;
}

/* ─── Helpers ─────────────────────────────────────────────────────────── */

function groupSlotsByDate(slots: MentorSlot[]): DateGroup[] {
  const map = new Map<string, MentorSlot[]>();

  for (const slot of slots) {
    const existing = map.get(slot.slot_date) ?? [];
    map.set(slot.slot_date, [...existing, slot]);
  }

  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([isoDate, daySlots]) => {
      const d = new Date(isoDate + "T00:00:00");
      return {
        isoDate,
        day: d.toLocaleDateString("en-GB", { weekday: "short" }),
        date: String(d.getDate()),
        month: d.toLocaleDateString("en-GB", { month: "short" }),
        slots: daySlots,
      };
    });
}

/* ─── Availability helpers ────────────────────────────────────────────── */

/**
 * Returns true when every slot on a given day is unavailable
 * (either already booked in the DB or past the current IST time).
 * Uses isSlotBooked from timeUtils — never raw Date().
 */
function isDayFullyBooked(daySlots: MentorSlot[]): boolean {
  if (daySlots.length === 0) return true;
  return daySlots.every((s) => isSlotBooked(s));
}

/* ─── Component ───────────────────────────────────────────────────────── */

export default function SlotPicker({ slots, isLoading, onSelectSlot }: SlotPickerProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

  /**
   * Hydration guard — isSlotBooked relies on the current IST time which is
   * only available in the browser. We defer all availability evaluation until
   * after the first client render to prevent a hydration mismatch crash.
   */
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true); }, []);

  const groups = groupSlotsByDate(slots);
  const activeDateGroup = groups.find((g) => g.isoDate === selectedDate);

  const handleSelectDate = (isoDate: string, fullyBooked: boolean) => {
    if (fullyBooked) return; // guard: ignore clicks on disabled day cards
    setSelectedDate(isoDate);
    setSelectedSlotId(null);
  };

  const handleSelectTime = (slot: MentorSlot, unavailable: boolean) => {
    if (unavailable) return; // guard: ignore clicks on disabled time buttons
    setSelectedSlotId(slot.id);
    if (selectedDate) {
      onSelectSlot(selectedDate, slot.slot_time, slot.id);
    }
  };

  /* ── Loading skeleton ── */
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12 text-slate-500 gap-2">
        <Loader2 size={16} className="animate-spin" />
        <span className="text-sm">Loading available slots…</span>
      </div>
    );
  }

  /* ── Empty state ── */
  if (groups.length === 0) {
    return (
      <div className="py-10 text-center">
        <p className="text-sm text-slate-500">
          No available slots right now. Check back soon.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* ── Date row ── */}
      <div>
        <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase mb-3">
          Select a date
        </p>

        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1 -mx-1 px-1">
          {groups.map((group) => {
            const isSelected = selectedDate === group.isoDate;
            // Only evaluate availability after mount to avoid hydration mismatch
            const fullyBooked = isMounted && isDayFullyBooked(group.slots);
            return (
              <button
                key={group.isoDate}
                type="button"
                onClick={() => handleSelectDate(group.isoDate, fullyBooked)}
                disabled={fullyBooked}
                aria-pressed={isSelected}
                aria-label={`${group.day} ${group.date} ${group.month}${fullyBooked ? " — Fully Booked" : ""
                  }`}
                className={`
                  flex flex-col items-center justify-center gap-0.5 shrink-0
                  w-16 py-3.5 rounded-xl border text-center
                  transition-all duration-150
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400
                  ${fullyBooked
                    ? "bg-slate-800/40 border-slate-700/40 opacity-50 cursor-not-allowed"
                    : isSelected
                      ? "bg-cyan-400 border-cyan-400 text-slate-900 shadow-md shadow-cyan-400/20 cursor-pointer"
                      : "bg-slate-800 border-slate-700 text-slate-300 hover:border-cyan-400/60 hover:text-white cursor-pointer"
                  }
                `}
              >
                <span className={`text-[10px] font-semibold tracking-wider uppercase ${fullyBooked ? "text-slate-600" : isSelected ? "text-slate-900" : "text-slate-500"
                  }`}>
                  {group.day}
                </span>
                <span className={`text-xl font-bold leading-none ${fullyBooked ? "text-slate-600" : isSelected ? "text-slate-900" : "text-white"
                  }`}>
                  {group.date}
                </span>
                <span className={`text-[10px] font-medium ${fullyBooked ? "text-slate-600" : isSelected ? "text-slate-700" : "text-slate-500"
                  }`}>
                  {group.month}
                </span>
                {/* "Fully Booked" badge — only shown after mount */}
                {fullyBooked && (
                  <span className="mt-1 text-[9px] font-semibold text-red-400 leading-tight">
                    Full
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Time grid — shown once a date is picked ── */}
      {activeDateGroup && (
        <div>
          {(() => {
            // Count available (bookable) slots for the label — client-only
            const availableCount = isMounted
              ? activeDateGroup.slots.filter((s) => !isSlotBooked(s)).length
              : activeDateGroup.slots.length;
            return (
              <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase mb-3">
                Select a time
                <span className="ml-2 normal-case text-slate-600 font-normal tracking-normal">
                  ({availableCount} slot{availableCount !== 1 ? "s" : ""} available)
                </span>
              </p>
            );
          })()}

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {activeDateGroup.slots.map((slot) => {
              const isSelected = selectedSlotId === slot.id;
              // Only evaluate availability after mount to avoid hydration mismatch
              const unavailable = isMounted && isSlotBooked(slot);
              return (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() => handleSelectTime(slot, unavailable)}
                  disabled={unavailable}
                  aria-pressed={isSelected}
                  aria-label={`${slot.slot_time}${unavailable ? " — Unavailable" : ""}`}
                  className={`
                    py-3 px-4 rounded-xl border text-sm font-medium
                    transition-all duration-150
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400
                    ${unavailable
                      ? "opacity-50 cursor-not-allowed bg-slate-800 text-gray-500 border-gray-700"
                      : isSelected
                        ? "bg-cyan-400 border-cyan-400 text-slate-900 shadow-md shadow-cyan-400/20 cursor-pointer"
                        : "bg-slate-800 border-slate-700 text-slate-300 hover:border-cyan-400 hover:text-white cursor-pointer"
                    }
                  `}
                >
                  {unavailable ? "Unavailable" : slot.slot_time}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Nudge when nothing selected ── */}
      {!selectedDate && (
        <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
          <ChevronRight size={12} className="text-slate-700 shrink-0" />
          Tap a date above to see available time slots.
        </div>
      )}
    </div>
  );
}
