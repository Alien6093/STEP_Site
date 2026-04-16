"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

/* ─── Floating orb definitions ───────────────────────────────────────── */

const ORBS = [
  {
    id: "orb-cyan",
    className: "w-[600px] h-[600px] bg-cyan-500/20 top-[-15%] left-[-10%]",
    animate: { x: [0, 60, -30, 0], y: [0, 40, -20, 0] },
    duration: 22,
  },
  {
    id: "orb-purple",
    className: "w-[500px] h-[500px] bg-violet-600/20 top-[10%] right-[-8%]",
    animate: { x: [0, -50, 20, 0], y: [0, 60, -40, 0] },
    duration: 28,
  },
  {
    id: "orb-blue",
    className: "w-[420px] h-[420px] bg-blue-600/15 bottom-[-10%] left-[20%]",
    animate: { x: [0, 40, -60, 0], y: [0, -30, 50, 0] },
    duration: 35,
  },
  {
    id: "orb-teal",
    className: "w-[300px] h-[300px] bg-teal-400/10 bottom-[15%] right-[15%]",
    animate: { x: [0, -30, 40, 0], y: [0, 50, -20, 0] },
    duration: 20,
  },
];

/* ─── Stagger variants ───────────────────────────────────────────────── */

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.3 } },
};

const itemVariants = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } },
};

/* ─── Component ──────────────────────────────────────────────────────── */

export default function Hero() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => { setIsMobile(window.innerWidth < 768); }, []);

  return (
    <section
      className="relative min-h-[100dvh] overflow-hidden bg-[#0F172A] flex items-center justify-center"
      aria-label="Hero"
    >
      {/* ── Animated background orbs ── */}
      {(isMobile ? ORBS.slice(0, 2) : ORBS).map((orb) => (
        <motion.div
          key={orb.id}
          className={`absolute rounded-full blur-[120px] pointer-events-none ${orb.className}`}
          animate={orb.animate}
          transition={{ duration: orb.duration, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      {/* ── Subtle grid overlay ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* ── Main content ── */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center gap-6"
        >
          {/* Eyebrow badge */}
          <motion.div variants={itemVariants}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30
                             bg-cyan-500/10 text-cyan-400 text-xs font-semibold tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              DST-Recognised Incubator · NIDHI Supported
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tighter
                       text-white leading-[1.05] max-w-4xl"
          >
            Empowering Deep-Tech Innovations for{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: "linear-gradient(90deg, #06B6D4 0%, #3B82F6 100%)",
              }}
            >
              Global Impact
            </span>
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg lg:text-xl text-slate-300 leading-relaxed max-w-2xl"
          >
            JSS STEP is JSS&nbsp;Noida's DST-recognised Technology Business Incubator —
            funding, mentoring, and launching the next generation of deep-tech startups.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center w-full sm:w-auto gap-4 mt-2"
          >
            <Link
              href="/apply"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full w-full sm:w-auto
                         bg-cyan-500 hover:bg-cyan-400 text-white font-semibold text-sm
                         shadow-lg shadow-cyan-500/30 hover:shadow-cyan-400/40
                         transition-all duration-300 transform hover:-translate-y-0.5"
            >
              Apply for Incubation
            </Link>

            <Link
              href="/portfolio"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full w-full sm:w-auto
                         border border-white/25 text-white font-semibold text-sm
                         hover:bg-white/10 hover:border-white/40
                         transition-all duration-300 transform hover:-translate-y-0.5"
            >
              Explore Portfolio
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* ── Scroll indicator ── */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex-col items-center gap-1 hidden sm:flex">
        <span className="text-xs text-slate-500 tracking-widest uppercase">Scroll</span>
        <ChevronDown size={20} className="text-slate-400 animate-bounce" />
      </div>
    </section>
  );
}
