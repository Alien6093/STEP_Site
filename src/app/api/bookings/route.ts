import * as React from "react";
import { NextResponse, type NextRequest } from "next/server";
import { Resend } from "resend";
import { createClient } from "@/lib/supabase/server";
import BookingConfirmationEmail from "@/lib/email/templates/booking-confirmation";
import { rateLimit } from "@/lib/rate-limit";

const resend = new Resend(process.env.RESEND_API_KEY!);

/* ─── Payload validators ──────────────────────────────────────────────── */

/** UUID v4 format guard — prevents malformed IDs reaching the DB */
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

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
     * 5 booking attempts per user per 60 seconds.
     * Key: user.id (from the verified server-side session — never from body).
     * This prevents a logged-in user from hammering the endpoint in a loop.
     */
    if (rateLimit("bookings", user.id, { maxRequests: 5, windowMs: 60_000 })) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a moment before trying again." },
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
      return NextResponse.json({ error: "Request body must be a JSON object." }, { status: 400 });
    }

    /*
     * IDOR Prevention: user_id is NEVER read from the body.
     * The authoritative user identity is always user.id from the server-side
     * Supabase session. A client cannot forge a different user_id.
     */
    const {
      slotId,
      mentorName,
      startupName,
      startupStage,
      discussionTopic,
      date,
      time,
    } = body as Record<string, unknown>;

    /* Strict field validation — never trust client types */
    if (!isNonEmptyString(slotId, 36) || !UUID_RE.test(slotId)) {
      return NextResponse.json({ error: "Invalid or missing slotId." }, { status: 400 });
    }
    if (!isNonEmptyString(mentorName,  120)) {
      return NextResponse.json({ error: "Invalid or missing mentorName." }, { status: 400 });
    }
    if (!isNonEmptyString(startupName, 120)) {
      return NextResponse.json({ error: "Invalid or missing startupName." }, { status: 400 });
    }
    if (!isNonEmptyString(date, 40)) {
      return NextResponse.json({ error: "Invalid or missing date." }, { status: 400 });
    }
    if (!isNonEmptyString(time, 20)) {
      return NextResponse.json({ error: "Invalid or missing time." }, { status: 400 });
    }

    /* Optional fields — coerce/default safely */
    const safeStage = isNonEmptyString(startupStage,    60)   ? startupStage    : null;
    const safeTopic = isNonEmptyString(discussionTopic, 1000) ? discussionTopic : null;

    /* ── Atomic slot update (prevents double-booking) ────────────────── */
    const { data: slotData, error: slotError } = await supabase
      .from("mentor_slots")
      .update({ is_booked: true })
      .eq("id",        slotId)
      .eq("is_booked", false)   // only succeeds if the slot is still free
      .select();

    if (slotError) {
      console.error("[bookings] slot update error:", slotError.code, slotError.message);
      return NextResponse.json(
        { error: "Failed to reserve slot. Please try again." },
        { status: 500 }
      );
    }

    /* Empty result → slot already taken */
    if (!slotData || slotData.length === 0) {
      return NextResponse.json(
        { error: "Sorry, this slot was just booked by someone else. Please choose another." },
        { status: 409 }
      );
    }

    /* ── Insert booking record ───────────────────────────────────────── */
    /*
     * SECURITY: user.id is taken from the verified server-side session.
     * Under no circumstances do we accept a user_id field from the request body.
     */
    const { error: bookingError } = await supabase
      .from("mentor_bookings")
      .insert({
        user_id:          user.id,          // ← always from session, never from body
        slot_id:          slotId,
        startup_name:     startupName.trim(),
        startup_stage:    safeStage,
        discussion_topic: safeTopic,
        booked_at:        new Date().toISOString(),
      });

    if (bookingError) {
      console.error("[bookings] insert error:", bookingError.code, bookingError.message);
      return NextResponse.json(
        { error: "Booking saved to slot but record creation failed. Please contact support." },
        { status: 500 }
      );
    }

    /* ── Send confirmation email (non-blocking) ──────────────────────── */
    /*
     * Fire-and-forget: the booking is already committed to the DB.
     * An email failure must never cause the API to return 500.
     */
    const userName = user.email?.split("@")[0] ?? "Founder";
    resend.emails
      .send({
        from:    process.env.FROM_ADDRESS ?? "JSS STEP <noreply@jss-step.in>",
        to:      user.email!,
        subject: `Booking confirmed with ${mentorName} — ${time}, ${date}`,
        react:   React.createElement(BookingConfirmationEmail, {
          userName,
          mentorName,
          date,
          time,
          topic: safeTopic ?? "",
        }),
      })
      .catch((emailErr) => {
        console.error("[bookings] email send failed (non-blocking):", emailErr);
      });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[bookings] unexpected error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
