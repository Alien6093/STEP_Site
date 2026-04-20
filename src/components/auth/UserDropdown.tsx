"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { User, Calendar, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

/* ─── Props ─────────────────────────────────────────────────────────────── */

interface UserDropdownProps {
  user: SupabaseUser | null;
}

/* ─── Helpers ────────────────────────────────────────────────────────────── */

/**
 * Derive up to 2 uppercase initials from a display name.
 * Falls back to the first letter of the email, then "?" as last resort.
 */
function deriveInitials(name: string | undefined, email: string | undefined): string {
  if (name?.trim()) {
    return name
      .trim()
      .split(/\s+/)
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }
  if (email) return email[0].toUpperCase();
  return "?";
}

/* ─── Component ────────────────────────────────────────────────────────── */

export default function UserDropdown({ user }: UserDropdownProps) {
  const router   = useRouter();
  /* Memoize so the async logout closure always captures a stable client */
  const supabase = useMemo(() => createClient(), []);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  /* Close on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ── Derive display values from live Supabase user ── */
  const fullName    = user?.user_metadata?.full_name as string | undefined;
  const email       = user?.email;
  const displayName = fullName?.trim() || email || "User";
  const initials    = deriveInitials(fullName, email);

  const menuItems = [
    { label: "Profile Settings", icon: User,    href: "/dashboard/profile"   },
    { label: "My Bookings",      icon: Calendar, href: "/dashboard/bookings"  },
  ];

  return (
    <div ref={containerRef} className="relative">
      {/* ── Avatar trigger ── */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label="Open user menu"
        className="group relative flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-cyan-500 to-slate-700
                   text-white text-sm font-bold cursor-pointer select-none
                   ring-2 ring-transparent hover:ring-cyan-400 hover:ring-offset-1
                   transition-all duration-200 shadow-sm hover:shadow-md"
      >
        {initials}
      </button>

      {/* ── Dropdown menu ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="user-dropdown"
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute right-0 top-full mt-3 w-56 bg-white rounded-xl shadow-xl shadow-slate-200/60 border border-slate-100 py-2 z-[60]"
          >
            {/* User info header */}
            <div className="px-4 py-3 border-b border-slate-100">
              <p className="text-sm font-semibold text-slate-900 truncate">{displayName}</p>
              {/* Show email on a second line only when a name is also shown */}
              {fullName?.trim() && email && (
                <p className="text-xs text-slate-500 truncate mt-0.5" title={email}>{email}</p>
              )}
            </div>

            {/* Menu items */}
            <div className="py-1">
            {menuItems.map(({ label, icon: Icon, href }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600
                             hover:text-cyan-600 hover:bg-cyan-50 transition-colors duration-150"
                >
                  <Icon size={15} className="shrink-0" />
                  {label}
                </Link>
              ))}
            </div>

            {/* Divider + Logout */}
            <div className="border-t border-slate-100 pt-1">
              <button
                onClick={async () => {
                  setIsOpen(false);
                  try {
                    await supabase.auth.signOut();
                    router.push("/");
                    router.refresh();
                  } catch (err) {
                    console.error("[UserDropdown] signOut error:", err);
                  }
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600
                           hover:text-red-600 hover:bg-red-50 transition-colors duration-150"
              >
                <LogOut size={15} className="shrink-0" />
                Log Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
