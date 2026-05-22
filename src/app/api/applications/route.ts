import * as React from "react";
import { NextResponse, type NextRequest } from "next/server";
import { Resend } from "resend";
import { createClient } from "@/lib/supabase/server";
import { adminClient } from "@/lib/supabase/admin";
import { rateLimit } from "@/lib/rate-limit";
import ApplicationConfirmationEmail from "@/lib/email/templates/application-confirmation";
import ApplicationInternalNotificationEmail from "@/lib/email/templates/application-internal-notification";

const resend = new Resend(process.env.RESEND_API_KEY!);

/* ─── Constants ─────────────────────────────────────────────────────────── */

const FROM          = process.env.FROM_ADDRESS ?? "JSS STEP <noreply@jss-step.in>";
const OPS_TO        = process.env.OPS_EMAIL    ?? "info@jssstepnoida.org";
const BUCKET        = "pitch_decks";
const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5 MB

/* ─── Field validators (never trust the client) ─────────────────────────── */

function str(v: unknown, max: number): string | null {
  if (typeof v !== "string") return null;
  const s = v.trim();
  if (s.length === 0 || s.length > max) return null;
  return s;
}

function strOpt(v: unknown, max: number): string {
  if (typeof v !== "string") return "";
  return v.trim().slice(0, max);
}

/* ─── Safe filename sanitiser ────────────────────────────────────────────── */
/*
 * Strips characters that are unsafe in storage paths / object keys.
 * Keeps: alphanumeric, hyphens, underscores, dots.
 * Collapses multiple consecutive separators into one.
 */
function safeFileName(userId: string, originalName: string): string {
  const sanitised = originalName
    .replace(/[^a-zA-Z0-9._-]/g, "_") // replace unsafe chars
    .replace(/_+/g, "_")              // collapse runs of underscores
    .toLowerCase();
  return `${userId}-${Date.now()}-${sanitised}`;
}

/* ─── Human-readable timestamp ─────────────────────────────────────────── */

function humanTimestamp(): string {
  return new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day:      "numeric",
    month:    "long",
    year:     "numeric",
    hour:     "2-digit",
    minute:   "2-digit",
  });
}

/* ══════════════════════════════════════════════════════════════════════════
   POST /api/applications
   ══════════════════════════════════════════════════════════════════════════ */

