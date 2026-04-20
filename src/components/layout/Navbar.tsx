"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Menu, X, LogIn, User, Calendar, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useScrollPosition } from "@/hooks/useScrollPosition";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import LoginModal from "@/components/auth/LoginModal";
import UserDropdown from "@/components/auth/UserDropdown";

/* ─── Nav data ────────────────────────────────────────────────────────── */

interface NavItem { label: string; href: string; }

const ABOUT_ITEMS: NavItem[] = [
  { label: "Team", href: "/about#team" },
  { label: "Mentors", href: "/mentors" },
  { label: "Facilities", href: "/about#facilities" },
];

const ECOSYSTEM_ITEMS: NavItem[] = [
  { label: "Startups", href: "/portfolio" },
  { label: "Investors", href: "/ecosystem/investors" },
  { label: "Corporates", href: "/ecosystem/corporates" },
  { label: "Partners", href: "/ecosystem/partners" },
];

/* ─────────────────────────────────────────────────────────────────────── */
/* Desktop Dropdown                                                        */
/* ─────────────────────────────────────────────────────────────────────── */

function DesktopDropdown({ label, items }: { label: string; items: NavItem[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  /* Close on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* Trigger */}
      <button
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 py-2 text-sm font-medium
                   text-slate-700 hover:text-cyan-600 transition-colors duration-200"
      >
        {label}
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 min-w-[180px]
                       bg-white rounded-xl shadow-lg shadow-slate-200/80
                       border border-slate-100 py-1.5 z-50"
          >
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block px-4 py-2.5 text-sm text-slate-600
                           hover:text-cyan-600 hover:bg-cyan-50
                           transition-colors duration-150"
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

/* ─────────────────────────────────────────────────────────────────────── */
/* Mobile Accordion Item                                                   */
/* ─────────────────────────────────────────────────────────────────────── */

function MobileAccordion({
  label,
  items,
  onLinkClick,
}: {
  label: string;
  items: NavItem[];
  onLinkClick: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-slate-100">
      {/* Accordion trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-between w-full
                   py-4 px-6 text-lg font-medium text-slate-800
                   hover:text-cyan-600 transition-colors text-left"
      >
        {label}
        <ChevronDown
          size={18}
          className={`text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Sub-links — push-down */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="accordion-body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pb-2">
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onLinkClick}
                  className="block py-3 pl-10 pr-6 text-base text-slate-500
                             hover:text-cyan-600 transition-colors duration-150"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────── */
/* Navbar                                                                  */
/* ─────────────────────────────────────────────────────────────────────── */

export default function Navbar() {
  const router = useRouter();
  /* Memoize so supabase identity is stable (safe useCallback dep) */
  const supabase = useMemo(() => createClient(), []);

  const scrollY = useScrollPosition();
  const scrolled = scrollY > 20;

  const [mobileOpen, setMobileOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  const handleSignOut = useCallback(async () => {
    closeMobile();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }, [supabase, router, closeMobile]);

  /* ── Sync auth state on mount and on session changes ── */
  useEffect(() => {
    /* Set initial state from current session */
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
      setUser(session?.user ?? null);
    });

    /* Keep state in sync: login, logout, token refresh etc. */
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setIsAuthenticated(!!session);
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase]);

  return (
    <>
      {/* ── Header ─────────────────────────────────────────────────────── */}
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
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:pl-8 lg:pr-4
                        flex items-center justify-between w-full h-16 md:h-[72px]">

          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0 overflow-hidden">
            <div className="relative w-48 h-10">
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

          {/* ── Desktop nav — centred absolutely ── */}
          <nav
            aria-label="Main navigation"
            className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-x-8"
          >
            {/* Home */}
            <Link
              href="/"
              className="flex items-center py-2 text-sm font-medium text-slate-700 hover:text-cyan-600 transition-colors duration-200"
            >
              Home
            </Link>

            {/* About ↓ */}
            <DesktopDropdown label="About" items={ABOUT_ITEMS} />

            {/* Ecosystem ↓ */}
            <DesktopDropdown label="Ecosystem" items={ECOSYSTEM_ITEMS} />

            {/* Programs */}
            <Link
              href="/programs"
              className="flex items-center py-2 text-sm font-medium text-slate-700 hover:text-cyan-600 transition-colors duration-200"
            >
              Programs
            </Link>

            {/* Portfolio */}
            <Link
              href="/portfolio"
              className="flex items-center py-2 text-sm font-medium text-slate-700 hover:text-cyan-600 transition-colors duration-200"
            >
              Portfolio
            </Link>
          </nav>

          {/* ── Right side: Apply Now → Auth → Hamburger ── */}
          <div className="flex items-center gap-4 shrink-0">

            {/* Apply Now pill — comes FIRST on desktop */}
            <Link
              href="/apply"
              className="hidden md:inline-flex items-center bg-slate-900 text-white font-medium
                         text-sm px-4 py-2 rounded-full hover:bg-cyan-600 hover:shadow-md
                         transition-all duration-300 hover:-translate-y-0.5 transform"
            >
              Apply Now
            </Link>

            {/* Desktop auth — comes AFTER Apply Now */}
            <div className="hidden md:flex items-center">
              {isAuthenticated ? (
                <UserDropdown user={user} />
              ) : (
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium
                             text-slate-700 border border-slate-200
                             hover:border-cyan-400 hover:text-cyan-600 hover:bg-cyan-50
                             transition-all duration-200"
                >
                  <LogIn size={15} />
                  Register
                </button>
              )}
            </div>

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

      {/* ── Mobile full-screen overlay ──────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
            className="fixed inset-0 z-[200] overflow-y-auto
                       bg-white/95 backdrop-blur-md
                       flex flex-col pt-20 pb-10"
          >
            {/* Close button */}
            <button
              onClick={closeMobile}
              className="absolute top-5 right-4 sm:right-6 p-2 rounded-full
                         bg-slate-100 text-slate-800 hover:bg-slate-200 transition-colors"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>

            <nav className="flex flex-col">
              {/* Home */}
              <Link
                href="/"
                onClick={closeMobile}
                className="py-4 px-6 text-lg font-medium text-slate-800
                           hover:text-cyan-600 transition-colors border-b border-slate-100"
              >
                Home
              </Link>

              {/* About — accordion */}
              <MobileAccordion
                label="About"
                items={ABOUT_ITEMS}
                onLinkClick={closeMobile}
              />

              {/* Ecosystem — accordion */}
              <MobileAccordion
                label="Ecosystem"
                items={ECOSYSTEM_ITEMS}
                onLinkClick={closeMobile}
              />

              {/* Programs */}
              <Link
                href="/programs"
                onClick={closeMobile}
                className="py-4 px-6 text-lg font-medium text-slate-800
                           hover:text-cyan-600 transition-colors border-b border-slate-100"
              >
                Programs
              </Link>

              {/* Portfolio */}
              <Link
                href="/portfolio"
                onClick={closeMobile}
                className="py-4 px-6 text-lg font-medium text-slate-800
                           hover:text-cyan-600 transition-colors border-b border-slate-100"
              >
                Portfolio
              </Link>


              {/* Auth */}
              {!isAuthenticated ? (
                <button
                  onClick={() => { closeMobile(); setIsLoginModalOpen(true); }}
                  className="flex items-center gap-2 py-4 px-6 text-lg font-medium
                             text-slate-800 hover:text-cyan-600 transition-colors
                             border-b border-slate-100 text-left"
                >
                  <LogIn size={18} />
                  Login / Sign Up
                </button>
              ) : (
                <>
                  <Link
                    href="/dashboard/profile"
                    onClick={closeMobile}
                    className="flex items-center gap-2 py-4 px-6 text-lg font-medium
                               text-slate-800 hover:text-cyan-600 transition-colors border-b border-slate-100"
                  >
                    <User size={18} />
                    Profile
                  </Link>
                  <Link
                    href="/dashboard/bookings"
                    onClick={closeMobile}
                    className="flex items-center gap-2 py-4 px-6 text-lg font-medium
                               text-slate-800 hover:text-cyan-600 transition-colors border-b border-slate-100"
                  >
                    <Calendar size={18} />
                    My Bookings
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 py-4 px-6 text-lg font-medium
                               text-red-500 hover:text-red-600 transition-colors
                               border-b border-slate-100 text-left w-full"
                  >
                    <LogOut size={18} />
                    Log Out
                  </button>
                </>
              )}
            </nav>

            {/* Apply Now CTA */}
            <Link
              href="/apply"
              onClick={closeMobile}
              className="mx-4 mt-8 inline-flex justify-center items-center
                         bg-slate-900 text-white font-medium text-base
                         px-5 py-3 rounded-full hover:bg-cyan-600
                         transition-all duration-300"
            >
              Apply Now
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/*
       * LoginModal rendered OUTSIDE <motion.header>.
       * Reason: motion.header applies CSS transform on mount (translateY).
       * Any position:fixed child inside a transform-animated ancestor is
       * clipped to that ancestor — not the viewport. Placing LoginModal here
       * at the fragment root ensures it always covers the full screen.
       */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  );
}
