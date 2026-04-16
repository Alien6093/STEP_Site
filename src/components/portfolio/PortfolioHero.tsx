"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, Home, TrendingUp, Users, Banknote } from "lucide-react";

/* ─── Stagger variants ───────────────────────────────────────────────── */

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.13, delayChildren: 0.2 } },
};
const item = {
  hidden:  { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] as const } },
};

/* ─── Quick stats ────────────────────────────────────────────────────── */

const STATS = [
  { icon: Users,      value: "300+",  label: "Incubated" },
  { icon: TrendingUp, value: "11+",   label: "Exits" },
  { icon: Banknote,   value: "₹50L+", label: "Seed Funding" },
] as const;

/* ─── Component ──────────────────────────────────────────────────────── */

export default function PortfolioHero() {
  return (
    <section
      className="relative pt-32 pb-20 bg-slate-900 text-white text-center overflow-hidden"
      aria-label="Portfolio hero"
    >
      {/* Ambient orbs */}
      <div className="absolute w-[400px] h-[400px] rounded-full bg-cyan-500/10
                      blur-[100px] -top-20 -left-16 pointer-events-none" />
      <div className="absolute w-[300px] h-[300px] rounded-full bg-violet-500/10
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
            <Link href="/"
              className="flex items-center gap-1 hover:text-white transition-colors">
              <Home size={13} />Home
            </Link>
            <ChevronRight size={13} className="text-slate-600" />
            <span className="text-slate-300">Portfolio</span>
          </motion.nav>

          {/* Eyebrow */}
          <motion.span variants={item}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border
                       border-cyan-500/30 bg-cyan-500/10 text-cyan-400
                       text-xs font-semibold tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            300+ Startups Launched
          </motion.span>

          {/* Headline */}
          <motion.h1 variants={item}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tighter
                       text-white leading-[1.06]">
            Our Startup{" "}
            <span className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(90deg, #06B6D4 0%, #8B5CF6 100%)" }}>
              Portfolio
            </span>
          </motion.h1>

          {/* Sub-headline */}
          <motion.p variants={item}
            className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl">
            Discover the 300+ visionary companies that began their journey at JSS&nbsp;STEP
            and are now making a global impact.
          </motion.p>

          {/* Stats row */}
          <motion.div variants={item}
            className="flex items-center gap-6 flex-wrap justify-center mt-2">
            {STATS.map(({ icon: Icon, value, label }, i) => (
              <div key={label} className="flex items-center gap-2">
                {i > 0 && (
                  <span className="hidden sm:block w-px h-4 bg-slate-700" aria-hidden />
                )}
                <Icon size={14} className="text-cyan-400" />
                <span className="text-sm font-bold text-white">{value}</span>
                <span className="text-sm text-slate-400">{label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
