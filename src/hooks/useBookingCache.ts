/**
 * useBookingCache.ts
 *
 * Persists booking form inputs to sessionStorage so they survive the
 * login redirect flow without the user having to re-enter them.
 *
 * Flow:
 *   1. User fills Startup Name / Stage / Topic in BookingForm.
 *   2. User is not logged in → LoginModal opens.
 *   3. Before opening the modal, the form calls saveBookingData().
 *   4. After a successful login, the form calls loadBookingData() to
 *      restore the previously entered values.
 *   5. After restoring, call clearBookingData() to clean up.
 *
 * SSR Safety:
 *   Next.js renders components on the server where `window` is undefined.
 *   Every sessionStorage access is guarded by a typeof check to prevent
 *   "ReferenceError: sessionStorage is not defined" during the build.
 */

const STORAGE_KEY = "jss_step_booking_cache_v1";

/* ─── Types ───────────────────────────────────────────────────────────── */

export interface BookingCacheData {
  /** Startup / project name entered by the user */
  startupName: string;
  /** Selected startup stage label (e.g. "Idea", "MVP") */
  startupStage: string;
  /** Free-text discussion topic */
  discussionTopic: string;
  /**
   * Optional: The slot ID the user had selected before being redirected.
   * Storing it lets the form re-select the correct slot after login.
   */
  slotId?: string;
  /** ISO timestamp of when the data was saved — used for staleness checks */
  savedAt: string;
}

/* ─── Storage helpers ─────────────────────────────────────────────────── */

/** Returns true when sessionStorage is available (client-side only). */
function isStorageAvailable(): boolean {
  return typeof window !== "undefined" && typeof window.sessionStorage !== "undefined";
}

/* ─── Public API ──────────────────────────────────────────────────────── */

/**
 * Saves booking form data to sessionStorage.
 *
 * Safe to call from any client component — silently no-ops during SSR.
 *
 * @param data  The form values to persist.
 */
export function saveBookingData(
  data: Omit<BookingCacheData, "savedAt">
): void {
  if (!isStorageAvailable()) return;

  const payload: BookingCacheData = {
    ...data,
    savedAt: new Date().toISOString(),
  };

  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (err) {
    // sessionStorage can throw in private browsing when storage quota is 0
    if (process.env.NODE_ENV !== 'production') {
      console.warn("[useBookingCache] Could not write to sessionStorage:", err);
    }
  }
}

/**
 * Loads and validates previously saved booking data from sessionStorage.
 *
 * Returns `null` when:
 *   - Running on the server (SSR)
 *   - No data has been saved
 *   - The stored data is malformed / unparseable
 *   - The data is stale (older than 30 minutes — prevents restoring data
 *     from a previous browser session that was left open)
 *
 * Safe to call during SSR — always returns null server-side.
 */
export function loadBookingData(): BookingCacheData | null {
  if (!isStorageAvailable()) return null;

  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const data = JSON.parse(raw) as BookingCacheData;

    // Basic shape validation — guards against stale format from old versions
    if (
      typeof data.startupName !== "string" ||
      typeof data.startupStage !== "string" ||
      typeof data.discussionTopic !== "string" ||
      typeof data.savedAt !== "string"
    ) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn("[useBookingCache] Stored data failed shape validation — discarding.");
      }
      clearBookingData();
      return null;
    }

    // Staleness guard: discard data older than 30 minutes
    const STALE_MS = 30 * 60 * 1000;
    const age = Date.now() - new Date(data.savedAt).getTime();
    if (age > STALE_MS) {
      if (process.env.NODE_ENV !== 'production') {
        console.info("[useBookingCache] Cached data is stale — discarding.");
      }
      clearBookingData();
      return null;
    }

    return data;
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn("[useBookingCache] Could not read from sessionStorage:", err);
    }
    return null;
  }
}

/**
 * Removes the cached booking data from sessionStorage.
 *
 * Call this after successfully restoring the data into the form to avoid
 * stale values persisting across separate booking attempts.
 *
 * Safe to call during SSR — silently no-ops.
 */
export function clearBookingData(): void {
  if (!isStorageAvailable()) return;

  try {
    window.sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore — storage may be unavailable in restricted environments
  }
}

/* ─── Hook ────────────────────────────────────────────────────────────── */

/**
 * React hook that bundles all three operations into a single import.
 *
 * @example
 * const { save, load, clear } = useBookingCache();
 *
 * // Before opening LoginModal:
 * save({ startupName, startupStage, discussionTopic, slotId });
 *
 * // After successful login:
 * const cached = load();
 * if (cached) { restore form fields; clear(); }
 */
export function useBookingCache() {
  return {
    save: saveBookingData,
    load: loadBookingData,
    clear: clearBookingData,
  } as const;
}
