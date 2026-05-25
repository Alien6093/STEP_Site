/**
 * timeUtils.ts
 *
 * IST-aware date/time utilities for the booking system.
 *
 * Schema reminder:
 *   mentor_slots.slot_date  →  "YYYY-MM-DD"  (date column)
 *   mentor_slots.slot_time  →  "HH:MM:SS"    (time column)
 *
 * All comparisons are anchored to Asia/Kolkata (IST, UTC+05:30).
 * This is critical: a user browsing at 23:00 UTC+5:30 is actually
 * at 17:30 UTC — naïvely comparing local Date() would produce wrong
 * results for users in other timezones.
 */

const IST_TIMEZONE = "Asia/Kolkata";

/* ─── Internal helpers ────────────────────────────────────────────────── */

/**
 * Returns the current wall-clock time in IST as a plain Date object.
 *
 * Strategy: Intl.DateTimeFormat gives us the IST year/month/day/hour/minute/
 * second components. We reassemble them into a Date so arithmetic works
 * correctly regardless of the server's or browser's local timezone.
 */
function nowInIST(): Date {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: IST_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  // formatToParts gives us named tokens — resilient to locale formatting quirks
  const parts = Object.fromEntries(
    fmt.formatToParts(new Date()).map(({ type, value }) => [type, value])
  );

  // Construct an ISO-8601 string in IST wall-clock time,
  // then parse it as a Date (JS treats it as UTC internally, which is fine —
  // we only use this for relative comparison via getTime()).
  const isoIst = `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}+05:30`;
  return new Date(isoIst);
}

/**
 * Parses the two DB string columns into a single Date object, interpreted
 * as an IST wall-clock time.
 *
 * @param slotDate  "YYYY-MM-DD"  (from mentor_slots.slot_date)
 * @param slotTime  "HH:MM:SS"   (from mentor_slots.slot_time)
 * @returns A Date object, or null if either input is malformed.
 */
function parseSlotDateTime(slotDate: string, slotTime: string): Date | null {
  if (!slotDate || !slotTime) return null;

  // Validate rough shape — guards against undefined/empty strings from the DB
  const dateOk = /^\d{4}-\d{2}-\d{2}$/.test(slotDate.trim());
  const timeOk = /^\d{2}:\d{2}(:\d{2})?$/.test(slotTime.trim());

  if (!dateOk || !timeOk) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[timeUtils] Unexpected slot format: date="${slotDate}" time="${slotTime}"`);
    }
    return null;
  }

  // Normalise HH:MM → HH:MM:00 so the ISO string is always valid
  const normTime = slotTime.trim().length === 5 ? `${slotTime.trim()}:00` : slotTime.trim();
  const isoIst = `${slotDate.trim()}T${normTime}+05:30`;

  const d = new Date(isoIst);
  return isNaN(d.getTime()) ? null : d;
}

/* ─── Public API ──────────────────────────────────────────────────────── */

/**
 * Returns `true` if the slot's scheduled start time has already passed,
 * compared against the current moment in IST.
 *
 * @param slotDate  "YYYY-MM-DD"
 * @param slotTime  "HH:MM:SS" or "HH:MM"
 */
export function isSlotInPast(slotDate: string, slotTime: string): boolean {
  const slotStart = parseSlotDateTime(slotDate, slotTime);

  // If we cannot parse the slot, treat it as unavailable (safe default)
  if (!slotStart) return true;

  return slotStart.getTime() < nowInIST().getTime();
}

/**
 * Returns `true` if a slot should be treated as unavailable for booking.
 *
 * A slot is unavailable when EITHER:
 *   1. `is_booked` is already true (taken by another user), OR
 *   2. Its scheduled time is in the past (expired slot).
 *
 * @param slot  A raw slot record from Supabase (loosely typed to avoid
 *              coupling this utility to a specific generated type).
 */
export function isSlotBooked(slot: {
  is_booked?: boolean;
  slot_date: string;
  slot_time: string;
}): boolean {
  if (slot.is_booked === true) return true;
  return isSlotInPast(slot.slot_date, slot.slot_time);
}
