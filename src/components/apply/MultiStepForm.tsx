"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2, ChevronLeft, ChevronRight } from "lucide-react";


/* ─── Types ──────────────────────────────────────────────────────────── */

interface FormData {
  // Step 1 — Personal
  fullName: string;
  email: string;
  phone: string;
  linkedin: string;
  affiliation: string;
  orgName: string;
  // Step 2 — Startup
  startupName: string;
  targetMarket: string;
  teamSize: string;
  stage: string;
  sector: string;
  isRegistered: string;
  problemStatement: string;
  proposedSolution: string;
  // Step 3 — Program
  program: string;
  existingFunding: string;
  heardFrom: string;
  pitchDeck: File | null;
  additionalInfo: string;
}

const INITIAL_FORM: FormData = {
  fullName: "", email: "", phone: "", linkedin: "",
  affiliation: "", orgName: "",
  startupName: "", targetMarket: "", teamSize: "",
  stage: "", sector: "", isRegistered: "",
  problemStatement: "", proposedSolution: "",
  program: "", existingFunding: "", heardFrom: "",
  pitchDeck: null, additionalInfo: "",
};

/*
 * Maps URL slug → exact <option> string in the Step 3 dropdown.
 * Null-safe: an unknown or missing slug simply leaves program as "".
 */
const PROGRAM_SLUG_MAP: Record<string, string> = {
  "nidhi-eir":        "NIDHI EIR (Pre-Incubation)",
  "core-incubation":  "Core Incubation",
  "bizzness":         "BIZZNESS Student Program",
};


/* ─── Shared input classNames ────────────────────────────────────────── */

const INPUT =
  "w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-base sm:text-sm " +
  "text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-cyan-500 " +
  "focus:border-cyan-500 outline-none transition-all duration-200";

const LABEL = "block text-sm font-medium text-slate-700 mb-1.5";

/* ─── Field helpers ──────────────────────────────────────────────────── */

function Field({
  label, id, children,
}: { label: string; id: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className={LABEL}>{label}</label>
      {children}
    </div>
  );
}

/* ─── Step panels ────────────────────────────────────────────────────── */

function Step1({
  data, update,
}: { data: FormData; update: (k: keyof FormData, v: string) => void }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
      <Field label="Full Name *" id="fullName">
        <input id="fullName" type="text" value={data.fullName} placeholder="e.g. Arjun Mehta"
          onChange={(e) => update("fullName", e.target.value)} className={INPUT} />
      </Field>
      <Field label="Email Address *" id="email">
        <input id="email" type="email" value={data.email} placeholder="you@example.com"
          onChange={(e) => update("email", e.target.value)} className={INPUT} />
      </Field>
      <Field label="Phone Number *" id="phone">
        <input id="phone" type="tel" value={data.phone} placeholder="+91 98xxxxxxxx"
          onChange={(e) => update("phone", e.target.value)} className={INPUT} />
      </Field>
      <Field label="LinkedIn Profile URL" id="linkedin">
        <input id="linkedin" type="url" value={data.linkedin} placeholder="https://linkedin.com/in/..."
          onChange={(e) => update("linkedin", e.target.value)} className={INPUT} />
      </Field>
      <Field label="Current Affiliation *" id="affiliation">
        <select id="affiliation" value={data.affiliation}
          onChange={(e) => update("affiliation", e.target.value)} className={INPUT}>
          <option value="">Select affiliation…</option>
          <option>Student</option>
          <option>Faculty</option>
          <option>Alumni</option>
          <option>External Founder</option>
        </select>
      </Field>
      <Field label="College / Organization Name *" id="orgName">
        <input id="orgName" type="text" value={data.orgName} placeholder="JSSATEN, IIT Delhi, etc."
          onChange={(e) => update("orgName", e.target.value)} className={INPUT} />
      </Field>
    </div>
  );
}

