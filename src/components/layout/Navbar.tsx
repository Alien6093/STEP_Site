"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useScrollPosition } from "@/hooks/useScrollPosition";

/* ─── Nav data ────────────────────────────────────────────────────────── */

const ABOUT_ITEMS = [
  { label: "Mission & Vision", href: "/about#mission" },
  { label: "The Team",         href: "/about#team" },
  { label: "Infrastructure",   href: "/about#infrastructure" },
];

const PROGRAMS_ITEMS = [
  { label: "Pre-Incubation", href: "/programs#pre-incubation" },
  { label: "Incubation",     href: "/programs#incubation" },
  { label: "Acceleration",   href: "/programs#acceleration" },
];

interface NavDropdownItem { label: string; href: string; }

/* ─── Dropdown component ──────────────────────────────────────────────── */

function Dropdown({
  label,
  items,
  scrolled,
}: {
  label: string;
  items: NavDropdownItem[];
  scrolled: boolean;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  /* Close on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        className={`flex items-center gap-1 py-2 text-sm font-medium transition-colors duration-200
          ${scrolled ? "text-slate-700 hover:text-cyan-600" : "text-slate-700 hover:text-cyan-600"}`}
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {label}
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-52 bg-white rounded-xl
                       shadow-lg shadow-slate-200/80 border border-slate-100 py-2 z-50"
          >
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block px-4 py-2.5 text-sm text-slate-600 hover:text-cyan-600
                           hover:bg-cyan-50 transition-colors duration-150"
              >
                {item.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Navbar ──────────────────────────────────────────────────────────── */

export default function Navbar() {
  const scrollY = useScrollPosition();
  const scrolled = scrollY > 20;
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
          ${scrolled
            ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-100"
            : "bg-transparent"
          }`}
      >
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between w-full h-16 md:h-[72px]">

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center shrink-0">
            <div className="relative w-52 h-14">
              <Image
                src="/jss-step-logo.jpg"
                alt="JSS STEP Logo"
                fill
                sizes="(max-width: 768px) 100vw, 208px"
                className="object-contain mix-blend-multiply"
                priority
              />
            </div>
          </Link>

          {/* ── Desktop Nav — absolutely pinned to exact center ── */}
          <nav
            className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-7"
            aria-label="Main navigation"
          >
            <Link
              href="/"
              className="flex items-center py-2 text-sm font-medium text-slate-700 hover:text-cyan-600 transition-colors duration-200"
            >
              Home
            </Link>

            <Dropdown label="About"    items={ABOUT_ITEMS}    scrolled={scrolled} />
            <Dropdown label="Programs" items={PROGRAMS_ITEMS} scrolled={scrolled} />

            <Link
              href="/portfolio"
              className="flex items-center py-2 text-sm font-medium text-slate-700 hover:text-cyan-600 transition-colors duration-200"
            >
              Portfolio
            </Link>
            <Link
              href="/events"
              className="flex items-center py-2 text-sm font-medium text-slate-700 hover:text-cyan-600 transition-colors duration-200"
            >
              Events
            </Link>
            <Link
              href="/resources"
              className="flex items-center py-2 text-sm font-medium text-slate-700 hover:text-cyan-600 transition-colors duration-200"
            >
              Resources
            </Link>
          </nav>

          {/* ── CTA + Hamburger ── */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/apply"
              className="hidden md:inline-flex items-center bg-slate-900 text-white font-medium
                         text-sm px-4 py-2 md:text-base md:px-5 md:py-2.5 rounded-full hover:bg-cyan-600 hover:shadow-md transition-all
                         duration-300 transform hover:-translate-y-0.5"
            >
              Apply Now
            </Link>

            {/* Hamburger — mobile only */}
            <button
              className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* ── Mobile Full-Screen Overlay ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-50 overflow-y-auto bg-white/95 backdrop-blur-md flex flex-col pt-20 px-4 sm:px-6 pb-10"
          >
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-5 right-4 sm:right-6 p-2 rounded-full bg-slate-100 text-slate-800 hover:bg-slate-200 transition-colors"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
            <nav className="flex flex-col gap-2">
              {[
                { label: "Home",      href: "/" },
                { label: "About",     href: "/about" },
                { label: "Programs",  href: "/programs" },
                { label: "Portfolio", href: "/portfolio" },
                { label: "Events",    href: "/events" },
                { label: "Resources", href: "/resources" },
              ].map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className="py-4 px-6 text-lg font-medium block text-slate-800 hover:text-cyan-600 transition-colors border-b border-slate-100"
                >
                  {label}
                </Link>
              ))}
            </nav>

            <Link
              href="/apply"
              onClick={() => setMobileOpen(false)}
              className="mt-10 inline-flex justify-center items-center bg-slate-900 text-white
                         font-medium text-sm px-4 py-2 md:text-base md:px-5 md:py-2.5 rounded-full hover:bg-cyan-600
                         transition-all duration-300"
            >
              Apply Now
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
