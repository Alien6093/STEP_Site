"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CalendarCheck,
  Loader2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { saveBookingData, loadBookingData, clearBookingData } from "@/hooks/useBookingCache";
import SlotPicker, { type MentorSlot } from "./SlotPicker";

/* ─── Types ───────────────────────────────────────────────────────────── */

type Step = 1 | 2 | 3;

interface FormData {
  startupName: string;
  startupStage: string;
  topic: string;
}

const STAGE_OPTIONS = [
  "Idea / Pre-Seed",
  "MVP / Prototype",
  "Early Traction",
  "Seed Funded",
  "Series A+",
];

const INITIAL_FORM: FormData = {
  startupName: "",
  startupStage: "",
  topic: "",
};

/* ─── Props ───────────────────────────────────────────────────────────── */

interface BookingFormProps {
  mentorId?: string;   // Sanity _id — used for slot fetch + abandoned tracking
  mentorName: string;
  isOpen: boolean;
  onClose: () => void;
  /**
   * Called by the auth interceptor when the user tries to confirm a booking
   * while unauthenticated. The parent should open LoginModal in response.
   * Keeping this as a callback keeps BookingForm decoupled from LoginModal.
   */
  onRequestLogin?: () => void;
}

/* ─── Step indicator ──────────────────────────────────────────────────── */