function Step2({
  data, update,
}: { data: FormData; update: (k: keyof FormData, v: string) => void }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <Field label="Startup / Project Name *" id="startupName">
          <input id="startupName" type="text" value={data.startupName} placeholder="e.g. NovaBio Diagnostics"
            onChange={(e) => update("startupName", e.target.value)} className={INPUT} />
        </Field>
        <Field label="Target Market" id="targetMarket">
          <input id="targetMarket" type="text" value={data.targetMarket} placeholder="e.g. Tier-2 Indian hospitals"
            onChange={(e) => update("targetMarket", e.target.value)} className={INPUT} />
        </Field>
        <Field label="Team Size" id="teamSize">
          <input id="teamSize" type="number" min={1} value={data.teamSize} placeholder="e.g. 3"
            onChange={(e) => update("teamSize", e.target.value)} className={INPUT} />
        </Field>
        <Field label="Current Stage *" id="stage">
          <select id="stage" value={data.stage}
            onChange={(e) => update("stage", e.target.value)} className={INPUT}>
            <option value="">Select stage…</option>
            <option>Idea</option>
            <option>Prototype</option>
            <option>MVP</option>
            <option>Revenue Generating</option>
          </select>
        </Field>
        <Field label="Sector *" id="sector">
          <select id="sector" value={data.sector}
            onChange={(e) => update("sector", e.target.value)} className={INPUT}>
            <option value="">Select sector…</option>
            <option>AI & Deep Tech</option>
            <option>Clean-Tech & EV</option>
            <option>Health-Tech</option>
            <option>Industry 4.0 & IoT</option>
            <option>Robotics & Drones</option>
            <option>AR/VR & Web3</option>
            <option>Other</option>
          </select>
        </Field>
        <Field label="Registered Company?" id="isRegistered">
          <select id="isRegistered" value={data.isRegistered}
            onChange={(e) => update("isRegistered", e.target.value)} className={INPUT}>
            <option value="">Select…</option>
            <option>Yes — Pvt. Ltd.</option>
            <option>Yes — LLP</option>
            <option>Yes — Other</option>
            <option>No</option>
          </select>
        </Field>
      </div>
      <Field label="Brief Problem Statement *" id="problemStatement">
        <textarea id="problemStatement" rows={3} value={data.problemStatement}
          placeholder="Describe the problem you are solving in 2-4 sentences…"
          onChange={(e) => update("problemStatement", e.target.value)}
          className={`${INPUT} resize-none`} />
      </Field>
      <Field label="Proposed Solution *" id="proposedSolution">
        <textarea id="proposedSolution" rows={3} value={data.proposedSolution}
          placeholder="How does your solution address the problem uniquely?"
          onChange={(e) => update("proposedSolution", e.target.value)}
          className={`${INPUT} resize-none`} />
      </Field>
    </div>
  );
}

