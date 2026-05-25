import * as React from "react";
import { NextResponse, type NextRequest } from "next/server";
import { Resend } from "resend";
import { createClient } from "@/lib/supabase/server";
import { previewClient as sanityClient } from "@/sanity/client";
import BookingConfirmationEmail from "@/lib/email/templates/booking-confirmation";
import MentorNotificationEmail from "@/lib/email/templates/mentor-notification";
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
    if (!isNonEmptyString(mentorName, 120)) {
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
    const safeStage = isNonEmptyString(startupStage, 60) ? startupStage : null;
    const safeTopic = isNonEmptyString(discussionTopic, 1000) ? discussionTopic : null;

    /* ── Atomic slot update (prevents double-booking) ────────────────── */
    const { data: slotData, error: slotError } = await supabase
      .from("mentor_slots")
      .update({ is_booked: true })
      .eq("id", slotId)
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
        user_id: user.id,          // ← always from session, never from body
        slot_id: slotId,
        startup_name: startupName.trim(),
        startup_stage: safeStage,
        discussion_topic: safeTopic,
        booked_at: new Date().toISOString(),
      });

    if (bookingError) {
      console.error("[bookings] insert error:", bookingError.code, bookingError.message);

      /*
       * Stale-tab race condition guard.
       *
       * PostgreSQL error code 23505 = unique_violation.
       * This fires when two concurrent requests try to insert the same
       * (user_id, slot_id) pair — i.e. the user had the modal open in two
       * tabs and clicked "Confirm" in both within milliseconds of each other.
       *
       * We surface a 409 (Conflict) with a human-readable message so the
       * frontend can display it inline rather than a generic 500 banner.
       */
      const isDuplicate =
        bookingError.code === "23505" ||
        bookingError.message?.toLowerCase().includes("duplicate");

      if (isDuplicate) {
        return NextResponse.json(
          { error: "This slot was just booked by someone else. Please refresh and choose another time." },
          { status: 409 },
        );
      }

      return NextResponse.json(
        { error: "Booking saved to slot but record creation failed. Please contact support." },
        { status: 500 },
      );
    }

    /* ── Task 1: Fetch mentor's private email from Sanity ───────────────
     *
     * We use previewClient (authenticated, CDN-bypassed) so the token
     * is never exposed to the browser and the latest published email
     * is always returned — not a potentially stale CDN snapshot.
     *
     * The mentor_sanity_id is retrieved from the DB row that was just
     * locked, never from the request body, to prevent IDOR.
     */
    const mentorSanityId: string | undefined =
      slotData[0]?.mentor_sanity_id;

    let mentorEmail: string | null = null;

    if (mentorSanityId) {
      try {
        mentorEmail = await sanityClient.fetch<string | null>(
          `*[_type == "mentor" && _id == $id][0].email`,
          { id: mentorSanityId },
        );
      } catch (sanityErr) {
        /* Non-fatal — log but do not abort the booking */
        console.error("[bookings] Sanity email fetch failed:", sanityErr);
      }
    }

    /* ── Task 2: Safety fallback ─────────────────────────────────────────
     * If the Sanity document is missing the email field (e.g. a legacy
     * mentor record that predates the schema addition), we skip the
     * mentor notification but still confirm the booking to the client.
     */
    if (!mentorEmail) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(
          `[bookings] Missing mentor email for Sanity ID: ${mentorSanityId ?? "(id not found in slot row)"
          }. Mentor notification skipped.`,
        );
      }
    }

    /* ── Task 3: Concurrent dual-email dispatch via Promise.all() ────────
     *
     * Both sends run concurrently so a slow SMTP response from one
     * does not serially delay the other. Errors in either branch are
     * caught and logged individually — they must never surface as 500s
     * because the booking is already committed to the DB.
     */
    const FROM = process.env.FROM_ADDRESS ?? "JSS STEP <noreply@jss-step.in>";
    const userName = user.email?.split("@")[0] ?? "Founder";
    const founderEmail = user.email!;

    await Promise.all([
      /* Template 1 — Client confirmation */
      resend.emails
        .send({
          from: FROM,
          to: founderEmail,
          subject: `Booking confirmed with ${mentorName} — ${time}, ${date}`,
          react: React.createElement(BookingConfirmationEmail, {
            userName,
            mentorName,
            date,
            time,
            topic: safeTopic ?? "",
          }),
        })
        .catch((err) => {
          console.error("[bookings] client confirmation email failed:", err);
        }),

      /* Template 2 — Mentor notification (only if email was fetched) */
      mentorEmail
        ? resend.emails
          .send({
            from: FROM,
            to: mentorEmail,
            subject: `New booking: ${userName} (${startupName}) — ${time}, ${date}`,
            react: React.createElement(MentorNotificationEmail, {
              mentorName,
              founderName: userName,
              founderEmail,
              startupName: startupName.trim(),
              startupStage: safeStage,
              topic: safeTopic,
              date,
              time,
            }),
          })
          .catch((err) => {
            console.error("[bookings] mentor notification email failed:", err);
          })
        : Promise.resolve(), // slot safely skipped if email is missing
    ]);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[bookings] unexpected error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
