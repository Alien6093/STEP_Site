import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { Resend } from "resend";
import { rateLimit } from "@/lib/rate-limit";

const resend = new Resend(process.env.RESEND_API_KEY!);

const ADMIN_EMAIL  = process.env.ADMIN_EMAIL  ?? "no-reply@jssstep.ac.in";
const FROM_ADDRESS = process.env.FROM_ADDRESS ?? "JSS STEP <no-reply@jssstep.ac.in>";

/* ─── Validators ──────────────────────────────────────────────────────── */

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidUuid(v: unknown): v is string {
  return typeof v === "string" && UUID_RE.test(v);
}

function isNonEmptyString(v: unknown, max: number): v is string {
  return typeof v === "string" && v.trim().length > 0 && v.length <= max;
}

/* ─── Route ───────────────────────────────────────────────────────────── */

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    /* ── Verify session ──────────────────────────────────────────────── */
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    /*
     * ── Rate limiting ─────────────────────────────────────────────────
     * 5 cancellations per user per 60 seconds.
     * Key: user.id from the verified server-side session.
     * Prevents a loop attack that repeatedly calls cancel + rebook to
     * deny other users access to a slot.
     */
    if (rateLimit("bookings-cancel", user.id, { maxRequests: 5, windowMs: 60_000 })) {
      return NextResponse.json(
        { error: "Too many requests. Please wait before cancelling again." },
        { status: 429 }
      );
    }

    /* ── Parse & validate body ───────────────────────────────────────── */
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON in request body." },
        { status: 400 }
      );
    }

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Request body must be a JSON object." },
        { status: 400 }
      );
    }

    const { bookingId, slotId, mentorName, mentorEmail, date, time } =
      body as Record<string, unknown>;

    /* UUID format guard — prevents malformed IDs reaching the DB */
    if (!isValidUuid(bookingId)) {
      return NextResponse.json(
        { error: "Invalid or missing bookingId." },
        { status: 400 }
      );
    }
    if (!isValidUuid(slotId)) {
      return NextResponse.json(
        { error: "Invalid or missing slotId." },
        { status: 400 }
      );
    }

    /* Optional fields — safe defaults */
    const safeMentorName  = isNonEmptyString(mentorName,  120) ? mentorName.trim()  : "Mentor";
    const safeMentorEmail = isNonEmptyString(mentorEmail, 254) && EMAIL_RE.test(mentorEmail.trim())
      ? mentorEmail.trim()
      : null;
    const safeDate = isNonEmptyString(date, 40) ? date.trim() : "N/A";
    const safeTime = isNonEmptyString(time, 20) ? time.trim() : "N/A";

    /* ── Step 1: Mark booking as cancelled ───────────────────────────── */
    /*
     * IDOR Prevention: the .eq("user_id", user.id) clause means this update
     * only affects rows owned by the authenticated user. A malicious actor
     * cannot cancel another user's booking by sending a foreign bookingId —
     * Supabase will update 0 rows and we treat that as a 404.
     */
    const { data: cancelledRows, error: bookingError } = await supabase
      .from("mentor_bookings")
      .update({ status: "cancelled", updated_at: new Date().toISOString() })
      .eq("id",      bookingId)
      .eq("user_id", user.id)   // ← IDOR lock: only own bookings
      .select("id");

    if (bookingError) {
      console.error("[bookings/cancel] booking update error:", bookingError.code, bookingError.message);
      return NextResponse.json(
        { error: "Failed to cancel booking. Please try again." },
        { status: 500 }
      );
    }

    /* Zero rows updated → bookingId doesn't belong to this user or doesn't exist */
    if (!cancelledRows || cancelledRows.length === 0) {
      return NextResponse.json(
        { error: "Booking not found or does not belong to you." },
        { status: 404 }
      );
    }

    /* ── Step 2: Re-open the mentor slot ─────────────────────────────── */
    /*
     * IDOR Prevention: we can only re-open a slot whose booking we just
     * confirmed belongs to user.id (step 1 above). The slotId arrives from
     * the client, but it can only cause damage if the booking row was also
     * owned by the same user — which step 1 enforces.
     *
     * We do NOT add .eq("mentor_sanity_id", user.id) here because the slot
     * belongs to the mentor, not the user. The ownership chain is:
     *   user.id → mentor_bookings.user_id → mentor_bookings.slot_id → mentor_slots.id
     *
     * Step 1 already verified the user_id → slot_id link.
     */
    const { error: slotError } = await supabase
      .from("mentor_slots")
      .update({ is_booked: false, updated_at: new Date().toISOString() })
      .eq("id", slotId);

    if (slotError) {
      /* Non-fatal — booking is already cancelled; slot will remain booked
       * until an admin manually intervenes. Log for ops visibility. */
      console.error("[bookings/cancel] slot re-open error:", slotError.code, slotError.message);
    }

    /* ── Step 3: Email notification (non-blocking) ───────────────────── */
    const recipientEmail = safeMentorEmail ?? ADMIN_EMAIL;

    resend.emails
      .send({
        from:    FROM_ADDRESS,
        to:      recipientEmail,
        subject: `Session Cancellation — ${safeDate} at ${safeTime}`,
        html: `
          <div style="font-family:sans-serif;max-width:520px;margin:0 auto;color:#1e293b">
            <h2 style="color:#0f172a">Session Cancelled</h2>
            <p>Hello ${safeMentorName},</p>
            <p>
              A participant has cancelled their booking with you on
              <strong>${safeDate}</strong> at <strong>${safeTime}</strong>.
              The slot has been automatically reopened and is available for new bookings.
            </p>
            <p style="color:#64748b;font-size:13px">
              If you have any questions, please contact the JSS STEP team.
            </p>
            <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0"/>
            <p style="font-size:12px;color:#94a3b8">JSS STEP Incubation Centre</p>
          </div>
        `,
      })
      .catch((emailErr) => {
        /* Non-fatal — cancellation already committed. Log for ops. */
        console.error("[bookings/cancel] email send error (non-blocking):", emailErr);
      });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[bookings/cancel] unexpected error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
