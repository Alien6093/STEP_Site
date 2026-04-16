import type { Metadata } from "next";
import ApplyHero from "@/components/apply/ApplyHero";
import MultiStepForm from "@/components/apply/MultiStepForm";
import ProgramFAQ from "@/components/programs/ProgramFAQ";

/* ─── Metadata ───────────────────────────────────────────────────────── */

export const metadata: Metadata = {
  title: "Apply Now | JSS STEP",
  description:
    "Submit your application to join the JSS STEP incubation program for the 2025-26 cohort. Open to students, faculty, alumni, and external deep-tech founders.",
};

/* ─── Page ───────────────────────────────────────────────────────────── */

export default function ApplyPage() {
  return (
    <div className="w-full">
      <ApplyHero />

      {/* Multi-step form — overlaps hero bottom */}
      <div className="bg-slate-50">
        <MultiStepForm />
      </div>

      {/* FAQ — answer questions right at the point of conversion */}
      <ProgramFAQ />
    </div>
  );
}