function StepIndicator({ current }: { current: Step }) {
  const steps = ["Pick Slot", "Details", "Confirmed"];
  return (
    <div className="flex items-center gap-2 mb-6">
      {steps.map((label, i) => {
        const stepNum = (i + 1) as Step;
        const done = current > stepNum;
        const active = current === stepNum;
        return (
          <div key={label} className="flex items-center gap-2">
            <div className={`
              flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold
              transition-all duration-300 shrink-0
              ${done ? "bg-emerald-500 text-white" :
                active ? "bg-cyan-400 text-slate-900" :
                  "bg-slate-700 text-slate-500"}
            `}>
              {done ? <CheckCircle2 size={14} /> : stepNum}
            </div>
            <span className={`text-xs font-medium whitespace-nowrap
              ${active ? "text-slate-200" : done ? "text-emerald-400" : "text-slate-600"}`}>
              {label}
            </span>
            {i < steps.length - 1 && (
              <div className={`w-6 h-px shrink-0 transition-colors duration-300
                ${done ? "bg-emerald-500/60" : "bg-slate-700"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── Reusable field wrapper ──────────────────────────────────────────── */

function FieldLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="block text-xs font-semibold tracking-widest text-slate-500 uppercase mb-1.5">
      {children}
    </label>
  );
}

const inputBase =
  "w-full px-4 py-3 rounded-xl text-sm bg-slate-800 border border-slate-700 text-slate-100 " +
  "placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-2 " +
  "focus:ring-cyan-500/20 transition-all duration-150";

/* ─── Component ───────────────────────────────────────────────────────── */

export default function BookingForm({
  mentorId,
  mentorName,
  isOpen,
  onClose,
  onRequestLogin,
}: BookingFormProps) {
  /* Memoize so supabase identity is stable across renders (safe useEffect dep) */
  const supabase = useMemo(() => createClient(), []);

  const [step, setStep] = useState<Step>(1);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmError, setConfirmError] = useState("");
  const [slots, setSlots] = useState<MentorSlot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

  /* ── Auth state — resolved client-side only ─────────────────────────── */
  /**
   * We track the authenticated user here so the interceptor can run a
   * synchronous check without an extra async round-trip on every click.
   * null  = unauthenticated (or not yet resolved)
   * object = authenticated Supabase User
   */
  const [authUser, setAuthUser] = useState<{ id: string } | null>(null);

  /* Resolve initial auth state and subscribe to session changes.
   * onAuthStateChange fires immediately with the current session on mount,
   * so we never need a separate getUser() call for the initial value. */
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setAuthUser(session?.user ?? null);
      },
    );
    return () => subscription.unsubscribe();
  }, [supabase]);

  const set = (key: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  /* ── Fetch available slots when modal opens ─────────────────────── */
  useEffect(() => {
    if (!isOpen || !mentorId) return;

    /* AbortController prevents stale setState if the modal closes mid-fetch */
    let cancelled = false;

    (async () => {
      setSlotsLoading(true);
      try {
        const { data, error } = await supabase
          .from("mentor_slots")
          .select("id, slot_date, slot_time, is_booked")
          .eq("mentor_sanity_id", mentorId)
          .order("slot_date", { ascending: true })
          .order("slot_time", { ascending: true });

        if (!cancelled && !error && data) setSlots(data as MentorSlot[]);
      } finally {
        if (!cancelled) setSlotsLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [isOpen, mentorId, supabase]);

  /* ── Task 2: Post-login form hydration ──────────────────────────────── */
  /**
   * Runs whenever the auth user changes (null → user) after a successful
   * OTP verification in LoginModal.
   *
   * SSR safety: loadBookingData() already guards `typeof window` internally,
   * so this effect is safe to declare unconditionally — it will simply return
   * null during any server-side pass.
   */
  useEffect(() => {
    if (!authUser) return; // only hydrate after a confirmed login

    const cached = loadBookingData();
    if (!cached) return;

    /* Restore saved form values into React state */
    setForm({
      startupName: cached.startupName,
      startupStage: cached.startupStage,
      topic: cached.discussionTopic,
    });

    /* If a slot was captured before redirect, note it (slot UI stays on step 1) */
    // cached.slotId is available if we ever pass it to saveBookingData

    /* Clear cache so it never accidentally hydrates a future, unrelated booking */
    clearBookingData();

    /* Jump to step 2 automatically so the user lands right on the form */
    setStep(2);
  }, [authUser]);

  /* ── Step 1 → 2: record abandoned + advance ────────────────────── */
  const handleStep1Next = () => {
    /* Fire-and-forget abandoned tracking — errors logged but never block UI */
    if (mentorId) {
      supabase.auth
        .getUser()
        .then(({ data }) => {
          const email = data.user?.email;
          if (email) {
            fetch("/api/abandoned", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, mentorId, mentorName }),
            }).catch(console.error);
          }
        })
        .catch(console.error);
    }
    setStep(2);
  };

  /* ── Task 1: Auth interceptor + Final confirm ───────────────────────── */
  /**
   * Called by the native <form onSubmit>. The browser has already validated
   * required fields before this fires, so we only need to run our auth
   * interceptor and then proceed to the API call.
   */
  const handleConfirm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // ① stop default HTML form submission
    setConfirmError("");

    /* ── Interceptor: gate the API call on authentication ── */
    if (!authUser) {
      /* Persist form data so it survives the login redirect */
      saveBookingData({
        startupName: form.startupName,
        startupStage: form.startupStage,
        discussionTopic: form.topic,
        slotId: selectedSlotId ?? undefined,
      });

      /* Signal the parent to open LoginModal — never reach the API call */
      onRequestLogin?.();

      /* Friendly inline note so the user understands what happened */
      setConfirmError("Please log in to complete your booking. Your details have been saved.");
      return; // ← hard stop: the booking API is never called
    }

    /* ── Authenticated path: proceed to API ── */
    setIsLoading(true); // Task 2: set loading before fetch
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slotId: selectedSlotId,
          mentorName,
          startupName: form.startupName,
          startupStage: form.startupStage,
          discussionTopic: form.topic,
          date: labelDate,
          time: selectedTime,
        }),
      });

      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error ?? "Booking failed.");
      }

      setStep(3);
    } catch (err) {
      console.error("[BookingForm] confirm error:", err);
      setConfirmError(err instanceof Error ? err.message : "Booking failed. Please try again.");
    } finally {
      setIsLoading(false); // Task 2: always reset — 200, 409, or 500
    }
  };

  const handleSlotSelect = (date: string, time: string, slotId: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
    setSelectedSlotId(slotId);
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStep(1);
      setSelectedDate(null);
      setSelectedTime(null);
      setSelectedSlotId(null);
      setForm(INITIAL_FORM);
      setConfirmError("");
    }, 300);
  };

  const step2Valid =
    form.startupName.trim().length > 0 && form.startupName.length <= 120 &&
    form.startupStage.length > 0 &&
    form.topic.trim().length > 0 && form.topic.length <= 1000;

  /* Human-readable date, e.g. "Wed, 23 Apr 2026" */
  const labelDate = selectedDate
    ? new Date(selectedDate + "T00:00:00").toLocaleDateString("en-GB", {
      weekday: "short", day: "numeric", month: "short", year: "numeric",
    })
    : "";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ── Backdrop ── */}
          <motion.div
            key="booking-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-slate-950/85 backdrop-blur-sm"
            onClick={handleClose}
            aria-hidden="true"
          />

          {/* ── Modal card ── */}
          <motion.div
            key="booking-card"
            role="dialog"
            aria-modal="true"
            aria-label={`Book a session with ${mentorName}`}
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed inset-0 z-[101] flex items-center justify-center px-4 py-8 pointer-events-none"
          >
            <div
              className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto
                         bg-[#0F172A] border border-slate-700/60 rounded-2xl
                         shadow-2xl shadow-slate-950/60 p-6 sm:p-8 pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              {step !== 3 && (
                <button
                  onClick={handleClose}
                  aria-label="Close booking modal"
                  className="absolute top-4 right-4 p-2 rounded-full text-slate-500
                             hover:text-slate-200 hover:bg-slate-800 transition-colors duration-150"
                >
                  <X size={18} />
                </button>
              )}

              {/* Mentor tag */}
              {step !== 3 && (
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-slate-600
                                  flex items-center justify-center text-xs font-bold text-white shrink-0">
                    {mentorName.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Booking session with</p>
                    <p className="text-sm font-semibold text-slate-200">{mentorName}</p>
                  </div>
                </div>
              )}

              {/* Step indicator */}
              {step !== 3 && <StepIndicator current={step} />}

              {/* ══════════════════════════════════════════════════════ */}
              {/* Step content — animated swap                          */}
              {/* ══════════════════════════════════════════════════════ */}
              <AnimatePresence mode="wait">

                {/* ── Step 1: Pick Slot ── */}
                {step === 1 && (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h2 className="text-lg font-bold text-white mb-5">
                      Choose your preferred slot
                    </h2>

                    <SlotPicker
                      slots={slots}
                      isLoading={slotsLoading}
                      onSelectSlot={handleSlotSelect}
                    />

                    {/* Selected slot summary */}
                    {selectedDate && selectedTime && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-5 flex items-center gap-2 px-4 py-3 rounded-xl
                                   bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-sm"
                      >
                        <CalendarCheck size={15} className="shrink-0 text-cyan-400" />
                        <span>
                          <span className="font-semibold">{selectedTime}</span>
                          {" on "}
                          <span className="font-semibold">{labelDate}</span>
                        </span>
                      </motion.div>
                    )}

                    {/* Footer */}
                    <div className="mt-6 flex justify-end">
                      <button
                        type="button"
                        onClick={handleStep1Next}
                        disabled={!selectedDate || !selectedTime}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold
                                   bg-cyan-400 text-slate-900 hover:bg-cyan-300
                                   disabled:opacity-40 disabled:cursor-not-allowed
                                   transition-all duration-150 hover:shadow-lg hover:shadow-cyan-400/20"
                      >
                        Next
                        <ArrowRight size={15} />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* ── Step 2: Startup Details ── */}
                {step === 2 && (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 16 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-5"
                  >
                    <h2 className="text-lg font-bold text-white">
                      Tell us about your startup
                    </h2>

                    {/* Slot recap */}
                    <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-800/60 border border-slate-700/50 text-sm text-slate-400">
                      <CalendarCheck size={13} className="text-cyan-400 shrink-0" />
                      <span>
                        <span className="text-slate-300 font-medium">{selectedTime}</span>
                        {" · "}
                        {labelDate}
                      </span>
                    </div>

                    {/*
                      Task 1: Wrap fields + footer in a <form> so native HTML5
                      validation fires (required attributes) BEFORE our auth
                      interceptor runs inside handleConfirm.
                    */}
                    <form onSubmit={handleConfirm} noValidate={false} className="space-y-5">

                      {/* Startup Name */}
                      <div>
                        <FieldLabel htmlFor="bf-startup-name">Startup Name</FieldLabel>
                        <input
                          id="bf-startup-name"
                          type="text"
                          value={form.startupName}
                          onChange={set("startupName")}
                          placeholder="e.g. NeuraSense Technologies"
                          maxLength={120}
                          required
                          className={inputBase}
                        />
                      </div>

                      {/* Startup Stage */}
                      <div>
                        <FieldLabel htmlFor="bf-startup-stage">Startup Stage</FieldLabel>
                        <select
                          id="bf-startup-stage"
                          value={form.startupStage}
                          onChange={set("startupStage")}
                          required
                          className={`${inputBase} appearance-none`}
                        >
                          <option value="" disabled>Select your current stage…</option>
                          {STAGE_OPTIONS.map((o) => (
                            <option key={o} value={o} className="bg-slate-900 text-slate-100">
                              {o}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Discussion Topic */}
                      <div>
                        <FieldLabel htmlFor="bf-topic">Discussion Topic</FieldLabel>
                        <textarea
                          id="bf-topic"
                          value={form.topic}
                          onChange={set("topic")}
                          rows={3}
                          maxLength={1000}
                          required
                          placeholder="What do you want to discuss? (e.g. fundraising strategy, GTM approach…)"
                          className={`${inputBase} resize-none min-h-[80px]`}
                        />
                        {form.topic.length > 900 && (
                          <p className="mt-1 text-[11px] text-amber-500 text-right">
                            {1000 - form.topic.length} chars remaining
                          </p>
                        )}
                      </div>

                      {/* Confirm / interceptor message */}
                      {confirmError && (
                        <p
                          role="alert"
                          className={`flex items-center gap-1.5 text-xs mt-1 ${
                            /* Auth-intercept notice is amber; real errors are red */
                            confirmError.startsWith("Please log in")
                              ? "text-amber-400"
                              : "text-red-400"
                            }`}
                        >
                          <span aria-hidden="true">
                            {confirmError.startsWith("Please log in") ? "🔒" : "⚠"}
                          </span>
                          {" "}{confirmError}
                        </p>
                      )}

                      {/* Footer */}
                      <div className="flex items-center justify-between gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          disabled={isLoading}
                          className="inline-flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium
                                     text-slate-400 hover:text-slate-200 hover:bg-slate-800
                                     border border-transparent hover:border-slate-700
                                     disabled:opacity-50 disabled:cursor-not-allowed
                                     transition-all duration-150"
                        >
                          <ArrowLeft size={15} />
                          Back
                        </button>

                        {/* Task 3: type="submit", disabled={isLoading}, loading feedback */}
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold
                                     bg-cyan-400 text-slate-900 hover:bg-cyan-400/80
                                     disabled:opacity-50 disabled:cursor-not-allowed
                                     transition-all duration-150 hover:shadow-lg hover:shadow-cyan-400/20"
                        >
                          {isLoading ? (
                            <><Loader2 size={15} className="animate-spin" /> Confirming…</>
                          ) : (
                            "Confirm Booking"
                          )}
                        </button>
                      </div>

                    </form>{/* end Task 1 form */}
                  </motion.div>
                )}

                {/* ── Step 3: Success ── */}
                {step === 3 && (
                  <motion.div
                    key="step-3"
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.92 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="flex flex-col items-center text-center py-6 gap-5"
                  >
                    {/* Animated tick */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 280, damping: 18, delay: 0.1 }}
                      className="flex items-center justify-center w-20 h-20 rounded-full
                                 bg-emerald-500/15 border-2 border-emerald-500/30"
                    >
                      <CheckCircle2 size={40} className="text-emerald-400" />
                    </motion.div>

                    <div>
                      <h2 className="text-xl font-bold text-white">Booking Confirmed!</h2>
                      <p className="mt-2 text-sm text-slate-400 leading-relaxed max-w-xs mx-auto">
                        Your session with{" "}
                        <span className="text-slate-200 font-medium">{mentorName}</span> is
                        booked for{" "}
                        <span className="text-cyan-300 font-semibold">{selectedTime}</span> on{" "}
                        <span className="text-cyan-300 font-semibold">{labelDate}</span>.
                      </p>
                    </div>

                    <div className="mt-1 px-5 py-4 rounded-xl bg-slate-800/60 border border-slate-700/50
                                    text-left w-full max-w-sm space-y-1.5">
                      <p className="text-xs text-slate-500">
                        <span className="text-slate-400 font-medium">Startup:</span>{" "}
                        {form.startupName}
                      </p>
                      <p className="text-xs text-slate-500">
                        <span className="text-slate-400 font-medium">Stage:</span>{" "}
                        {form.startupStage}
                      </p>
                      <p className="text-xs text-slate-500">
                        <span className="text-slate-400 font-medium">Topic:</span>{" "}
                        {form.topic}
                      </p>
                    </div>

                    <p className="text-xs text-slate-600">
                      A calendar invite will be sent to your email address.
                    </p>

                    <button
                      type="button"
                      onClick={handleClose}
                      className="px-8 py-3 rounded-xl bg-cyan-400 text-slate-900 text-sm font-semibold
                                 hover:bg-cyan-300 transition-all duration-150
                                 hover:shadow-lg hover:shadow-cyan-400/20"
                    >
                      Done
                    </button>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
