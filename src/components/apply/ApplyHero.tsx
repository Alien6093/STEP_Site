"use client";

import { motion } from "framer-motion";
import { FileText, Search, Users, Rocket, ChevronRight, Home } from "lucide-react";
import Link from "next/link";

/* ─── Process steps ──────────────────────────────────────────────────── */

const STEPS = [
  { icon: FileText, label: "Submit Application", step: "01" },
  { icon: Search,   label: "Screening",          step: "02" },
  { icon: Users,    label: "Interview",           step: "03" },
  { icon: Rocket,   label: "Onboarding",          step: "04" },
] as const;

/* ─── Stagger variants ───────────────────────────────────────────────── */

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.13, delayChildren: 0.2 } },
};
const item = {
  hidden:  { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] as const } },
};

/* ─── Component ──────────────────────────────────────────────────────── */

export default function ApplyHero() {
  return (
    <section
      className="relative pt-32 pb-24 bg-slate-900 text-white text-center overflow-hidden"
      aria-label="Apply hero"
    >
      {/* Ambient orbs */}
      <div className="absolute w-[420px] h-[420px] rounded-full bg-cyan-500/10
                      blur-[110px] -top-24 -left-20 pointer-events-none" />
      <div className="absolute w-[320px] h-[320px] rounded-full bg-violet-500/10
                      blur-[100px] bottom-0 right-0 pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-8">
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center gap-6"
        >
          {/* Breadcrumb */}
          <motion.nav variants={item} aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-sm font-medium text-slate-400">
            <Link href="/" className="flex items-center gap-1 hover:text-white transition-colors">
              <Home size={13} />Home
            </Link>
            <ChevronRight size={13} className="text-slate-600" />
            <span className="text-slate-300">Apply</span>
          </motion.nav>

          {/* Eyebrow */}
          <motion.span variants={item}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border
                       border-cyan-500/30 bg-cyan-500/10 text-cyan-400
                       text-xs font-semibold tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            2025–26 Cohort · Applications Open
          </motion.span>

          {/* Headline */}
          <motion.h1 variants={item}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tighter
                       text-white leading-[1.06]">
            Start Your Journey{" "}
            <span className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(90deg, #06B6D4 0%, #8B5CF6 100%)" }}>
              with JSS STEP
            </span>
          </motion.h1>

          {/* Sub-headline */}
          <motion.p variants={item}
            className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl">
            Applications are now open for the 2025–26 cohort. Submit your details
            below and our screening committee will be in touch within 7–10 business days.
          </motion.p>

          {/* Process steps visual */}
          <motion.div variants={item} className="w-full mt-6">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-0">
              {STEPS.map(({ icon: Icon, label, step }, i) => (
                <div key={step} className="flex flex-row sm:flex-col md:flex-row items-center flex-1 min-w-0">
                  {/* Step node */}
                  <div className="flex flex-col items-center text-center gap-2.5 flex-shrink-0 px-2 sm:px-4">
                    <div className="flex items-center justify-center w-14 h-14 rounded-full
                                    bg-slate-800 border border-slate-700 text-cyan-400
                                    hover:bg-slate-700 hover:border-cyan-500/40
                                    transition-all duration-300">
                      <Icon size={22} strokeWidth={1.75} />
                    </div>
                    <span className="text-xs font-medium text-slate-400 whitespace-nowrap">{label}</span>
                  </div>

                  {/* Connector line — between items, desktop only */}
                  {i < STEPS.length - 1 && (
                    <div className="hidden sm:flex flex-1 border-t border-dashed
                                    border-slate-700 self-start mt-7 mx-1" aria-hidden />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
