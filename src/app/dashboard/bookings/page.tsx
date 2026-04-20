import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import BookingsList, { type Booking } from "@/components/dashboard/BookingsList";

export const metadata = {
  title: "My Bookings — JSS STEP",
};

export default async function BookingsPage() {
  const supabase = await createClient();

  /* ── Verify session ─────────────────────────────────── */
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/?login=true");
  }

  /*
   * ── Fetch bookings with confirmed slot columns ───────────────────
   *
   * Columns that ACTUALLY exist in the DB (verified from API routes):
   *
   * mentor_bookings : id, user_id, slot_id, startup_name,
   *                   startup_stage, discussion_topic, booked_at
   *
   * mentor_slots    : id, slot_date, slot_time,
   *                   mentor_sanity_id, is_booked
   *
   * All other column names (topic, platform, status, mentor_name,
   * mentor_email, mentor_title) do NOT exist and cause 42703 errors.
   */
  const { data: rows, error } = await supabase
    .from("mentor_bookings")
    .select(`
      id,
      discussion_topic,
      startup_name,
      mentor_slots (
        id,
        slot_date,
        slot_time
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[bookings page] fetch error:", error);
    /* Render an error state instead of silently showing an empty list */
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center gap-3">
        <p className="text-slate-400 text-sm">
          Could not load your bookings. Please refresh the page or try again later.
        </p>
      </div>
    );
  }

  /* ── Flatten the joined rows into the Booking shape ─────────────── */
  const bookings: Booking[] = (rows ?? []).map((row) => {
    const slot = Array.isArray(row.mentor_slots)
      ? row.mentor_slots[0]
      : row.mentor_slots;

    return {
      id:           row.id            as string,
      slot_id:      slot?.id          as string ?? "",
      mentor_name:  "JSS STEP Mentor",           // not stored on slot row
      mentor_title: "Mentor Session",             // not stored on slot row
      mentor_email: "",                           // not stored on slot row
      topic:        row.discussion_topic as string ?? "",
      slot_date:    slot?.slot_date   ?? "",
      slot_time:    slot?.slot_time   ?? "",
      platform:     "Google Meet",                // not stored; sensible default
      status:       "upcoming"        as Booking["status"], // no status column yet
    };
  });

  return <BookingsList initialBookings={bookings} />;
}