function Step3({
  data, update, onFile,
}: {
  data: FormData;
  update: (k: keyof FormData, v: string) => void;
  onFile: (f: File | null) => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <Field label="Select Program *" id="program">
          <select id="program" value={data.program}
            onChange={(e) => update("program", e.target.value)} className={INPUT}>
            <option value="">Select program…</option>
            <option>NIDHI EIR (Pre-Incubation)</option>
            <option>BIZZNESS Student Program</option>
            <option>Core Incubation</option>
            <option>Global Startupreneur (Acceleration)</option>
          </select>
        </Field>
        <Field label="Existing Funding?" id="existingFunding">
          <select id="existingFunding" value={data.existingFunding}
            onChange={(e) => update("existingFunding", e.target.value)} className={INPUT}>
            <option value="">Select…</option>
            <option>No — Bootstrapped</option>
            <option>Yes — Friends & Family</option>
            <option>Yes — Angel Funded</option>
            <option>Yes — Government Grant</option>
            <option>Yes — VC Backed</option>
          </select>
        </Field>
        <Field label="How did you hear about us?" id="heardFrom">
          <select id="heardFrom" value={data.heardFrom}
            onChange={(e) => update("heardFrom", e.target.value)} className={INPUT}>
            <option value="">Select…</option>
            <option>Social Media</option>
            <option>JSSATEN Faculty / Staff</option>
            <option>Fellow Founder / Alumni</option>
            <option>DST / Government Portal</option>
            <option>News / Media</option>
            <option>Other</option>
          </select>
        </Field>

        {/* Pitch deck upload */}
        <div>
          <label htmlFor="pitchDeck" className={LABEL}>
            Pitch Deck <span className="text-slate-400 font-normal">(PDF, max 5 MB)</span>
          </label>
          <input
            id="pitchDeck"
            type="file"
            accept=".pdf"
            onChange={(e) => onFile(e.target.files?.[0] ?? null)}
            className="w-full text-base sm:text-sm text-slate-500 file:mr-4 file:py-2 file:px-4
                       file:rounded-lg file:border-0 file:text-base sm:file:text-sm file:font-medium
                       file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100
                       cursor-pointer transition-all"
          />
        </div>
      </div>

      <Field label="Additional Information" id="additionalInfo">
        <textarea id="additionalInfo" rows={4} value={data.additionalInfo}
          placeholder="Anything else you'd like to share with our screening committee?"
          onChange={(e) => update("additionalInfo", e.target.value)}
          className={`${INPUT} resize-none`} />
      </Field>
    </div>
  );
}

/* ─── Progress bar ───────────────────────────────────────────────────── */

