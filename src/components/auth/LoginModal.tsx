"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ArrowLeft,
  Loader2,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

/* ─── Props ─────────────────────────────────────────────────────────────── */

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/* ─── State machine views ────────────────────────────────────────────────── */

type View = "login" | "signup" | "otp_login" | "otp_signup";

/* ─── Shared sub-components ──────────────────────────────────────────────── */

/** Labelled text / email / tel input */
function Field({
  id,
  label,
  type = "text",
  value,
  placeholder,
  autoFocus,
  autoComplete,
  maxLength,
  onChange,
  onKeyDown,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  placeholder?: string;
  autoFocus?: boolean;
  autoComplete?: string;
  maxLength?: number;
  onChange: (v: string) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-slate-700"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        autoFocus={autoFocus}
        autoComplete={autoComplete}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        className="w-full px-4 py-3 rounded-xl border border-slate-200
                   text-sm text-slate-900 bg-white
                   placeholder:text-slate-400
                   focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent
                   transition-shadow"
      />
    </div>
  );
}

/** Inline error message */
function ErrorMsg({ message }: { message: string }) {
  if (!message) return null;
  return (
    <p className="flex items-center gap-1.5 text-xs text-red-500" role="alert">
      <AlertCircle size={12} aria-hidden="true" />
      {message}
    </p>
  );
}

/** Primary CTA button */
function PrimaryBtn({
  onClick,
  disabled,
  loading,
  loadingLabel,
  children,
}: {
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  loadingLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl
                 bg-slate-900 text-white text-sm font-semibold
                 hover:bg-cyan-600
                 disabled:opacity-50 disabled:cursor-not-allowed
                 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 transform"
    >
      {loading ? (
        <>
          <Loader2 size={16} className="animate-spin" />
          {loadingLabel}
        </>
      ) : (
        children
      )}
    </button>
  );
}

/** Ghost / outline secondary button */
function SecondaryBtn({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl
                 border border-slate-300 text-slate-700 text-sm font-semibold
                 hover:border-cyan-500 hover:text-cyan-600 hover:bg-cyan-50
                 transition-all duration-200"
    >
      {children}
    </button>
  );
}

/** "or" horizontal divider */
function Divider() {
  return (
    <div className="flex items-center gap-3 my-3">
      <div className="flex-1 h-px bg-slate-200" />
      <span className="text-xs text-slate-400 font-medium select-none">or</span>
      <div className="flex-1 h-px bg-slate-200" />
    </div>
  );
}

/** Back navigation row — shown at top of a nested view */
function BackRow({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1.5 text-sm text-slate-500
                 hover:text-slate-800 transition-colors mb-5 -ml-0.5 group"
    >
      <ArrowLeft
        size={15}
        className="transition-transform duration-150 group-hover:-translate-x-0.5"
      />
      {label}
    </button>
  );
}

/* ─── Imperative cooldown ─────────────────────────────────────────────────── */

/**
 * Returns [cooldown, startCooldown].
 * Call startCooldown() whenever an OTP is sent (first send OR resend).
 * The counter ticks from `seconds` → 0 and stops; can be restarted at any time.
 */
