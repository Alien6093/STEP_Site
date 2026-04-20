"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  CalendarDays,
  Linkedin,
  Twitter,
  Globe,
  Clock,
  Users,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import BookingForm from "@/components/booking/BookingForm";

/* ─── Types (passed as props from Server Component) ──────────────────── */

export interface MentorProfileData {
  _id: string;
  name: string;
  designation: string | null;
  organisation: string | null;
  bio: string | null;
  photoUrl: string | null;  // pre-resolved CDN URL
  linkedinUrl: string | null;
  twitterUrl: string | null;
  websiteUrl: string | null;
  experienceYears: number | null;
  totalSessions: number | null;
  expertise: string[];
  isAvailableForBooking: boolean;
}

/* ─── Stat chip ───────────────────────────────────────────────────────── */

function StatChip({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1 px-5 py-4 rounded-xl
                    bg-slate-800/60 border border-slate-700/60 text-center">
      <Icon size={18} className="text-cyan-400" />
      <span className="text-lg font-bold text-white">{value}</span>
      <span className="text-xs text-slate-500 whitespace-nowrap">{label}</span>
    </div>
  );
}

/* ─── Social link ─────────────────────────────────────────────────────── */

function SocialLink({
  href,
  label,
  icon: Icon,
}: {
  href: string | null;
  label: string;
  icon: React.ElementType;
}) {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="p-2 rounded-lg text-slate-500 hover:text-cyan-400
                 hover:bg-slate-800 transition-all duration-150"
    >
      <Icon size={16} />
    </a>
  );
}

/* ─── Client Component ───────────────────────────────────────────────── */

export default function MentorProfileClient({
  mentor,
}: {
  mentor: MentorProfileData;
}) {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  /* Derive initials as fallback avatar */
  const initials = mentor.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-screen bg-[#0F172A]">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 pt-28">

        {/* Back link */}
        <Link
          href="/mentors"
          className="inline-flex items-center gap-2 text-sm text-slate-500
                     hover:text-slate-300 transition-colors duration-150 mb-8 group"
        >
          <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-0.5" />
          All Mentors
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10 lg:gap-16">

          {/* ── Left: Main content ── */}
          <div className="space-y-10">

            {/* Hero row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="flex flex-col sm:flex-row sm:items-start gap-6"
            >
              {/* Avatar */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden
                              ring-4 ring-slate-700 shrink-0 shadow-xl shadow-cyan-500/10">
                {mentor.photoUrl ? (
                  <Image
                    src={mentor.photoUrl}
                    alt={mentor.name}
                    width={112}
                    height={112}
                    className="w-full h-full object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-cyan-500 to-slate-700
                                  flex items-center justify-center text-white text-3xl font-bold select-none">
                    {initials}
                  </div>
                )}
              </div>

              {/* Name + meta */}
              <div className="flex flex-col gap-2">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  {mentor.name}
                </h1>
                {mentor.designation && (
                  <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                    {mentor.designation}
                  </p>
                )}
                {mentor.organisation && (
                  <p className="text-cyan-500 text-sm font-medium">{mentor.organisation}</p>
                )}

                {/* Social links — hidden if URL is missing */}
                <div className="flex items-center gap-1 mt-1">
                  <SocialLink href={mentor.linkedinUrl} label="LinkedIn" icon={Linkedin} />
                  <SocialLink href={mentor.twitterUrl} label="Twitter / X" icon={Twitter} />
                  <SocialLink href={mentor.websiteUrl} label="Personal website" icon={Globe} />
                </div>
              </div>
            </motion.div>

            {/* Stats row — 2 chips (Rating removed per spec) */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
              className="grid grid-cols-2 gap-3"
            >
              <StatChip
                icon={Users}
                value={mentor.totalSessions != null ? String(mentor.totalSessions) : "—"}
                label="Sessions"
              />
              <StatChip
                icon={Clock}
                value={mentor.experienceYears != null ? `${mentor.experienceYears} yrs` : "—"}
                label="Experience"
              />
            </motion.div>

            {/* Bio */}
            {mentor.bio && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15, ease: "easeOut" }}
              >
                <h2 className="text-base font-semibold text-white mb-3">About</h2>
                <div className="space-y-3">
                  {mentor.bio.trim().split("\n\n").map((para, idx) => (
                    <p key={idx} className="text-slate-400 text-sm leading-relaxed">
                      {para.trim()}
                    </p>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Expertise chips */}
            {mentor.expertise.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
              >
                <h2 className="text-base font-semibold text-white mb-3">Areas of Expertise</h2>
                <div className="flex flex-wrap gap-2">
                  {mentor.expertise.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 rounded-full text-xs font-medium
                                 bg-cyan-500/10 border border-cyan-500/20 text-cyan-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* ── Right: Sticky booking card ── */}
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.15, ease: "easeOut" }}
            className="w-full"
          >
            <div className="sticky top-24 bg-slate-800/50 border border-slate-700/60
                            rounded-2xl p-6 space-y-5 shadow-xl shadow-slate-950/40">
              <div>
                <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase mb-1">
                  Session Details
                </p>
                <p className="text-slate-200 text-sm leading-relaxed">
                  60-minute 1:1 video call. Free for JSS STEP incubatees.
                </p>
              </div>

              <ul className="space-y-2 text-sm text-slate-400">
                <li className="flex items-center gap-2">
                  <CalendarDays size={14} className="text-cyan-400 shrink-0" />
                  New slots every week
                </li>
                <li className="flex items-center gap-2">
                  <Clock size={14} className="text-cyan-400 shrink-0" />
                  60 minutes per session
                </li>
                <li className="flex items-center gap-2">
                  <Users size={14} className="text-cyan-400 shrink-0" />
                  1:1 focused mentoring
                </li>
              </ul>

              <hr className="border-slate-700/60" />

              {/* Availability guard */}
              {mentor.isAvailableForBooking ? (
                <>
                  <button
                    type="button"
                    onClick={() => setIsBookingOpen(true)}
                    className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl
                               bg-cyan-400 text-slate-900 text-sm font-bold
                               hover:bg-cyan-300 hover:shadow-lg hover:shadow-cyan-400/25
                               active:scale-[0.98] transition-all duration-150"
                  >
                    <CalendarDays size={16} />
                    Book a Session
                  </button>
                  <p className="text-xs text-slate-600 text-center">
                    No payment required. Slots confirmed instantly.
                  </p>
                </>
              ) : (
                <p className="text-sm text-slate-500 text-center py-2">
                  This mentor is fully booked. Check back soon.
                </p>
              )}
            </div>
          </motion.aside>

        </div>
      </div>

      {/* Booking modal — passes dynamic mentor._id and name */}
      <BookingForm
        mentorId={mentor._id}
        mentorName={mentor.name}
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
    </div>
  );
}
