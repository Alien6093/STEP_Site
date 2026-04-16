"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote } from "lucide-react";
import SectionHeading from "@/components/shared/SectionHeading";
import ScrollFadeIn from "@/components/shared/ScrollFadeIn";

/* ─── Data ───────────────────────────────────────────────────────────── */

const QUOTES = [
  {
    quote:
      "JSS STEP gave us not just funding, but a launchpad. The mentorship from IIT alumni and access to world-class labs accelerated our prototype by 6 months.",
    name: "Arjun Mehta",
    startup: "NovaBio Diagnostics",
    role: "Co-Founder & CEO",
    avatar: "AM",
  },
  {
    quote:
      "The incubator's network opened doors we couldn't have imagined — from NIDHI grants to our first enterprise client in the NCR tech corridor.",
    name: "Priya Sharma",
    startup: "FabriSense IoT",
    role: "Founder",
    avatar: "PS",
  },
  {
    quote:
      "Beyond capital, JSS STEP's IP and legal support saved us months of compliance work. We could focus entirely on building our product.",
    name: "Rahul Verma",
    startup: "Aethon Robotics",
    role: "CTO & Co-Founder",
    avatar: "RV",
  },
];

/* ─── Card ───────────────────────────────────────────────────────────── */

function TestimonialCard({
  quote,
  name,
  startup,
  role,
  avatar,
}: (typeof QUOTES)[0]) {
  return (
    <div
      className="relative bg-white rounded-2xl border border-slate-100 p-8
                 shadow-sm hover:shadow-xl hover:shadow-slate-200/60
                 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
    >
      {/* Faint decorative quote mark */}
      <Quote
        size={80}
        className="absolute -top-2 -right-2 text-slate-100 pointer-events-none"
        aria-hidden
      />

      {/* Quote text */}
      <blockquote className="relative z-10 text-sm text-slate-600 leading-relaxed mb-6">
        &ldquo;{quote}&rdquo;
      </blockquote>

      {/* Author */}
      <div className="flex items-center gap-3">
        {/* Avatar initials */}
        <div
          className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-violet-500
                     flex items-center justify-center shrink-0"
        >
          <span className="text-xs font-bold text-white">{avatar}</span>
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-900">{name}</p>
          <p className="text-xs text-slate-500">
            {role} · {startup}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── Section ────────────────────────────────────────────────────────── */

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="py-24 bg-white" aria-labelledby="testimonials-heading">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">

        <ScrollFadeIn>
          <SectionHeading
            label="Testimonials"
            title={<span id="testimonials-heading">What Our Founders Say</span>}
            align="center"
            className="mb-14"
          />
        </ScrollFadeIn>

        {/* Desktop Carousel Layout */}
        <div className="hidden md:grid md:grid-cols-3 gap-6">
          {QUOTES.map((q, i) => (
            <ScrollFadeIn key={q.name} delay={i * 0.1}>
              <TestimonialCard {...q} />
            </ScrollFadeIn>
          ))}
        </div>

        {/* Mobile Carousel Layout */}
        <div className="md:hidden flex flex-col items-center">
          <div className="w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <TestimonialCard {...QUOTES[activeIndex]} />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dot Navigation */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {QUOTES.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                aria-label={`Go to testimonial ${i + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === activeIndex ? "w-6 bg-cyan-400" : "w-2 bg-slate-600"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
