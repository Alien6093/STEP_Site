"use client";

import { useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarPlus,
  Clock,
  User,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ChevronDown,
  Trash2,
} from "lucide-react";

/* ─── Types ───────────────────────────────────────────────────────────── */

export interface SanityMentor {
  _id:  string;
  name: string;
}

interface SlotRow {
  mentor_sanity_id: string;
  mentor_name:      string;
  slot_date:        string; // YYYY-MM-DD
  slot_time:        string; // HH:mm:ss
  duration:         number;
  is_booked:        boolean;
}

interface PreviewSlot {
  slot_time:   string; // HH:mm:ss
  display:     string; // "10:00 AM"
  isDuplicate: boolean;
}

type FeedbackKind = "success" | "error" | "warning";
interface Feedback { kind: FeedbackKind; message: string; }

/* ─── Time helpers ────────────────────────────────────────────────────── */

/** "HH:mm" → total minutes from midnight */
function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

/** total minutes → "HH:mm:ss" — Postgres TIME format */
function toPostgresTime(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:00`;
}

/** total minutes → "h:mm AM/PM" — human display */
function toDisplayTime(mins: number): string {
  const h24    = Math.floor(mins / 60);
  const m      = mins % 60;
  const period = h24 >= 12 ? "PM" : "AM";
  const h12    = h24 % 12 || 12;
  return `${h12}:${String(m).padStart(2, "0")} ${period}`;
}

/**
 * Core chunk engine.
 * Guard: the while condition `cursor + duration <= endMins` ensures
 * the loop stops before any partial slot is created.
 */
function generateSlotTimes(
  startTime: string,
  endTime:   string,
  duration:  number,
): Array<{ pgTime: string; display: string }> {
  const startMins = toMinutes(startTime);
  const endMins   = toMinutes(endTime);
  if (startMins >= endMins) return [];

  const slots: Array<{ pgTime: string; display: string }> = [];
  let cursor = startMins;

  while (cursor + duration <= endMins) {
    slots.push({ pgTime: toPostgresTime(cursor), display: toDisplayTime(cursor) });
    cursor += duration;
  }
  return slots;
}

/* ─── Shared field sub-components ────────────────────────────────────── */

function FieldLabel({
  htmlFor,
  icon: Icon,
  children,
}: {
  htmlFor:  string;
  icon:     React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="flex items-center gap-1.5 text-xs font-semibold tracking-widest
                 text-slate-400 uppercase mb-1.5"
    >
      <Icon size={12} className="shrink-0" />
      {children}
    </label>
  );
}

const inputCls =
  "w-full px-4 py-3 rounded-xl text-sm bg-slate-800/80 border border-slate-700 " +
  "text-slate-100 placeholder:text-slate-600 " +
  "focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 " +
  "transition-all duration-150";

/* ─── Component ───────────────────────────────────────────────────────── */

export default function SlotGeneratorForm({ mentors }: { mentors: SanityMentor[] }) {
  const supabase = useMemo(() => createClient(), []);

  /* ── Form state ── */
  const [selectedMentorId, setSelectedMentorId] = useState("");
  const [slotDate,         setSlotDate]         = useState("");
  const [startTime,        setStartTime]        = useState("");
  const [endTime,          setEndTime]          = useState("");
  const [duration,         setDuration]         = useState<number>(30);

  /* ── UX state ── */
  const [isGenerating, setIsGenerating] = useState(false);
  const [feedback,     setFeedback]     = useState<Feedback | null>(null);
  const [preview,      setPreview]      = useState<PreviewSlot[] | null>(null);

  /* Derive mentor_name from selection (no second network call needed) */
  const selectedMentor = mentors.find((m) => m._id === selectedMentorId) ?? null;

  /* ── Live slot preview — zero network, instant feedback ── */
  const livePreview = useMemo(() => {
    if (!startTime || !endTime) return [];
    if (toMinutes(startTime) >= toMinutes(endTime)) return [];
    return generateSlotTimes(startTime, endTime, duration);
  }, [startTime, endTime, duration]);

  const timeError =
    startTime && endTime && toMinutes(startTime) >= toMinutes(endTime);

  /* ─── Main handler ─────────────────────────────────────────────────── */
  const handleGenerate = async () => {
    setFeedback(null);
    setPreview(null);

    /* Guard 1: all fields filled */
    if (!selectedMentorId) {
      setFeedback({ kind: "error", message: "Please select a mentor." }); return;
    }
    if (!slotDate) {
      setFeedback({ kind: "error", message: "Slot date is required." }); return;
    }
    if (!startTime || !endTime) {
      setFeedback({ kind: "error", message: "Start and end times are required." }); return;
    }

    /* Guard 1b: start strictly before end */
    if (toMinutes(startTime) >= toMinutes(endTime)) {
      setFeedback({ kind: "error", message: "Start time must be before end time." }); return;
    }

    /* Time math (remainder guard is in the while condition) */
    const generated = generateSlotTimes(startTime, endTime, duration);
    if (generated.length === 0) {
      setFeedback({
        kind: "warning",
        message: `No complete ${duration}-minute slot fits in the selected window.`,
      }); return;
    }

    setIsGenerating(true);
    try {
      /* Guard 3: check existing slots for this mentor + date */
      const { data: existing, error: fetchErr } = await supabase
        .from("mentor_slots")
        .select("slot_time")
        .eq("mentor_sanity_id", selectedMentorId)
        .eq("slot_date", slotDate);                // YYYY-MM-DD from <input type="date">

      if (fetchErr) throw new Error(`Duplicate check failed: ${fetchErr.message}`);

      const existingTimes = new Set<string>(
        (existing ?? []).map((r) => r.slot_time as string)
      );

      /* Build annotated preview */
      const previewSlots: PreviewSlot[] = generated.map(({ pgTime, display }) => ({
        slot_time:   pgTime,
        display,
        isDuplicate: existingTimes.has(pgTime),
      }));
      setPreview(previewSlots);

      /* Filter to net-new only */
      const mentorName = selectedMentor?.name ?? "";
      const validSlots: SlotRow[] = previewSlots
        .filter((s) => !s.isDuplicate)
        .map(({ slot_time }) => ({
          mentor_sanity_id: selectedMentorId,
          mentor_name:      mentorName,
          slot_date:        slotDate,    // YYYY-MM-DD — native from date input ✓
          slot_time,                     // HH:mm:ss   — from toPostgresTime()  ✓
          duration,
          is_booked:        false,
        }));

      if (validSlots.length === 0) {
        setFeedback({
          kind: "warning",
          message: "All these slots already exist in the database. Nothing inserted.",
        }); return;
      }

      /* Bulk insert */
      const { error: insertErr } = await supabase
        .from("mentor_slots")
        .insert(validSlots);

      if (insertErr) throw new Error(insertErr.message);

      const skipped = previewSlots.length - validSlots.length;
      setFeedback({
        kind: "success",
        message:
          `✓ Inserted ${validSlots.length} slot${validSlots.length !== 1 ? "s" : ""}` +
          (skipped > 0 ? ` (${skipped} duplicate${skipped !== 1 ? "s" : ""} skipped).` : "."),
      });
    } catch (err: unknown) {
      setFeedback({
        kind:    "error",
        message: err instanceof Error ? err.message : "Unexpected error — check the console.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  /* ─── Feedback style map ──────────────────────────────────────────── */
  const feedbackCls: Record<FeedbackKind, string> = {
    success: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
    error:   "bg-red-500/10    border-red-500/30    text-red-300",
    warning: "bg-amber-500/10  border-amber-500/30  text-amber-300",
  };
  const FeedbackIcon: Record<FeedbackKind, React.ElementType> = {
    success: CheckCircle2,
    error:   AlertCircle,
    warning: AlertCircle,
  };

  /* ─── Render ──────────────────────────────────────────────────────── */
  return (
    <div className="space-y-8">

      {/* ── Form card ── */}
      <div className="bg-slate-900/80 border border-slate-700/60 rounded-2xl p-6 sm:p-8 space-y-6">

        {/* Mentor selector */}
        <div>
          <FieldLabel htmlFor="mentor-select" icon={User}>
            Mentor
          </FieldLabel>
          {mentors.length === 0 ? (
            <p className="text-sm text-amber-400 flex items-center gap-2">
              <AlertCircle size={14} />
              No mentors found in Sanity CMS. Publish at least one mentor document first.
            </p>
          ) : (
            <select
              id="mentor-select"
              value={selectedMentorId}
              onChange={(e) => setSelectedMentorId(e.target.value)}
              className={inputCls}
            >
              <option value="">— Select a mentor —</option>
              {mentors.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.name}
                </option>
              ))}
            </select>
          )}
          {selectedMentor && (
            <p className="mt-1 text-[11px] text-slate-600 font-mono">
              id: {selectedMentor._id}
            </p>
          )}
        </div>

        {/* Date */}
        <div>
          <FieldLabel htmlFor="slot-date" icon={CalendarPlus}>
            Slot Date
          </FieldLabel>
          <input
            id="slot-date"
            type="date"
            value={slotDate}
            onChange={(e) => setSlotDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            className={inputCls}
          />
        </div>

        {/* Times + Duration */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <FieldLabel htmlFor="start-time" icon={Clock}>
              Start Time
            </FieldLabel>
            <input
              id="start-time"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <FieldLabel htmlFor="end-time" icon={Clock}>
              End Time
            </FieldLabel>
            <input
              id="end-time"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <FieldLabel htmlFor="duration" icon={ChevronDown}>
              Duration
            </FieldLabel>
            <select
              id="duration"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className={inputCls}
            >
              {[15, 30, 45, 60].map((d) => (
                <option key={d} value={d}>{d} minutes</option>
              ))}
            </select>
          </div>
        </div>

        {/* Inline time error */}
        {timeError && (
          <p className="flex items-center gap-1.5 text-xs text-red-400 -mt-2">
            <AlertCircle size={12} /> Start time must be before end time.
          </p>
        )}

        {/* Live slot preview (zero network) */}
        {livePreview.length > 0 && (
          <div className="rounded-2xl border border-slate-700/60 overflow-hidden">
            <div className="px-4 py-2.5 bg-slate-800/60 border-b border-slate-700/60
                            flex items-center justify-between">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                Preview — {livePreview.length} slot{livePreview.length !== 1 ? "s" : ""}
              </p>
              <p className="text-xs text-slate-600">duplicates filtered on generate</p>
            </div>
            <div className="px-4 py-3 flex flex-wrap gap-2">
              {livePreview.map(({ pgTime, display }) => (
                <span
                  key={pgTime}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl
                             bg-slate-700/40 border border-slate-700 text-xs text-slate-300"
                >
                  <Clock size={10} className="text-slate-500" />
                  {display}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Submit */}
        <button
          type="button"
          onClick={handleGenerate}
          disabled={isGenerating || mentors.length === 0}
          className="w-full flex items-center justify-center gap-2 px-5 py-3.5
                     rounded-xl bg-cyan-600 text-white text-sm font-semibold
                     hover:bg-cyan-500
                     disabled:opacity-60 disabled:cursor-not-allowed
                     transition-all duration-200 hover:shadow-lg hover:shadow-cyan-500/20
                     hover:-translate-y-0.5"
        >
          {isGenerating ? (
            <><Loader2 size={16} className="animate-spin" /> Generating…</>
          ) : (
            <><CalendarPlus size={16} /> Generate &amp; Insert Slots</>
          )}
        </button>
      </div>

      {/* ── Feedback banner ── */}
      <AnimatePresence mode="wait">
        {feedback && (
          <motion.div
            key={feedback.message}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className={`flex items-start gap-3 px-5 py-4 rounded-xl border text-sm
                        ${feedbackCls[feedback.kind]}`}
          >
            {(() => { const I = FeedbackIcon[feedback.kind]; return <I size={16} className="shrink-0 mt-0.5" />; })()}
            <span>{feedback.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Insertion report ── */}
      <AnimatePresence>
        {preview && preview.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="bg-slate-900/80 border border-slate-700/60 rounded-2xl overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-slate-700/60 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white">Insertion Report</h2>
              <button
                onClick={() => { setPreview(null); setFeedback(null); }}
                className="text-slate-500 hover:text-slate-300 transition-colors"
                aria-label="Clear report"
              >
                <Trash2 size={14} />
              </button>
            </div>
            <div className="divide-y divide-slate-800">
              {preview.map((slot) => (
                <div key={slot.slot_time} className="flex items-center justify-between px-6 py-3">
                  <div className="flex items-center gap-2.5">
                    <Clock
                      size={13}
                      className={slot.isDuplicate ? "text-slate-600" : "text-cyan-500"}
                    />
                    <span className={`text-sm font-mono
                      ${slot.isDuplicate ? "text-slate-600 line-through" : "text-slate-200"}`}
                    >
                      {slot.display}
                    </span>
                  </div>
                  {slot.isDuplicate ? (
                    <span className="text-[11px] font-medium text-slate-600 uppercase tracking-wide">
                      Skipped (exists)
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[11px] font-medium
                                     text-emerald-400 uppercase tracking-wide">
                      <CheckCircle2 size={11} /> Inserted
                    </span>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
