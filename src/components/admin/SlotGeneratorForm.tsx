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
  Plus,
  CalendarRange,
} from "lucide-react";

/* ─── Types ───────────────────────────────────────────────────────────── */

export interface SanityMentor {
  _id: string;
  name: string;
}

/** One time block: a contiguous window inside a day */
interface TimeBlock {
  id: string; // local key only — never sent to DB
  start: string; // "HH:mm"
  end: string; // "HH:mm"
}

/** Exact row shape the DB expects */
interface SlotRow {
  mentor_sanity_id: string;
  slot_date: string;  // YYYY-MM-DD
  slot_time: string;  // HH:mm:ss
  is_booked: false;
}

type FeedbackKind = "success" | "error" | "warning";
interface Feedback { kind: FeedbackKind; message: string; }

/* ─── Time helpers ────────────────────────────────────────────────────── */

/** "HH:mm" → total minutes from midnight */
function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

/** total minutes → "HH:mm:ss" — Postgres TIME column format */
function toPostgresTime(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:00`;
}

/** total minutes → "h:mm AM/PM" — human display */
function toDisplayTime(mins: number): string {
  const h24 = Math.floor(mins / 60);
  const m = mins % 60;
  const period = h24 >= 12 ? "PM" : "AM";
  const h12 = h24 % 12 || 12;
  return `${h12}:${String(m).padStart(2, "0")} ${period}`;
}

/**
 * Core chunk engine — splits one TimeBlock into slot-sized pieces.
 * Guard: `cursor + duration <= endMins` prevents partial slots.
 */
function chunkBlock(
  block: TimeBlock,
  duration: number,
): Array<{ pgTime: string; display: string }> {
  const startMins = toMinutes(block.start);
  const endMins = toMinutes(block.end);
  if (!block.start || !block.end || startMins >= endMins) return [];

  const out: Array<{ pgTime: string; display: string }> = [];
  let cursor = startMins;
  while (cursor + duration <= endMins) {
    out.push({ pgTime: toPostgresTime(cursor), display: toDisplayTime(cursor) });
    cursor += duration;
  }
  return out;
}

/**
 * Recurrence engine — the heart of Phase 3.
 *
 * Steps:
 *  A. Iterate every calendar day from startDate → endDate (inclusive).
 *  B. Skip Sundays (getDay() === 0).
 *  C. For each valid day × each TimeBlock, generate slot chunks.
 *  D. Deduplicate within the batch (same mentor + date + time).
 */
function generateSlots(
  mentorId: string,
  startDate: string,
  endDate: string,
  blocks: TimeBlock[],
  duration: number,
): SlotRow[] {
  const seen = new Set<string>(); // "date|time" dedup key
  const rows: SlotRow[] = [];

  /*
   * Date-shift prevention (Task 2).
   *
   * new Date('YYYY-MM-DD') parses as UTC midnight. In IST (UTC+5:30) that
   * midnight underflows into the *previous* calendar day when converted back
   * to local time, so toISOString() (which is UTC) would produce the wrong
   * date string for any timezone east of UTC.
   *
   * Fix: extract year/month/day by string-splitting, then construct each
   * Date at *local noon* (12:00:00). Noon is equidistant from both midnight
   * boundaries, making it immune to any UTC offset up to ±12 hours.
   * We then format the date back using local getters (getFullYear,
   * getMonth, getDate) so the string always matches the wall-clock date
   * the admin intended to set.
   */
  const [sy, sm, sd] = startDate.split("-").map(Number);
  const [ey, em, ed] = endDate.split("-").map(Number);

  // Noon-anchored boundaries in local time
  const endNoon = new Date(ey, em - 1, ed, 12, 0, 0);
  const cur = new Date(sy, sm - 1, sd, 12, 0, 0);

  while (cur <= endNoon) {
    // Step B — skip Sundays
    if (cur.getDay() !== 0) {
      // Format using local getters — never toISOString() which is UTC
      const yyyy = cur.getFullYear();
      const mm = String(cur.getMonth() + 1).padStart(2, "0");
      const dd = String(cur.getDate()).padStart(2, "0");
      const isoDate = `${yyyy}-${mm}-${dd}`; // YYYY-MM-DD, always local

      // Step C — iterate time blocks
      for (const block of blocks) {
        const chunks = chunkBlock(block, duration);
        for (const { pgTime } of chunks) {
          const key = `${isoDate}|${pgTime}`;
          if (!seen.has(key)) {
            seen.add(key);
            rows.push({
              mentor_sanity_id: mentorId,
              slot_date: isoDate,
              slot_time: pgTime,
              is_booked: false,
            });
          }
        }
      }
    }
    cur.setDate(cur.getDate() + 1); // advance one calendar day
  }

  return rows;
}

/* ─── Shared field sub-components ────────────────────────────────────── */

function FieldLabel({
  htmlFor,
  icon: Icon,
  children,
}: {
  htmlFor: string;
  icon: React.ElementType;
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
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [duration, setDuration] = useState<number>(60);

  /**
   * timeBlocks — the multi-block array.
   * Each block has a unique local id, start time, and end time.
   * Admins can add morning + afternoon sessions independently.
   */
  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>([
    { id: "block-0", start: "", end: "" },
  ]);

  /* ── UX state ── */
  const [isGenerating, setIsGenerating] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  /* Derive mentor name from selection */
  const selectedMentor = mentors.find((m) => m._id === selectedMentorId) ?? null;

  /* ── Live slot count preview (zero network) ── */
  const liveCount = useMemo(() => {
    if (!startDate || !endDate || startDate > endDate) return 0;
    return generateSlots(
      "preview",
      startDate,
      endDate,
      timeBlocks,
      duration,
    ).length;
  }, [startDate, endDate, timeBlocks, duration]);

  /* ── Time block helpers ── */
  const updateBlock = (id: string, field: "start" | "end", value: string) =>
    setTimeBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, [field]: value } : b))
    );

  const addBlock = () =>
    setTimeBlocks((prev) => [
      ...prev,
      { id: `block-${Date.now()}`, start: "", end: "" },
    ]);

  const removeBlock = (id: string) =>
    setTimeBlocks((prev) => prev.filter((b) => b.id !== id));

  /* ── Validation helper ── */
  const blockErrors = timeBlocks.map((b) =>
    b.start && b.end && toMinutes(b.start) >= toMinutes(b.end)
  );
  const hasBlockError = blockErrors.some(Boolean);

  /* ─── Main submit handler ─────────────────────────────────────────── */
  const handleGenerate = async () => {
    setFeedback(null);

    /* Guard: mentor */
    if (!selectedMentorId) {
      setFeedback({ kind: "error", message: "Please select a mentor." }); return;
    }
    /* Guard: date range */
    if (!startDate || !endDate) {
      setFeedback({ kind: "error", message: "Start and end dates are required." }); return;
    }
    if (startDate > endDate) {
      setFeedback({ kind: "error", message: "Start date must be on or before end date." }); return;
    }
    /* Guard: at least one valid time block */
    const validBlocks = timeBlocks.filter(
      (b) => b.start && b.end && toMinutes(b.start) < toMinutes(b.end)
    );
    if (validBlocks.length === 0) {
      setFeedback({ kind: "error", message: "Add at least one valid time block (start < end)." }); return;
    }
    /* Guard: time errors */
    if (hasBlockError) {
      setFeedback({ kind: "error", message: "Fix invalid time blocks before generating." }); return;
    }

    /* Step D — run recurrence engine */
    const rows = generateSlots(selectedMentorId, startDate, endDate, validBlocks, duration);

    if (rows.length === 0) {
      setFeedback({
        kind: "warning",
        message: "No slots were generated. Check that the date range includes non-Sunday days and that time blocks fit the chosen duration.",
      }); return;
    }

    setIsGenerating(true);
    try {
      /**
       * CRITICAL: use .upsert() with onConflict + ignoreDuplicates.
       * This means re-running the generator over the same range is safe —
       * existing slots are silently skipped rather than causing a DB error.
       *
       * The unique constraint in the DB is on (mentor_sanity_id, slot_date, slot_time).
       */
      const { data: upserted, error: upsertErr } = await supabase
        .from("mentor_slots")
        .upsert(rows, {
          onConflict: "mentor_sanity_id,slot_date,slot_time",
          ignoreDuplicates: true,
        })
        .select("id");

      if (upsertErr) throw new Error(upsertErr.message);

      const inserted = upserted?.length ?? rows.length;
      const skipped = rows.length - inserted;

      setFeedback({
        kind: "success",
        message:
          `✓ ${inserted} slot${inserted !== 1 ? "s" : ""} inserted across ` +
          `${new Set(rows.map((r) => r.slot_date)).size} day(s)` +
          (skipped > 0 ? ` — ${skipped} duplicate${skipped !== 1 ? "s" : ""} skipped.` : "."),
      });
    } catch (err: unknown) {
      setFeedback({
        kind: "error",
        message: err instanceof Error ? err.message : "Unexpected error — check the console.",
      });
      console.error("[SlotGeneratorForm] upsert error:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  /* ─── Feedback styles ─────────────────────────────────────────────── */
  const feedbackCls: Record<FeedbackKind, string> = {
    success: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
    error: "bg-red-500/10    border-red-500/30    text-red-300",
    warning: "bg-amber-500/10  border-amber-500/30  text-amber-300",
  };
  const FeedbackIcon: Record<FeedbackKind, React.ElementType> = {
    success: CheckCircle2,
    error: AlertCircle,
    warning: AlertCircle,
  };

  /* ─── Render ──────────────────────────────────────────────────────── */
  return (
    <div className="space-y-8">

      {/* ── Form card ── */}
      <div className="bg-slate-900/80 border border-slate-700/60 rounded-2xl p-6 sm:p-8 space-y-7">

        {/* ── Mentor selector ── */}
        <div>
          <FieldLabel htmlFor="mentor-select" icon={User}>Mentor</FieldLabel>
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
                <option key={m._id} value={m._id}>{m.name}</option>
              ))}
            </select>
          )}
          {selectedMentor && (
            <p className="mt-1 text-[11px] text-slate-600 font-mono">
              id: {selectedMentor._id}
            </p>
          )}
        </div>

        {/* ── Date Range ── */}
        <div>
          <FieldLabel htmlFor="start-date" icon={CalendarRange}>Date Range</FieldLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-[11px] text-slate-600 mb-1 uppercase tracking-wider">From</p>
              <input
                id="start-date"
                type="date"
                value={startDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setStartDate(e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <p className="text-[11px] text-slate-600 mb-1 uppercase tracking-wider">To</p>
              <input
                id="end-date"
                type="date"
                value={endDate}
                min={startDate || new Date().toISOString().split("T")[0]}
                onChange={(e) => setEndDate(e.target.value)}
                className={inputCls}
              />
            </div>
          </div>
          {startDate && endDate && startDate > endDate && (
            <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-400">
              <AlertCircle size={12} /> End date must be on or after start date.
            </p>
          )}
        </div>

        {/* ── Slot Duration ── */}
        <div>
          <FieldLabel htmlFor="duration" icon={ChevronDown}>Slot Duration</FieldLabel>
          <select
            id="duration"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className={inputCls}
          >
            {[15, 30, 45, 60, 90].map((d) => (
              <option key={d} value={d}>{d} minutes</option>
            ))}
          </select>
        </div>

        {/* ── Time Blocks ── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <FieldLabel htmlFor="block-0-start" icon={Clock}>
              Time Blocks
              <span className="ml-1.5 normal-case font-normal text-slate-600 tracking-normal">
                (Sundays auto-skipped)
              </span>
            </FieldLabel>
          </div>

          <div className="space-y-3">
            <AnimatePresence initial={false}>
              {timeBlocks.map((block, idx) => {
                const hasErr =
                  block.start && block.end &&
                  toMinutes(block.start) >= toMinutes(block.end);

                return (
                  <motion.div
                    key={block.id}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18 }}
                    className={`relative grid grid-cols-[1fr_1fr_auto] gap-3 items-end
                                p-4 rounded-xl border transition-colors duration-150
                                ${hasErr
                        ? "border-red-500/40 bg-red-500/5"
                        : "border-slate-700/60 bg-slate-800/40"
                      }`}
                  >
                    {/* Block label */}
                    <span className="absolute top-2 left-4 text-[10px] font-bold
                                     text-slate-600 uppercase tracking-widest">
                      Block {idx + 1}
                    </span>

                    {/* Start */}
                    <div className="pt-4">
                      <label
                        htmlFor={`block-${block.id}-start`}
                        className="block text-[11px] text-slate-500 mb-1"
                      >
                        Start
                      </label>
                      <input
                        id={`block-${block.id}-start`}
                        type="time"
                        value={block.start}
                        onChange={(e) => updateBlock(block.id, "start", e.target.value)}
                        className={inputCls}
                      />
                    </div>

                    {/* End */}
                    <div className="pt-4">
                      <label
                        htmlFor={`block-${block.id}-end`}
                        className="block text-[11px] text-slate-500 mb-1"
                      >
                        End
                      </label>
                      <input
                        id={`block-${block.id}-end`}
                        type="time"
                        value={block.end}
                        onChange={(e) => updateBlock(block.id, "end", e.target.value)}
                        className={inputCls}
                      />
                    </div>

                    {/* Remove */}
                    <div className="pt-4">
                      <button
                        type="button"
                        onClick={() => removeBlock(block.id)}
                        disabled={timeBlocks.length === 1}
                        aria-label={`Remove block ${idx + 1}`}
                        className="p-3 rounded-xl text-slate-600 border border-slate-700
                                   hover:text-red-400 hover:border-red-500/40 hover:bg-red-500/5
                                   disabled:opacity-30 disabled:cursor-not-allowed
                                   transition-all duration-150"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    {/* Inline error */}
                    {hasErr && (
                      <p className="col-span-3 flex items-center gap-1.5 text-xs text-red-400 -mt-1">
                        <AlertCircle size={11} /> Start time must be before end time.
                      </p>
                    )}

                    {/* Live count for this block */}
                    {block.start && block.end && !hasErr && (() => {
                      const n = chunkBlock(block, duration).length;
                      return n > 0 ? (
                        <p className="col-span-3 flex items-center gap-1.5 text-[11px]
                                      text-slate-500 -mt-1">
                          <Clock size={10} />
                          {n} slot{n !== 1 ? "s" : ""} per day from this block
                        </p>
                      ) : null;
                    })()}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Add block button */}
          <button
            type="button"
            onClick={addBlock}
            className="mt-3 w-full flex items-center justify-center gap-2
                       py-2.5 px-4 rounded-xl text-sm font-medium
                       text-slate-400 border border-dashed border-slate-700
                       hover:text-cyan-400 hover:border-cyan-500/50 hover:bg-cyan-500/5
                       transition-all duration-150"
          >
            <Plus size={14} />
            Add another time block
          </button>
        </div>

        {/* ── Live total preview ── */}
        {liveCount > 0 && (
          <div className="flex items-center justify-between px-4 py-3 rounded-xl
                          bg-cyan-500/5 border border-cyan-500/20">
            <div className="flex items-center gap-2 text-sm text-cyan-300">
              <CalendarPlus size={15} className="text-cyan-400" />
              <span>
                <span className="font-bold">{liveCount}</span> slot
                {liveCount !== 1 ? "s" : ""} will be generated
              </span>
            </div>
            <span className="text-[11px] text-slate-600">Sundays excluded · duplicates skipped on insert</span>
          </div>
        )}

        {/* ── Submit ── */}
        <button
          type="button"
          onClick={handleGenerate}
          disabled={isGenerating || mentors.length === 0 || liveCount === 0}
          className="w-full flex items-center justify-center gap-2 px-5 py-3.5
                     rounded-xl bg-cyan-600 text-white text-sm font-semibold
                     hover:bg-cyan-500
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-200 hover:shadow-lg hover:shadow-cyan-500/20
                     hover:-translate-y-0.5"
        >
          {isGenerating ? (
            <><Loader2 size={16} className="animate-spin" /> Generating…</>
          ) : (
            <><CalendarPlus size={16} /> Generate &amp; Insert {liveCount > 0 ? `${liveCount} Slots` : "Slots"}</>
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
            {(() => {
              const I = FeedbackIcon[feedback.kind];
              return <I size={16} className="shrink-0 mt-0.5" />;
            })()}
            <span>{feedback.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
