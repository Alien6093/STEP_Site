"use client";

import { useState } from "react";
import { ChevronRight, Loader2 } from "lucide-react";

/* ─── Types ───────────────────────────────────────────────────────────── */

/** A single available slot row from Supabase mentor_slots */
export interface MentorSlot {
  id:        string;   // UUID — passed to /api/bookings as slotId
  slot_date: string;   // ISO date, e.g. "2026-04-23"
  slot_time: string;   // e.g. "10:00 AM"
}

interface DateGroup {
  isoDate: string;
  day:     string;   // "Wed"
  date:    string;   // "23"
  month:   string;   // "Apr"
  slots:   MentorSlot[];
}

/* ─── Props ───────────────────────────────────────────────────────────── */

interface SlotPickerProps {
  slots:        MentorSlot[];
  isLoading?:   boolean;
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
        day:   d.toLocaleDateString("en-GB", { weekday: "short" }),
        date:  String(d.getDate()),
        month: d.toLocaleDateString("en-GB", { month: "short" }),
        slots: daySlots,
      };
    });
}

/* ─── Component ───────────────────────────────────────────────────────── */

export default function SlotPicker({ slots, isLoading, onSelectSlot }: SlotPickerProps) {
  const [selectedDate,   setSelectedDate]   = useState<string | null>(null);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

  const groups       = groupSlotsByDate(slots);
  const activeDateGroup = groups.find((g) => g.isoDate === selectedDate);

  const handleSelectDate = (isoDate: string) => {
    setSelectedDate(isoDate);
    setSelectedSlotId(null);
  };

  const handleSelectTime = (slot: MentorSlot) => {
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
            return (
              <button
                key={group.isoDate}
                type="button"
                onClick={() => handleSelectDate(group.isoDate)}
                aria-pressed={isSelected}
                aria-label={`${group.day} ${group.date} ${group.month}`}
                className={`
                  flex flex-col items-center justify-center gap-0.5 shrink-0
                  w-16 py-3.5 rounded-xl border text-center
                  transition-all duration-150 cursor-pointer
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400
                  ${isSelected
                    ? "bg-cyan-400 border-cyan-400 text-slate-900 shadow-md shadow-cyan-400/20"
                    : "bg-slate-800 border-slate-700 text-slate-300 hover:border-cyan-400/60 hover:text-white"
                  }
                `}
              >
                <span className={`text-[10px] font-semibold tracking-wider uppercase ${isSelected ? "text-slate-900" : "text-slate-500"}`}>
                  {group.day}
                </span>
                <span className={`text-xl font-bold leading-none ${isSelected ? "text-slate-900" : "text-white"}`}>
                  {group.date}
                </span>
                <span className={`text-[10px] font-medium ${isSelected ? "text-slate-700" : "text-slate-500"}`}>
                  {group.month}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Time grid — shown once a date is picked ── */}
      {activeDateGroup && (
        <div>
          <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase mb-3">
            Select a time
            <span className="ml-2 normal-case text-slate-600 font-normal tracking-normal">
              ({activeDateGroup.slots.length} slot{activeDateGroup.slots.length !== 1 ? "s" : ""} available)
            </span>
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {activeDateGroup.slots.map((slot) => {
              const isSelected = selectedSlotId === slot.id;
              return (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() => handleSelectTime(slot)}
                  aria-pressed={isSelected}
                  className={`
                    py-3 px-4 rounded-xl border text-sm font-medium
                    transition-all duration-150 cursor-pointer
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400
                    ${isSelected
                      ? "bg-cyan-400 border-cyan-400 text-slate-900 shadow-md shadow-cyan-400/20"
                      : "bg-slate-800 border-slate-700 text-slate-300 hover:border-cyan-400 hover:text-white"
                    }
                  `}
                >
                  {slot.slot_time}
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
