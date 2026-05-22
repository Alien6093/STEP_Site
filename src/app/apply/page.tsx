import type { Metadata } from "next";
import ApplyHero from "@/components/apply/ApplyHero";
import AuthGate from "@/components/apply/AuthGate";
import ProgramFAQ from "@/components/programs/ProgramFAQ";

/* ─── Metadata ───────────────────────────────────────────────────────── */

export const metadata: Metadata = {
  title: "Apply Now | JSS STEP",
  description:
    "Submit your application to join the JSS STEP incubation program for the 2026-27 cohort. Open to students, faculty, alumni, and external deep-tech founders.",
};

/* ─── Page ───────────────────────────────────────────────────────────── */
/*
 * This is a Server Component (no "use client") so we can keep `metadata`.
 *
 * The auth check lives inside <AuthGate> (a Client Component).
 * AuthGate handles three states:
 *   1. Loading  — spinner while Supabase resolves the session
 *   2. Anon     — lock screen CTA prompting login
 *   3. Authed   — renders MultiStepForm with name + email pre-filled
 */
export default function ApplyPage() {
  return (
    <div className="w-full">
      <ApplyHero />

      {/* Auth gate — shows form only for signed-in users */}
      <div className="bg-slate-50">
        <AuthGate />
      </div>

      {/* FAQ — answer questions right at the point of conversion */}
      <ProgramFAQ />
    </div>
  );
}
