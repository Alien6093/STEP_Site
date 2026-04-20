import { NextResponse, type NextRequest } from "next/server";
import { adminClient } from "@/lib/supabase/admin";
import { rateLimit, getIpIdentifier } from "@/lib/rate-limit";

/* ─── Validators ──────────────────────────────────────────────────────── */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isNonEmptyString(v: unknown, max: number): v is string {
  return typeof v === "string" && v.trim().length > 0 && v.length <= max;
}

/* ─── Route ───────────────────────────────────────────────────────────── */

export async function POST(request: NextRequest) {
  try {
    /*
     * ── Rate limiting ─────────────────────────────────────────────────
     * This endpoint is UNAUTHENTICATED by design (users may abandon before
     * logging in). Key on IP address instead of user.id.
     * Limit: 10 requests per IP per 60 seconds.
     * This prevents a bot from flooding the abandoned_bookings table.
     */
    const ip = getIpIdentifier(request);
    if (rateLimit("abandoned", ip, { maxRequests: 10, windowMs: 60_000 })) {
      return NextResponse.json(
        { error: "Too many requests. Please slow down." },
        { status: 429 }
      );
    }

    /* ── Parse body ──────────────────────────────────────────────────── */
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

    const { email, mentorId, mentorName } = body as Record<string, unknown>;

    /* Strict validation — these values go directly into the DB */
    if (!isNonEmptyString(email, 254)) {
      return NextResponse.json(
        { error: "Missing or invalid email." },
        { status: 400 }
      );
    }
    if (!EMAIL_RE.test(email.trim())) {
      return NextResponse.json(
        { error: "email must be a valid email address." },
        { status: 400 }
      );
    }
    if (!isNonEmptyString(mentorId, 255)) {
      return NextResponse.json(
        { error: "Missing or invalid mentorId." },
        { status: 400 }
      );
    }

    const safeMentorName = isNonEmptyString(mentorName, 120) ? mentorName.trim() : null;

    /* ── Insert abandoned booking ────────────────────────────────────
     * Uses adminClient (service role) to bypass RLS — unauthenticated
     * visitors may have abandoned before completing login.
     * ─────────────────────────────────────────────────────────────── */
    const { error } = await adminClient
      .from("abandoned_bookings")
      .insert({
        email:            email.trim(),
        mentor_sanity_id: mentorId.trim(),
        mentor_name:      safeMentorName,
        step_reached:     1,
        created_at:       new Date().toISOString(),
      });

    if (error) {
      console.error("[abandoned] insert error:", error.code, error.message);
      return NextResponse.json(
        { error: "Failed to record abandoned session." },
        { status: 500 }
      );
    }

    return NextResponse.json({ saved: true });
  } catch (err) {
    console.error("[abandoned] unexpected error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