export async function POST(request: NextRequest) {
  try {

    /* ─── 1. Server-side auth (anon client — reads httpOnly session cookie) ──
     *
     * getUser() re-validates the JWT against Supabase Auth on every request.
     * It does NOT rely on the cookie value alone — forged cookies are rejected.
     *
     * IDOR prevention: user.id is sourced exclusively from this verified session.
     * The request body must NEVER influence the user_id column.
     */
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    /* ─── 2. Rate limiting ───────────────────────────────────────────────────
     *
     * 3 submissions per user per hour.
     * Keyed on verified user.id — VPN hops cannot reset it.
     */
    if (
      rateLimit("applications", user.id, {
        maxRequests: 3,
        windowMs:    60 * 60 * 1_000,
      })
    ) {
      return NextResponse.json(
        { error: "Too many submissions. Please wait before trying again." },
        { status: 429 }
      );
    }

    /* ─── 3. Parse multipart/form-data ────────────────────────────────────── */

    let fd: FormData;
    try {
      fd = await request.formData();
    } catch {
      return NextResponse.json(
        { error: "Failed to parse form data. Please try again." },
        { status: 400 }
      );
    }

    /* Helper: extract a string field from the FormData */
    const field = (key: string): unknown => fd.get(key);

    /* ─── 4. Required field validation ──────────────────────────────────────
     *
     * str() trims, type-checks, and enforces max length.
     * We re-validate everything server-side — the Zod schema is client-only.
     */
    const fullName         = str(field("fullName"),         120);
    const email            = str(field("email"),            254);
    const phone            = str(field("phone"),             30);
    const affiliation      = str(field("affiliation"),       60);
    const orgName          = str(field("orgName"),          120);
    const startupName      = str(field("startupName"),      120);
    const stage            = str(field("stage"),             60);
    const sector           = str(field("sector"),            60);
    const problemStatement = str(field("problemStatement"), 2000);
    const proposedSolution = str(field("proposedSolution"), 2000);
    const program          = str(field("program"),          120);

    const missingFields = [
      !fullName         && "fullName",
      !email            && "email",
      !phone            && "phone",
      !affiliation      && "affiliation",
      !orgName          && "orgName",
      !startupName      && "startupName",
      !stage            && "stage",
      !sector           && "sector",
      !problemStatement && "problemStatement",
      !proposedSolution && "proposedSolution",
      !program          && "program",
    ].filter(Boolean);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing or invalid required fields: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    /* ─── 5. Optional text fields ────────────────────────────────────────── */

    const linkedin        = strOpt(field("linkedin"),        500);
    const teamSize        = strOpt(field("teamSize"),         10);
    const targetMarket    = strOpt(field("targetMarket"),    200);
    const isRegistered    = strOpt(field("isRegistered"),     60);
    const existingFunding = strOpt(field("existingFunding"),  60);
    const heardFrom       = strOpt(field("heardFrom"),        60);
    const additionalInfo  = strOpt(field("additionalInfo"), 2000);

    /* ─── 6. Pitch deck upload (optional) ────────────────────────────────── */
    /*
     * Architecture:
     *   - Auth for the upload uses adminClient (service role) to bypass RLS
     *     on the pitch_decks storage bucket — the bucket's policy only allows
     *     service-role writes to prevent direct client uploads.
     *   - We validate size server-side before the upload attempt.
     *   - A failed upload returns 500 BEFORE the DB insert so no orphaned rows
     *     exist without a corresponding file.
     *   - We store the storage path string (not a signed URL). Signed URLs
     *     expire; the path is permanent and allows on-demand URL generation.
     */
    let pitchDeckPath: string | null = null;

    const pitchDeckFile = fd.get("pitchDeck");

    if (pitchDeckFile instanceof File && pitchDeckFile.size > 0) {

      /* Server-side file size guard (5 MB) */
      if (pitchDeckFile.size > MAX_FILE_BYTES) {
        return NextResponse.json(
          { error: "Pitch deck must be smaller than 5 MB." },
          { status: 400 }
        );
      }

      /* MIME type guard — only accept PDFs */
      const allowedMimes = ["application/pdf"];
      if (!allowedMimes.includes(pitchDeckFile.type)) {
        return NextResponse.json(
          { error: "Only PDF files are accepted for the pitch deck." },
          { status: 400 }
        );
      }

      /* Convert File → ArrayBuffer → Uint8Array for Supabase Storage SDK */
      const arrayBuffer = await pitchDeckFile.arrayBuffer();
      const fileBuffer  = new Uint8Array(arrayBuffer);

      const fileName = safeFileName(user.id, pitchDeckFile.name);

      /*
       * Upload using adminClient (service role key).
       *
       * Why adminClient for storage but supabase (anon) for auth + DB?
       *   - The pitch_decks bucket should NOT be publicly writable — only the
       *     server (service role) should be allowed to write to it.
       *   - The DB insert uses the anon client + RLS so the user_id constraint
       *     is enforced at the database level as a secondary security layer.
       */
      const { error: uploadError } = await adminClient.storage
        .from(BUCKET)
        .upload(fileName, fileBuffer, {
          contentType:  pitchDeckFile.type,
          cacheControl: "3600",
          upsert:       false, // never silently overwrite an existing file
        });

      if (uploadError) {
        console.error("[applications] storage upload error:", uploadError.message);
        return NextResponse.json(
          { error: "Failed to upload pitch deck. Please try again." },
          { status: 500 }
        );
      }

      /* Store the path — callers can generate signed URLs from this later */
      pitchDeckPath = `${BUCKET}/${fileName}`;
    }

    /* ─── 7. DB insertion ─────────────────────────────────────────────────── */
    /*
     * user_id: always from verified session — never from the body (IDOR guard).
     * submitted_at: server-side timestamp — never trust the client clock.
     * pitch_deck_path: storage path or null (upload is optional).
     */
    const { error: insertError } = await supabase
      .from("incubation_applications")
      .insert({
        user_id:           user.id,
        full_name:         fullName!.trim(),
        email:             email!.toLowerCase().trim(),
        phone:             phone!.trim(),
        linkedin:          linkedin        || null,
        affiliation:       affiliation!.trim(),
        org_name:          orgName!.trim(),
        startup_name:      startupName!.trim(),
        target_market:     targetMarket   || null,
        team_size:         teamSize ? Number(teamSize) : null,
        stage:             stage!.trim(),
        sector:            sector!.trim(),
        is_registered:     isRegistered   || null,
        problem_statement: problemStatement!.trim(),
        proposed_solution: proposedSolution!.trim(),
        program:           program!.trim(),
        existing_funding:  existingFunding || null,
        heard_from:        heardFrom      || null,
        additional_info:   additionalInfo || null,
        pitch_deck_path:   pitchDeckPath,           // ← new column
        submitted_at:      new Date().toISOString(),
      });

    if (insertError) {
      console.error("[applications] insert error:", insertError.code, insertError.message);

      /*
       * If the DB insert fails after a successful storage upload, we attempt
       * to clean up the orphaned file so storage doesn't accumulate garbage.
       * This is best-effort — a failure here is logged but not surfaced.
       */
      if (pitchDeckPath) {
        const orphanFileName = pitchDeckPath.replace(`${BUCKET}/`, "");
        adminClient.storage
          .from(BUCKET)
          .remove([orphanFileName])
          .catch((e) => console.error("[applications] orphan cleanup failed:", e));
      }

      /* 23505 = unique_violation (user already applied for this program) */
      if (insertError.code === "23505") {
        return NextResponse.json(
          {
            error:
              "You have already submitted an application for this program. " +
              "Our team will be in touch within 7–10 business days.",
          },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { error: "Failed to save your application. Please try again." },
        { status: 500 }
      );
    }

    /* ─── 8. Dual-email dispatch (Promise.allSettled) ─────────────────────── */
    /*
     * allSettled: both emails fire concurrently.
     * A failed send is logged but NEVER returns 500 — the DB row is committed.
     */
    const submittedAt  = humanTimestamp();
    const userName     = fullName!.trim();
    const founderEmail = email!.toLowerCase().trim();

    await Promise.allSettled([

      /* Email 1 — Applicant receipt */
      resend.emails
        .send({
          from:    FROM,
          to:      founderEmail,
          subject: "Application Received — JSS STEP Incubation Programme",
          react:   React.createElement(ApplicationConfirmationEmail, {
            applicantName: userName,
            email:         founderEmail,
            startupName:   startupName!.trim(),
            program:       program!.trim(),
            sector:        sector!.trim(),
            stage:         stage!.trim(),
            submittedAt,
          }),
        })
        .catch((err) =>
          console.error("[applications] applicant confirmation email failed:", err)
        ),

      /* Email 2 — Internal ops briefing */
      resend.emails
        .send({
          from:    FROM,
          to:      OPS_TO,
          subject: `New Application: ${userName} — ${startupName!.trim()} (${program!.trim()})`,
          react:   React.createElement(ApplicationInternalNotificationEmail, {
            applicantName:    userName,
            email:            founderEmail,
            phone:            phone!.trim(),
            linkedin,
            affiliation:      affiliation!.trim(),
            orgName:          orgName!.trim(),
            startupName:      startupName!.trim(),
            targetMarket,
            teamSize,
            stage:            stage!.trim(),
            sector:           sector!.trim(),
            isRegistered,
            problemStatement: problemStatement!.trim(),
            proposedSolution: proposedSolution!.trim(),
            program:          program!.trim(),
            existingFunding,
            heardFrom,
            additionalInfo,
            submittedAt,
          }),
        })
        .catch((err) =>
          console.error("[applications] internal notification email failed:", err)
        ),

    ]);

    /* ─── 9. Success ─────────────────────────────────────────────────────── */
    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("[applications] unexpected error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
