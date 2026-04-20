"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Calendar } from "lucide-react";

/* ─── Nav items ───────────────────────────────────────────────────────── */

const NAV_ITEMS = [
  { label: "Profile Settings", href: "/dashboard/profile",  icon: User     },
  { label: "My Bookings",      href: "/dashboard/bookings", icon: Calendar },
];

/* ─── Layout ──────────────────────────────────────────────────────────── */

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#0F172A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">

        {/* ── Mobile: horizontal scrollable tab bar ── */}
        <nav
          className="flex md:hidden gap-2 overflow-x-auto scrollbar-hide mb-6
                     border-b border-slate-700/60 pb-0"
          aria-label="Dashboard navigation"
        >
          {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2 px-4 py-3 whitespace-nowrap text-sm font-medium
                            border-b-2 transition-all duration-200 shrink-0
                            ${active
                              ? "border-cyan-400 text-cyan-400"
                              : "border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-500"
                            }`}
              >
                <Icon size={15} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* ── Desktop: two-column grid ── */}
        <div className="md:grid md:grid-cols-[256px_1fr] md:gap-8">

          {/* Left sidebar */}
          <aside className="hidden md:block">
            <div className="sticky top-24">
              {/* Sidebar header */}
              <div className="mb-6">
                <h2 className="text-xs font-semibold tracking-widest text-slate-500 uppercase px-3">
                  Account
                </h2>
              </div>

              <nav className="flex flex-col gap-1" aria-label="Dashboard navigation">
                {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
                  const active = pathname === href;
                  return (
                    <Link
                      key={href}
                      href={href}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                                  transition-all duration-150 group
                                  ${active
                                    ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent"
                                  }`}
                    >
                      <Icon
                        size={16}
                        className={`shrink-0 transition-colors ${active ? "text-cyan-400" : "text-slate-500 group-hover:text-slate-300"}`}
                      />
                      {label}
                    </Link>
                  );
                })}
              </nav>

              {/* Sidebar footer card */}
              <div className="mt-8 p-4 rounded-xl bg-slate-800/50 border border-slate-700/60">
                <p className="text-xs font-medium text-slate-300">Need help?</p>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  Reach out to your program coordinator for support.
                </p>
                <a
                  href="mailto:step@jss.ac.in"
                  className="inline-block mt-3 text-xs font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  step@jss.ac.in →
                </a>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <main className="min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