function ProgressBar({ step, total }: { step: number; total: number }) {
  const pct = Math.round((step / total) * 100);
  const stepName = ["Personal Info", "Startup Details", "Program & Upload"][step - 1] || "";

  return (
    <div className="mb-8">
      {/* Mobile Step Indicator */}
      <div className="flex md:hidden items-center justify-between mb-6">
        <span className="text-sm text-slate-400">Step {step} of {total}</span>
        <span className="text-sm font-medium text-cyan-400">{stepName}</span>
      </div>

      <div className="hidden md:block">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Step {step} of {total}
          </span>
          <span className="text-xs font-semibold text-cyan-600">{pct}%</span>
        </div>
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-500 to-violet-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
        {/* Step labels */}
        <div className="flex justify-between mt-2">
          {["Personal Info", "Startup Details", "Program & Upload"].map((label, i) => (
            <span
              key={label}
              className={`text-xs ${i + 1 <= step ? "text-cyan-600 font-medium" : "text-slate-400"}`}
            >
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Success screen ─────────────────────────────────────────────────── */

function SuccessScreen() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col items-center gap-6 py-12 text-center"
    >
      <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center">
        <CheckCircle2 size={44} className="text-emerald-500" strokeWidth={1.75} />
      </div>
      <div>
        <h3 className="text-2xl font-bold text-slate-900 mb-2">Application Received!</h3>
        <p className="text-slate-500 leading-relaxed max-w-md">
          Thank you for applying to JSS STEP. Our screening committee will review your
          submission and reach out within{" "}
          <span className="font-semibold text-slate-700">7–10 business days</span>.
        </p>
      </div>
      <div className="flex flex-col gap-2 text-sm text-slate-400">
        <p>Check your email for a confirmation receipt.</p>
        <p>
          Questions? Email us at{" "}
          <a href="mailto:info@jssstepnoida.org"
            className="text-cyan-600 hover:underline">
            info@jssstepnoida.org
          </a>
        </p>
      </div>
    </motion.div>
  );
}

/* ─── Main component ─────────────────────────────────────────────────── */

const TOTAL_STEPS = 3;

/* ─── Inner component (reads useSearchParams) ────────────────────────── */
/*
 * Next.js 15+ App Router: any component that calls useSearchParams must be
 * wrapped in <Suspense> to avoid de-optimising (blocking) the entire page
 * during the static build/pre-render phase.
 * We isolate the hook here and export a thin Suspense-wrapped shell below.
 */
function FormContent() {
  const searchParams   = useSearchParams();
  const [currentStep,  setCurrentStep]  = useState(1);
  const [formData,     setFormData]     = useState<FormData>(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess,    setIsSuccess]    = useState(false);

  /*
   * On first render, read the ?program=<slug> query parameter and pre-select
   * the matching dropdown option.
   *
   * Edge cases handled:
   *   - null param  → no crash, program stays ""
   *   - unknown slug → no crash, program stays ""
   *   - valid slug   → maps to exact <option> string via PROGRAM_SLUG_MAP
   */
  useEffect(() => {
    const slug  = searchParams.get("program");
    const value = slug ? (PROGRAM_SLUG_MAP[slug] ?? "") : "";
    if (value) {
      setFormData((prev) => ({ ...prev, program: value }));
    }
  /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, []); // run once on mount — intentionally ignores searchParams updates


  /* ── Field updater ── */
  const update = (key: keyof FormData, value: string) =>
    setFormData((prev) => ({ ...prev, [key]: value }));

  const onFile = (file: File | null) =>
    setFormData((prev) => ({ ...prev, pitchDeck: file }));

  /* ── Navigation ── */
  const next = () => setCurrentStep((s) => Math.min(s + 1, TOTAL_STEPS));
  const back = () => setCurrentStep((s) => Math.max(s - 1, 1));

  /* ── Mock submit ── */
  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 2000);
  };

  /* ── Render ── */
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-10 relative z-10 pb-16">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 md:p-12">

        {isSuccess ? (
          <SuccessScreen />
        ) : (
          <>
            <ProgressBar step={currentStep} total={TOTAL_STEPS} />

            {/* Animated step panels */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                {currentStep === 1 && <Step1 data={formData} update={update} />}
                {currentStep === 2 && <Step2 data={formData} update={update} />}
                {currentStep === 3 && <Step3 data={formData} update={update} onFile={onFile} />}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className={`flex flex-col-reverse sm:flex-row mt-8 gap-3 ${currentStep > 1 ? "sm:justify-between" : "sm:justify-end"}`}>
              {currentStep > 1 && (
                <button onClick={back}
                  className="flex items-center justify-center sm:justify-start gap-1.5 px-6 py-3 rounded-xl text-sm font-medium
                             text-slate-600 border border-slate-200 hover:bg-slate-50
                             transition-all duration-200 w-full sm:w-auto">
                  <ChevronLeft size={16} />Back
                </button>
              )}

              {currentStep < TOTAL_STEPS ? (
                <button onClick={next}
                  className="flex items-center justify-center sm:justify-start gap-1.5 px-7 py-3 rounded-xl text-sm font-semibold
                             text-white bg-slate-900 hover:bg-cyan-600 hover:shadow-md
                             hover:shadow-cyan-500/20 sm:hover:-translate-y-0.5
                             transition-all duration-300 w-full sm:w-auto">
                  Next<ChevronRight size={16} />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex items-center justify-center sm:justify-start gap-2 px-8 py-3 rounded-xl text-sm font-semibold
                             text-white bg-cyan-600 hover:bg-cyan-500 hover:shadow-md
                             hover:shadow-cyan-500/30 sm:hover:-translate-y-0.5
                             transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed w-full sm:w-auto"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Submitting…
                    </>
                  ) : (
                    "Submit Application"
                  )}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ─── Public export — Suspense boundary ─────────────────────────────── */
/*
 * Wrapping FormContent in Suspense satisfies Next.js's requirement:
 * components using useSearchParams must not suspend the entire page tree.
 * The skeleton fallback matches the form card's approximate height so the
 * layout doesn't shift when the real form hydrates.
 */
export default function MultiStepForm() {
  return (
    <Suspense
      fallback={
        <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-10 relative z-10 pb-16">
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 md:p-12
                          animate-pulse min-h-[420px]" />
        </div>
      }
    >
      <FormContent />
    </Suspense>
  );
}
