"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, Home } from "lucide-react";

/* ─── Stagger variants ───────────────────────────────────────────────── */

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14, delayChildren: 0.2 } },
};

const itemVariants = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] as const } },
};

/* ─── Component ──────────────────────────────────────────────────────── */

export default function ProgramHero() {
  return (
    <section
      className="relative pt-32 pb-20 bg-slate-900 text-white text-center overflow-hidden"
      aria-label="Programs hero"
    >
      {/* Subtle blurred orbs */}
      <div className="absolute w-[400px] h-[400px] rounded-full bg-cyan-500/10
                      blur-[100px] top-[-100px] left-[-80px] pointer-events-none" />
      <div className="absolute w-[300px] h-[300px] rounded-full bg-violet-500/10
                      blur-[100px] bottom-[-60px] right-[-60px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center gap-5"
        >
          {/* Breadcrumb */}
          <motion.nav
            variants={itemVariants}
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-sm font-medium text-slate-400"
          >
            <Link href="/" className="flex items-center gap-1 hover:text-white transition-colors">
              <Home size={13} />
              Home
            </Link>
            <ChevronRight size={13} className="text-slate-600" />
            <span className="text-slate-300">Programs</span>
          </motion.nav>

          {/* Eyebrow */}
          <motion.span
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border
                       border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-semibold
                       tracking-widest uppercase"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            DST · NIDHI · Start In UP
          </motion.span>

          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tighter
                       text-white leading-[1.06]"
          >
            Programs Built for{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(90deg, #06B6D4 0%, #8B5CF6 100%)" }}
            >
              Every Stage
            </span>
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl"
          >
            Whether you have a rough idea or a revenue-generating startup, JSS&nbsp;STEP
            provides the funding, labs, and mentorship to scale your vision.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