function useCooldown(seconds = 60): [number, () => void] {
  const [cooldown, setCooldown] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startCooldown = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setCooldown(seconds);
    intervalRef.current = setInterval(() => {
      setCooldown((s) => {
        if (s <= 1) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  };

  /* Clean up on unmount */
  useEffect(() => () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  return [cooldown, startCooldown];
}

/* ─── Component ─────────────────────────────────────────────────────────── */

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const router   = useRouter();
  /* Memoized so auth listeners always capture a stable client instance */
  const supabase = useMemo(() => createClient(), []);

  /* ── View state machine ── */
  const [view, setView] = useState<View>("login");

  /* ── Shared form fields ── */
  const [email, setEmail] = useState("");
  const [otp,   setOtp]   = useState("");

  /* ── Signup-only fields ── */
  const [name,  setName]  = useState("");
  const [phone, setPhone] = useState("");

  /* ── Async / feedback states ── */
  const [isSending,   setIsSending]   = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error,       setError]       = useState("");

  /* ── Cooldown timer — shared by both OTP views ── */
  const [cooldown, startCooldown] = useCooldown(60);

  /* ─── Handlers ──────────────────────────────────────────────────────── */

  /**
   * LOGIN — strict path.
   * shouldCreateUser: false → Supabase returns an error if this email
   * has no account, so we can show a friendly "not found" message.
   */
  const handleLogin = async () => {
    if (!email.trim()) return;
    /* Basic email format guard — prevents obvious typos hitting the network */
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setIsSending(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: false },
      });
      if (error) {
        /* Supabase returns an error when the email isn't registered */
        setError("Email not found. Please create an account.");
      } else {
        setOtp("");
        startCooldown();
        setView("otp_login");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to send OTP.");
    } finally {
      setIsSending(false);
    }
  };

  /**
   * SIGNUP — injects user metadata on first sign-in.
   * Supabase merges `data` into user_metadata on the new account.
   */
  const handleSignup = async () => {
    if (!name.trim())  { setError("Please enter your full name.");   return; }
    if (!email.trim()) { setError("Please enter your email address."); return; }
    /* Email format guard */
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!phone.trim()) { setError("Please enter your phone number."); return; }
    /* Phone: must be 7–15 digits (with optional spaces/dashes/+) */
    if (!/^[\d\s+\-().]{7,20}$/.test(phone.trim())) {
      setError("Please enter a valid phone number.");
      return;
    }
    setError("");
    setIsSending(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          data: { full_name: name.trim(), phone: phone.trim() },
        },
      });
      if (error) {
        setError(error.message);
      } else {
        setOtp("");
        startCooldown();
        setView("otp_signup");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to send OTP.");
    } finally {
      setIsSending(false);
    }
  };

  /**
   * RESEND — re-fires the correct OTP handler for the current view
   * and restarts the 60 s cooldown.
   */
  const handleResend = async () => {
    if (view === "otp_login") {
      await handleLogin();
    } else {
      await handleSignup();
    }
  };

  /** Verify OTP — logic unchanged from previous version */
  const handleVerifyOtp = async () => {
    if (otp.length < 6) return;
    setError("");
    setIsVerifying(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type:  "email",
      });
      if (error) {
        setError(error.message);
      } else {
        handleClose();
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Verification failed.");
    } finally {
      setIsVerifying(false);
    }
  };

  /** Reset everything and close */
  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setView("login");
      setEmail("");
      setOtp("");
      setName("");
      setPhone("");
      setError("");
    }, 300);
  };

  /** Navigate back, preserving email */
  const goBack = (to: View) => {
    setOtp("");
    setError("");
    setView(to);
  };

  /* ─── Derive modal title per view ────────────────────────────────────── */
  const TITLES: Record<View, string> = {
    login:     "Log in to JSS STEP",
    signup:    "Create an Account",
    otp_login: "Check your inbox",
    otp_signup:"Check your inbox",
  };

  /* ─── Slide direction per transition ─────────────────────────────────── */
  const SLIDE: Record<View, number> = {
    login:     0,
    signup:    1,
    otp_login: 1,
    otp_signup:1,
  };
  const slideX = (v: View) => SLIDE[v] * 20;

  /* ─── OTP view shared markup ─────────────────────────────────────────── */
  const renderOtpView = (backTo: View) => (
    <motion.div
      key={view}
      initial={{ opacity: 0, x: slideX(view) }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -slideX(view) }}
      transition={{ duration: 0.18 }}
      className="space-y-4"
    >
      <BackRow
        label="Back"
        onClick={() => goBack(backTo)}
      />

      {/* Description */}
      <p className="text-sm text-slate-600 leading-relaxed -mt-2">
        We sent a 6-digit code to{" "}
        <span className="font-semibold text-slate-900">{email}</span>.
        <br />
        <span className="text-slate-400 text-xs">
          Check your spam folder if you don&apos;t see it.
        </span>
      </p>

      {/* OTP input */}
      <div className="space-y-1.5">
        <label
          htmlFor="modal-otp"
          className="block text-sm font-medium text-slate-700"
        >
          One-time password
        </label>
        <input
          id="modal-otp"
          type="text"
          inputMode="numeric"
          maxLength={6}
          autoComplete="one-time-code"
          autoFocus
          placeholder="000000"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          onKeyDown={(e) => e.key === "Enter" && handleVerifyOtp()}
          className="w-full px-4 py-3 rounded-xl border border-slate-200
                     text-sm text-slate-900 bg-white
                     placeholder:text-slate-400
                     tracking-[0.4em] text-center font-mono text-lg
                     focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent
                     transition-shadow"
        />
      </div>

      <ErrorMsg message={error} />

      <PrimaryBtn
        onClick={handleVerifyOtp}
        disabled={otp.length < 6}
        loading={isVerifying}
        loadingLabel="Verifying…"
      >
        Verify &amp; Continue
      </PrimaryBtn>

      {/* Resend cooldown */}
      <p className="text-center text-xs text-slate-400">
        {cooldown > 0 ? (
          <>Resend code in{" "}<span className="font-semibold text-slate-600 tabular-nums">{cooldown}s</span></>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            disabled={isSending}
            className="font-semibold text-cyan-600 hover:text-cyan-700
                       disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Resend code
          </button>
        )}
      </p>
    </motion.div>
  );

  /* ─── Render ─────────────────────────────────────────────────────────── */
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/*
           * BACKDROP + CENTERING CONTAINER
           * fixed top-0 left-0 w-full h-[100dvh] — iOS Safari compatible.
           * z-[99999] — sits above Navbar (z-50) and all page content.
           */}
          <motion.div
            key="login-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed top-0 left-0 w-full h-[100dvh] z-[99999]
                       flex items-center justify-center p-4
                       bg-slate-900/80 backdrop-blur-sm"
            onClick={handleClose}
            aria-hidden="true"
          >
            {/* MODAL CARD */}
            <motion.div
              key="login-card"
              role="dialog"
              aria-modal="true"
              aria-labelledby="login-modal-title"
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1,    y: 0  }}
              exit={{    opacity: 0, scale: 0.94, y: 16  }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl pointer-events-auto"
            >
              {/* ── Close button ── */}
              <button
                onClick={handleClose}
                aria-label="Close modal"
                className="absolute top-4 right-4 p-2 rounded-full text-slate-400
                           hover:text-slate-700 hover:bg-slate-100
                           transition-colors duration-150 z-10"
              >
                <X size={18} />
              </button>

              {/* ── Inner content ── */}
              <div className="px-8 pt-8 pb-6">

                {/* Title */}
                <h2
                  id="login-modal-title"
                  className="text-xl sm:text-2xl font-bold text-slate-900 mb-6"
                >
                  {TITLES[view]}
                </h2>

                {/* ── Animated view region ── */}
                <AnimatePresence mode="wait">

                  {/* ════════════════════════════════════ */}
                  {/* VIEW: login                         */}
                  {/* ════════════════════════════════════ */}
                  {view === "login" && (
                    <motion.div
                      key="login"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.18 }}
                      className="space-y-4"
                    >
                      <Field
                        id="login-email"
                        label="Email address"
                        type="email"
                        value={email}
                        placeholder="you@example.com"
                        autoFocus
                        autoComplete="email"
                        onChange={setEmail}
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleLogin()
                        }
                      />

                      <ErrorMsg message={error} />

                      <PrimaryBtn
                        onClick={handleLogin}
                        disabled={!email.trim()}
                        loading={isSending}
                        loadingLabel="Sending…"
                      >
                        Log in
                        <ChevronRight size={15} />
                      </PrimaryBtn>

                      <Divider />

                      <SecondaryBtn onClick={() => { setError(""); setView("signup"); }}>
                        Create new account
                      </SecondaryBtn>
                    </motion.div>
                  )}

                  {/* ════════════════════════════════════ */}
                  {/* VIEW: signup                        */}
                  {/* ════════════════════════════════════ */}
                  {view === "signup" && (
                    <motion.div
                      key="signup"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.18 }}
                      className="space-y-4"
                    >
                      <BackRow
                        label="Back to login"
                        onClick={() => goBack("login")}
                      />

                      <Field
                        id="signup-name"
                        label="Full Name"
                        value={name}
                        placeholder="Enter your full name"
                        autoFocus
                        autoComplete="name"
                        maxLength={100}
                        onChange={setName}
                      />
                      <Field
                        id="signup-email"
                        label="Email address"
                        type="email"
                        value={email}
                        placeholder="Enter your email"
                        autoComplete="email"
                        onChange={setEmail}
                      />

                      <Field
                        id="signup-phone"
                        label="Phone Number"
                        type="tel"
                        value={phone}
                        placeholder="Enter phone no."
                        autoComplete="tel"
                        maxLength={20}
                        onChange={setPhone}
                      />

                      <ErrorMsg message={error} />

                      <PrimaryBtn
                        onClick={handleSignup}
                        disabled={!name.trim() || !email.trim() || !phone.trim()}
                        loading={isSending}
                        loadingLabel="Sending…"
                      >
                        Continue
                        <ChevronRight size={15} />
                      </PrimaryBtn>
                    </motion.div>
                  )}

                  {/* ════════════════════════════════════ */}
                  {/* VIEW: otp_login                     */}
                  {/* ════════════════════════════════════ */}
                  {view === "otp_login"  && renderOtpView("login")}

                  {/* ════════════════════════════════════ */}
                  {/* VIEW: otp_signup                    */}
                  {/* ════════════════════════════════════ */}
                  {view === "otp_signup" && renderOtpView("signup")}

                </AnimatePresence>
              </div>

              {/* ── Footer ── */}
              <div className="border-t border-slate-100 px-8 py-4">
                <p className="text-center text-xs text-slate-400">
                  By continuing, you agree to JSS STEP&apos;s{" "}
                  <Link
                    href="/resources"
                    className="underline hover:text-cyan-600 transition-colors"
                    onClick={handleClose}
                  >
                    Terms
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/resources"
                    className="underline hover:text-cyan-600 transition-colors"
                    onClick={handleClose}
                  >
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
