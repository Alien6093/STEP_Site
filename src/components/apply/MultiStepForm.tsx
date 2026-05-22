"use client";

import { SITE_CONFIG } from "@/lib/constants";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2, ChevronLeft, ChevronRight, Lock } from "lucide-react";
import Link from "next/link";
import ObfuscatedEmail from "@/components/ui/ObfuscatedEmail";

/* Base64 of "info@jssstepnoida.org" — plain text never appears in this file */


/* ══════════════════════════════════════════════════════════════════════════
   ZOD SCHEMA
   ══════════════════════════════════════════════════════════════════════════ */

const schema = z.object({
  /* ── Step 1 — Personal ──────────────────────────────────────────── */
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters"),
  email: z
    .string()
    .email("Enter a valid email address"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits"),
  linkedin: z
    .string()
    .url("Enter a valid LinkedIn URL (must start with https://)")
    .optional()
    .or(z.literal("")),
  affiliation: z
    .string()
    .min(1, "Please select your current affiliation"),
  orgName: z
    .string()
    .min(2, "Organisation name must be at least 2 characters"),

  /* ── Step 2 — Startup ───────────────────────────────────────────── */
  startupName: z
    .string()
    .min(2, "Startup name must be at least 2 characters"),
  targetMarket: z.string().optional().or(z.literal("")),
  teamSize: z
    .string()
    .min(1, "Enter your team size")
    .refine((v) => !isNaN(Number(v)) && Number(v) >= 1, {
      message: "Team size must be a positive number",
    }),
  stage: z
    .string()
    .min(1, "Please select your current stage"),
  sector: z
    .string()
    .min(1, "Please select your sector"),
  isRegistered: z.string().optional().or(z.literal("")),
  problemStatement: z
    .string()
    .min(10, "Problem statement must be at least 10 characters"),
  proposedSolution: z
    .string()
    .min(10, "Proposed solution must be at least 10 characters"),

  /* ── Step 3 — Program ───────────────────────────────────────────── */
  program: z
    .string()
    .min(1, "Please select a program"),
  existingFunding: z.string().optional().or(z.literal("")),
  heardFrom: z.string().optional().or(z.literal("")),
  additionalInfo: z.string().optional().or(z.literal("")),

  /* ── Step 3 — DPDP Consent (must be explicitly accepted) ───────── */
  /* Zod v4: errorMap is removed; use the message shorthand instead */
  consent: z.literal(true, {
    message: "You must agree to the Privacy Policy to proceed.",
  }),
});

type FormValues = z.infer<typeof schema>;

/* Fields validated at each step — trigger() runs only these */
const STEP_FIELDS: Record<number, (keyof FormValues)[]> = {
  1: ["fullName", "email", "phone", "linkedin", "affiliation", "orgName"],
  2: ["startupName", "teamSize", "stage", "sector", "problemStatement", "proposedSolution"],
  3: ["program", "consent"],
};

/* ══════════════════════════════════════════════════════════════════════════
   CONSTANTS
   ══════════════════════════════════════════════════════════════════════════ */

interface InitialData { fullName: string; email: string; }

const TOTAL_STEPS = 3;

const PROGRAM_SLUG_MAP: Record<string, string> = {
  "nidhi-eir": "NIDHI EIR (Pre-Incubation)",
  "core-incubation": "Core Incubation",
  "bizzness": "BIZZNESS Student Program",
};

/* ══════════════════════════════════════════════════════════════════════════
   SHARED STYLE TOKENS
   ══════════════════════════════════════════════════════════════════════════ */

const INPUT =
  "w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-base sm:text-sm " +
  "text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-cyan-500 " +
  "focus:border-cyan-500 outline-none transition-all duration-200";

const INPUT_ERROR =
  "w-full px-4 py-3 rounded-xl border border-red-300 bg-red-50/40 text-base sm:text-sm " +
  "text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-red-400 " +
  "focus:border-red-400 outline-none transition-all duration-200";

/*
 * Locked (read-only) fields use a dark-theme tinted surface so the
 * auto-filled value visually reads as "account data, not editable".
 * bg-slate-800/50 gives a subtle dark wash without breaking the white card.
 */
const INPUT_READONLY =
  "w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-800/[0.06] text-base sm:text-sm " +
  "text-slate-600 placeholder-slate-400 outline-none opacity-75 cursor-not-allowed select-none";

const LABEL = "block text-sm font-medium text-slate-700 mb-1.5";

/* ══════════════════════════════════════════════════════════════════════════
   FIELD WRAPPER
   ══════════════════════════════════════════════════════════════════════════ */

function Field({
  label, id, error, children,
}: {
  label: string;
  id: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className={LABEL}>{label}</label>
      {children}
      {error && (
        <p role="alert" className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
          <span aria-hidden>⚠</span> {error}
        </p>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   STEP 1 — Personal Info
   ══════════════════════════════════════════════════════════════════════════ */

function Step1({
  register,
  errors,
  lockedFields,
}: {
  register: ReturnType<typeof useForm<FormValues>>["register"];
  errors: Partial<Record<keyof FormValues, { message?: string }>>;
  lockedFields: { fullName: boolean; email: boolean };
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">

      {/* Full Name — locked when pre-filled from session */}
      <Field label="Full Name *" id="fullName" error={errors.fullName?.message}>
        <div className="relative">
          <input
            id="fullName"
            type="text"
            placeholder="Enter your full name"
            {...register("fullName")}
            readOnly={lockedFields.fullName}
            className={
              lockedFields.fullName
                ? INPUT_READONLY
                : errors.fullName
                  ? INPUT_ERROR
                  : INPUT
            }
            title={lockedFields.fullName ? "Pre-filled from your account — cannot be changed here" : undefined}
          />
          {lockedFields.fullName && (
            <Lock size={13} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden />
          )}
        </div>
      </Field>

      {/* Email — locked when pre-filled from session */}
      <Field label="Email Address *" id="email" error={errors.email?.message}>
        <div className="relative">
          <input
            id="email"
            type="email"
            placeholder="Enter your email address"
            {...register("email")}
            readOnly={lockedFields.email}
            className={
              lockedFields.email
                ? INPUT_READONLY
                : errors.email
                  ? INPUT_ERROR
                  : INPUT
            }
            title={lockedFields.email ? "Pre-filled from your account — cannot be changed here" : undefined}
          />
          {lockedFields.email && (
            <Lock size={13} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden />
          )}
        </div>
      </Field>

      {/* Phone */}
      <Field label="Phone Number *" id="phone" error={errors.phone?.message}>
        <input
          id="phone"
          type="tel"
          placeholder="Enter your phone number"
          {...register("phone")}
          className={errors.phone ? INPUT_ERROR : INPUT}
        />
      </Field>

      {/* LinkedIn */}
      <Field label="LinkedIn Profile URL" id="linkedin" error={errors.linkedin?.message}>
        <input
          id="linkedin"
          type="url"
          placeholder="https://linkedin.com/in/your-profile"
          {...register("linkedin")}
          className={errors.linkedin ? INPUT_ERROR : INPUT}
        />
      </Field>

      {/* Affiliation */}
      <Field label="Current Affiliation *" id="affiliation" error={errors.affiliation?.message}>
        <select
          id="affiliation"
          {...register("affiliation")}
          className={errors.affiliation ? INPUT_ERROR : INPUT}
        >
          <option value="">Select affiliation…</option>
          <option>Student</option>
          <option>Faculty</option>
          <option>Alumni</option>
          <option>External Founder</option>
        </select>
      </Field>

      {/* Org Name */}
      <Field label="College / Organization Name *" id="orgName" error={errors.orgName?.message}>
        <input
          id="orgName"
          type="text"
          placeholder="Enter your college or organization name"
          {...register("orgName")}
          className={errors.orgName ? INPUT_ERROR : INPUT}
        />
      </Field>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   STEP 2 — Startup Details
   ══════════════════════════════════════════════════════════════════════════ */

function Step2({
  register,
  errors,
}: {
  register: ReturnType<typeof useForm<FormValues>>["register"];
  errors: Partial<Record<keyof FormValues, { message?: string }>>;
}) {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">

        <Field label="Startup / Project Name *" id="startupName" error={errors.startupName?.message}>
          <input
            id="startupName"
            type="text"
            placeholder="Enter your startup or project name"
            {...register("startupName")}
            className={errors.startupName ? INPUT_ERROR : INPUT}
          />
        </Field>

        <Field label="Target Market" id="targetMarket" error={errors.targetMarket?.message}>
          <input
            id="targetMarket"
            type="text"
            placeholder="Describe your primary target market"
            {...register("targetMarket")}
            className={errors.targetMarket ? INPUT_ERROR : INPUT}
          />
        </Field>

        <Field label="Team Size *" id="teamSize" error={errors.teamSize?.message}>
          <input
            id="teamSize"
            type="number"
            min={1}
            placeholder="Number of team members"
            {...register("teamSize")}
            className={errors.teamSize ? INPUT_ERROR : INPUT}
          />
        </Field>

        <Field label="Current Stage *" id="stage" error={errors.stage?.message}>
          <select
            id="stage"
            {...register("stage")}
            className={errors.stage ? INPUT_ERROR : INPUT}
          >
            <option value="">Select stage…</option>
            <option>Idea</option>
            <option>Prototype</option>
            <option>MVP</option>
            <option>Revenue Generating</option>
          </select>
        </Field>

        <Field label="Sector *" id="sector" error={errors.sector?.message}>
          <select
            id="sector"
            {...register("sector")}
            className={errors.sector ? INPUT_ERROR : INPUT}
          >
            <option value="">Select sector…</option>
            <option>AI &amp; Deep Tech</option>
            <option>Clean-Tech &amp; EV</option>
            <option>Health-Tech</option>
            <option>Industry 4.0 &amp; IoT</option>
            <option>Robotics &amp; Drones</option>
            <option>AR/VR &amp; Web3</option>
            <option>Other</option>
          </select>
        </Field>

        <Field label="Registered Company?" id="isRegistered" error={errors.isRegistered?.message}>
          <select
            id="isRegistered"
            {...register("isRegistered")}
            className={errors.isRegistered ? INPUT_ERROR : INPUT}
          >
            <option value="">Select…</option>
            <option>Yes — Pvt. Ltd.</option>
            <option>Yes — LLP</option>
            <option>Yes — Other</option>
            <option>No</option>
          </select>
        </Field>
      </div>

      <Field label="Brief Problem Statement *" id="problemStatement" error={errors.problemStatement?.message}>
        <textarea
          id="problemStatement"
          rows={3}
          placeholder="Describe the problem you are solving in 2–4 sentences."
          {...register("problemStatement")}
          className={`${errors.problemStatement ? INPUT_ERROR : INPUT} resize-none`}
        />
      </Field>

      <Field label="Proposed Solution *" id="proposedSolution" error={errors.proposedSolution?.message}>
        <textarea
          id="proposedSolution"
          rows={3}
          placeholder="How does your solution address the problem uniquely?"
          {...register("proposedSolution")}
          className={`${errors.proposedSolution ? INPUT_ERROR : INPUT} resize-none`}
        />
      </Field>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   STEP 3 — Program & Upload
   ══════════════════════════════════════════════════════════════════════════ */

function Step3({
  register,
  errors,
  onFile,
  setValue,
}: {
  register: ReturnType<typeof useForm<FormValues>>["register"];
  errors: Partial<Record<keyof FormValues, { message?: string }>>;
  onFile: (f: File | null) => void;
  setValue: ReturnType<typeof useForm<FormValues>>["setValue"];
}) {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">

        <Field label="Select Program *" id="program" error={errors.program?.message}>
          <select
            id="program"
            {...register("program")}
            className={errors.program ? INPUT_ERROR : INPUT}
          >
            <option value="">Select program…</option>
            <option>NIDHI EIR (Pre-Incubation)</option>
            <option>BIZZNESS Student Program</option>
            <option>Core Incubation</option>
            <option>Global Startupreneur (Acceleration)</option>
          </select>
        </Field>

        <Field label="Existing Funding?" id="existingFunding" error={errors.existingFunding?.message}>
          <select
            id="existingFunding"
            {...register("existingFunding")}
            className={errors.existingFunding ? INPUT_ERROR : INPUT}
          >
            <option value="">Select…</option>
            <option>No — Bootstrapped</option>
            <option>Yes — Friends &amp; Family</option>
            <option>Yes — Angel Funded</option>
            <option>Yes — Government Grant</option>
            <option>Yes — VC Backed</option>
          </select>
        </Field>

        <Field label="How did you hear about us?" id="heardFrom" error={errors.heardFrom?.message}>
          <select
            id="heardFrom"
            {...register("heardFrom")}
            className={errors.heardFrom ? INPUT_ERROR : INPUT}
          >
            <option value="">Select…</option>
            <option>Social Media</option>
            <option>JSSATEN Faculty / Staff</option>
            <option>Fellow Founder / Alumni</option>
            <option>DST / Government Portal</option>
            <option>News / Media</option>
            <option>Other</option>
          </select>
        </Field>

        {/* Pitch deck — unregistered in RHF (File type), handled separately */}
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

      <Field label="Additional Information" id="additionalInfo" error={errors.additionalInfo?.message}>
        <textarea
          id="additionalInfo"
          rows={4}
          placeholder="Anything else you'd like to share with our screening committee?"
          {...register("additionalInfo")}
          className={`${errors.additionalInfo ? INPUT_ERROR : INPUT} resize-none`}
        />
      </Field>

      {/* ── DPDP Act Consent Checkbox ───────────────────────────────
       * z.literal(true) requires the value to be the boolean true, not
       * a truthy string — so we use onChange + setValue to set true/undefined
       * rather than using register() directly (which would give "on"/"").
       */}
      <div
        className={`flex items-start gap-3 p-4 rounded-xl border transition-colors duration-200
                    ${errors.consent
            ? "border-red-300 bg-red-50/40"
            : "border-slate-200 bg-slate-50"
          }`}
      >
        <input
          id="consent"
          type="checkbox"
          className="mt-0.5 w-4 h-4 shrink-0 accent-cyan-600 cursor-pointer"
          onChange={(e) =>
            /*
             * Set true when checked, undefined when unchecked so z.literal(true)
             * fails validation on submit without the box ticked.
             */
            setValue(
              "consent",
              e.target.checked ? true : (undefined as unknown as true),
              { shouldValidate: true }
            )
          }
        />
        <div className="flex-1">
          <label
            htmlFor="consent"
            className="text-sm text-slate-700 leading-relaxed cursor-pointer"
          >
            I consent to the processing of my application data under the{" "}
            <strong>DPDP Act 2023</strong> and agree to the{" "}
            <Link
              href="/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-600 underline underline-offset-2 hover:text-cyan-500
                         transition-colors"
            >
              Privacy Policy
            </Link>
            .
          </label>
          {errors.consent && (
            <p role="alert" className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
              <span aria-hidden>⚠</span> {errors.consent.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   PROGRESS BAR
   ══════════════════════════════════════════════════════════════════════════ */

function ProgressBar({ step, total }: { step: number; total: number }) {
  const pct = Math.round((step / total) * 100);
  const stepName = ["Personal Info", "Startup Details", "Program & Upload"][step - 1] || "";

  return (
    <div className="mb-8">
      {/* Mobile */}
      <div className="flex md:hidden items-center justify-between mb-6">
        <span className="text-sm text-slate-400">Step {step} of {total}</span>
        <span className="text-sm font-medium text-cyan-600">{stepName}</span>
      </div>

      {/* Desktop */}
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

/* ══════════════════════════════════════════════════════════════════════════
   SUCCESS SCREEN
   ══════════════════════════════════════════════════════════════════════════ */

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
          <ObfuscatedEmail
            encoded={SITE_CONFIG.supportEmailBase64}
            className="text-cyan-600"
          />
        </p>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   FORM CONTENT  (inner — reads useSearchParams, wrapped in Suspense below)
   ══════════════════════════════════════════════════════════════════════════ */

function FormContent({ initialData }: { initialData?: InitialData }) {
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [pitchDeck, setPitchDeck] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  /* ── React Hook Form ── */
  const {
    register,
    trigger,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    /*
     * defaultValues hydrates the form immediately — no useEffect needed.
     * initialData (from AuthGate) is stable across renders.
     */
    defaultValues: {
      fullName: initialData?.fullName ?? "",
      email: initialData?.email ?? "",
      phone: "",
      linkedin: "",
      affiliation: "",
      orgName: "",
      startupName: "",
      targetMarket: "",
      teamSize: "",
      stage: "",
      sector: "",
      isRegistered: "",
      problemStatement: "",
      proposedSolution: "",
      program: "",
      existingFunding: "",
      heardFrom: "",
      additionalInfo: "",
      /*
       * consent defaults to undefined (not false) so z.literal(true) fails
       * correctly on first submit if the user never touched the checkbox.
       * RHF will set it to `true` when the checkbox is ticked.
       */
      consent: undefined as unknown as true,
    },
  });

  /*
   * Pre-select program from ?program=<slug> query parameter.
   * Must run after mount (useSearchParams is only available client-side).
   * Uses setValue so React Hook Form tracks the value correctly.
   */
  useEffect(() => {
    const slug = searchParams.get("program");
    const value = slug ? (PROGRAM_SLUG_MAP[slug] ?? "") : "";
    if (value) setValue("program", value);
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, []); // run once on mount

  /* ── Locked-field flags (only lock if session actually provided a value) ── */
  const lockedFields = {
    fullName: !!initialData?.fullName,
    email: !!initialData?.email,
  };

  /* ══════════════════════════════════════════════════════════════════════
     NAVIGATION — trigger() gates advancement
     ══════════════════════════════════════════════════════════════════════ */

  const goNext = async () => {
    const fields = STEP_FIELDS[currentStep];
    const valid = await trigger(fields);
    if (valid) setCurrentStep((s) => Math.min(s + 1, TOTAL_STEPS));
  };

  const goBack = () => setCurrentStep((s) => Math.max(s - 1, 1));

  /* ══════════════════════════════════════════════════════════════════════
     SUBMISSION — simulate API call, show success screen
     ══════════════════════════════════════════════════════════════════════ */

  const onSubmit = handleSubmit(async (data) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      /*
       * Build a multipart/form-data payload so the pitchDeck File object
       * can be sent alongside the text fields in a single request.
       *
       * IMPORTANT: do NOT set Content-Type manually — the browser must set
       * it automatically so it can include the correct multipart boundary
       * string (e.g. "multipart/form-data; boundary=----WebKit...").
       * Manually setting "application/json" here would corrupt the request.
       */
      const fd = new FormData();

      /* Append every validated text field from the RHF payload */
      (Object.keys(data) as (keyof typeof data)[]).forEach((key) => {
        const val = data[key];
        if (typeof val === "string") fd.append(key, val);
      });

      /* Attach the pitch deck only if the user actually selected a file */
      if (pitchDeck instanceof File) {
        fd.append("pitchDeck", pitchDeck, pitchDeck.name);
      }

      const res = await fetch("/api/applications", {
        method: "POST",
        /* No Content-Type header — browser sets it with the boundary */
        body: fd,
      });

      if (res.ok) {
        setIsSuccess(true);
        return;
      }

      /* Parse the error message from the API response */
      let message = "Something went wrong. Please try again.";
      try {
        const json = await res.json() as { error?: string };
        if (json.error) message = json.error;
      } catch { /* ignore parse failure */ }

      if (res.status === 429) {
        message = "You have submitted too many applications. Please wait an hour before trying again.";
      } else if (res.status === 409) {
        message = "You have already submitted an application for this program. Our team will get in touch soon.";
      } else if (res.status === 401) {
        message = "Your session has expired. Please refresh the page and sign in again.";
      }

      setSubmitError(message);
    } catch {
      setSubmitError("Network error \u2014 please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  });

  /* ══════════════════════════════════════════════════════════════════════
     RENDER
     ══════════════════════════════════════════════════════════════════════ */

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-10 relative z-10 pb-16">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 md:p-12">

        {isSuccess ? (
          <SuccessScreen />
        ) : (
          <form onSubmit={onSubmit} noValidate>
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
                {currentStep === 1 && (
                  <Step1
                    register={register}
                    errors={errors}
                    lockedFields={lockedFields}
                  />
                )}
                {currentStep === 2 && (
                  <Step2
                    register={register}
                    errors={errors}
                  />
                )}
                {currentStep === 3 && (
                  <Step3
                    register={register}
                    errors={errors}
                    onFile={setPitchDeck}
                    setValue={setValue}
                  />
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation bar */}
            <div
              className={`flex flex-col-reverse sm:flex-row mt-8 gap-3
                ${currentStep > 1 ? "sm:justify-between" : "sm:justify-end"}`}
            >
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={goBack}
                  className="flex items-center justify-center sm:justify-start gap-1.5 px-6 py-3
                             rounded-xl text-sm font-medium text-slate-600 border border-slate-200
                             hover:bg-slate-50 transition-all duration-200 w-full sm:w-auto"
                >
                  <ChevronLeft size={16} /> Back
                </button>
              )}

              {currentStep < TOTAL_STEPS ? (
                <button
                  type="button"
                  onClick={goNext}
                  className="flex items-center justify-center sm:justify-start gap-1.5 px-7 py-3
                             rounded-xl text-sm font-semibold text-white bg-slate-900
                             hover:bg-cyan-600 hover:shadow-md hover:shadow-cyan-500/20
                             sm:hover:-translate-y-0.5 transition-all duration-300 w-full sm:w-auto"
                >
                  Next <ChevronRight size={16} />
                </button>
              ) : (
                <>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center justify-center sm:justify-start gap-2 px-8 py-3
                               rounded-xl text-sm font-semibold text-white bg-cyan-600
                               hover:bg-cyan-500 hover:shadow-md hover:shadow-cyan-500/30
                               sm:hover:-translate-y-0.5 transition-all duration-300
                               disabled:opacity-70 disabled:cursor-not-allowed w-full sm:w-auto"
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
                </>
              )}
            </div>

            {/* Inline submission error — shown beneath nav bar */}
            {submitError && (
              <motion.p
                role="alert"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 text-sm text-red-500 text-center leading-snug"
              >
                ⚠ {submitError}
              </motion.p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   PUBLIC EXPORT — Suspense boundary
   ══════════════════════════════════════════════════════════════════════════
   Wrapping FormContent in Suspense satisfies Next.js's requirement that
   components using useSearchParams must not suspend the entire page tree.
   The skeleton fallback matches the form card height to prevent layout shift.
   ══════════════════════════════════════════════════════════════════════════ */

export default function MultiStepForm({
  initialData,
}: {
  initialData?: InitialData;
}) {
  return (
    <Suspense
      fallback={
        <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-10 relative z-10 pb-16">
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 md:p-12
                          animate-pulse min-h-[420px]" />
        </div>
      }
    >
      <FormContent initialData={initialData} />
    </Suspense>
  );
}
