import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rate-limit";

/* ─── Validators ──────────────────────────────────────────────────────── */

const URL_RE   = /^https?:\/\/.{1,2083}$/;
const PHONE_RE = /^[\d\s+\-().]{7,20}$/;

function isNonEmptyString(v: unknown, max: number): v is string {
  return typeof v === "string" && v.trim().length > 0 && v.length <= max;
}

function isOptionalString(v: unknown, max: number): v is string | undefined {
  return v === undefined || v === null || (typeof v === "string" && v.length <= max);
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
     * 10 profile saves per user per 60 seconds.
     * Key: user.id (verified server-side session).
     * Prevents automated loops from hammering the profiles upsert.
     */
    if (rateLimit("profile-update", user.id, { maxRequests: 10, windowMs: 60_000 })) {
      return NextResponse.json(
        { error: "Too many requests. Please wait before updating again." },
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

    const { fullName, phone, linkedinUrl, organisation, avatarUrl } =
      body as Record<string, unknown>;

    /* ── Validate required fields ────────────────────────────────────── */
    if (!isNonEmptyString(fullName, 100)) {
      return NextResponse.json(
        { error: "fullName is required and must be ≤ 100 characters." },
        { status: 400 }
      );
    }

    /* ── Validate optional fields ────────────────────────────────────── */
    if (phone !== undefined && phone !== null && phone !== "") {
      if (!isNonEmptyString(phone, 20) || !PHONE_RE.test((phone as string).trim())) {
        return NextResponse.json(
          { error: "phone must be a valid phone number (7–20 characters)." },
          { status: 400 }
        );
      }
    }

    if (linkedinUrl !== undefined && linkedinUrl !== null && linkedinUrl !== "") {
      if (!isNonEmptyString(linkedinUrl, 2083) || !URL_RE.test((linkedinUrl as string).trim())) {
        return NextResponse.json(
          { error: "linkedinUrl must be a valid URL starting with http:// or https://." },
          { status: 400 }
        );
      }
    }

    if (avatarUrl !== undefined && avatarUrl !== null && avatarUrl !== "") {
      if (!isNonEmptyString(avatarUrl, 2083) || !URL_RE.test((avatarUrl as string).trim())) {
        return NextResponse.json(
          { error: "avatarUrl must be a valid URL." },
          { status: 400 }
        );
      }
    }

    if (!isOptionalString(organisation, 120)) {
      return NextResponse.json(
        { error: "organisation must be ≤ 120 characters." },
        { status: 400 }
      );
    }

    /* ── Upsert profile row ──────────────────────────────────────────── */
    /*
     * IDOR Prevention: the profile row id is always user.id from the
     * verified server-side session. The client cannot supply a different id.
     */
    const { error: upsertError } = await supabase
      .from("profiles")
      .upsert(
        {
          id:           user.id,            // ← always from session, never from body
          full_name:    (fullName as string).trim(),
          phone:        isNonEmptyString(phone,       20)   ? (phone as string).trim()        : null,
          linkedin_url: isNonEmptyString(linkedinUrl, 2083) ? (linkedinUrl as string).trim()  : null,
          organisation: isNonEmptyString(organisation, 120) ? (organisation as string).trim() : null,
          avatar_url:   isNonEmptyString(avatarUrl,   2083) ? (avatarUrl as string).trim()    : null,
          updated_at:   new Date().toISOString(),
        },
        { onConflict: "id" }
      );

    if (upsertError) {
      console.error("[profile/update] upsert error:", upsertError.code, upsertError.message);
      return NextResponse.json(
        { error: "Failed to save profile. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[profile/update] unexpected error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
