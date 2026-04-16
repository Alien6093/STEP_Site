"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import SectionHeading from "@/components/shared/SectionHeading";
import ScrollFadeIn from "@/components/shared/ScrollFadeIn";

/* ─── Data ───────────────────────────────────────────────────────────── */

const FAQS = [
  {
    q: "Is JSS STEP only for JSS Noida students?",
    a: "No, our core incubation and NIDHI programs are open to external deep-tech founders from across India.",
  },
  {
    q: "How much funding can I raise?",
    a: "Eligible startups can raise up to ₹50 Lakhs through NIDHI PRAYAS and Start In UP schemes.",
  },
  {
    q: "What is the equity model?",
    a: "We operate on a standard, founder-friendly equity model (typically 2–6%) depending on the stage and support required.",
  },
  {
    q: "Do I need a registered company to apply?",
    a: "You can apply with an idea, but you will need to incorporate a Private Limited Company or LLP to receive seed funding.",
  },
] as const;

/* ─── Accordion Item ─────────────────────────────────────────────────── */

function FAQItem({
  q,
  a,
  isOpen,
  onToggle,
}: {
  q: string;
  a: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden
                    hover:border-slate-200 transition-colors duration-200">
      <button
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left
                   group focus-visible:outline-none focus-visible:ring-2
                   focus-visible:ring-cyan-500 focus-visible:ring-offset-2"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span className="text-sm font-semibold text-slate-900 group-hover:text-cyan-600
                         transition-colors duration-200">
          {q}
        </span>
        <ChevronDown
          size={18}
          className={`flex-shrink-0 text-slate-400 transition-transform duration-300
                      ${isOpen ? "rotate-180 text-cyan-500" : ""}`}
        />
      </button>

      {/* Animated answer panel */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out
                    ${isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <p className="px-6 pb-5 text-sm text-slate-500 leading-relaxed">{a}</p>
      </div>
    </div>
  );
}

/* ─── Section ────────────────────────────────────────────────────────── */

export default function ProgramFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) =>
    setOpenIndex((prev) => (prev === i ? null : i));

  return (
    <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-slate-50" aria-labelledby="faq-heading">
      <div className="max-w-3xl mx-auto">

        <ScrollFadeIn>
          <SectionHeading
            label="FAQ"
            title={<span id="faq-heading">Frequently Asked Questions</span>}
            align="center"
            className="mb-12"
          />
        </ScrollFadeIn>

        <div className="flex flex-col gap-3">
          {FAQS.map((faq, i) => (
            <ScrollFadeIn key={faq.q} delay={i * 0.07}>
              <FAQItem
                q={faq.q}
                a={faq.a}
                isOpen={openIndex === i}
                onToggle={() => toggle(i)}
              />
            </ScrollFadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
