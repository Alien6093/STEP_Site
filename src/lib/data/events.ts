/* ─── Event Data Model ───────────────────────────────────────────────── */

export interface Event {
  id: string;
  title: string;
  date: string;          // e.g. "April 28, 2026"
  time: string;          // e.g. "10:00 AM – 1:00 PM"
  venue: string;
  type: "Workshop" | "Demo Day" | "Webinar" | "Mixer" | "Conference";
  description: string;
  link: string;
  isPastEvent: boolean;
}

/* ─── Seed Data ──────────────────────────────────────────────────────── */

export const eventsData: Event[] = [
  {
    id: "demo-day-2026",
    title: "Demo Day 2026 — Cohort Showcase",
    date: "April 28, 2026",
    time: "10:00 AM – 2:00 PM",
    venue: "JSSATEN Auditorium, Sector 62, Noida",
    type: "Demo Day",
    description:
      "The flagship annual showcase where 12 JSS STEP-incubated startups pitch live to a panel of investors, DST officials, and industry leaders. Open to the public — come witness the next wave of Indian deep-tech.",
    link: "/events/demo-day-2026",
    isPastEvent: false,
  },
  {
    id: "ai-pitch-session-2026",
    title: "AI & Deep Tech Pitch Session",
    date: "May 14, 2026",
    time: "2:00 PM – 5:00 PM",
    venue: "Online — Zoom (Registered attendees only)",
    type: "Webinar",
    description:
      "A focused pitch session for AI, ML, and deep-tech startups seeking NIDHI seed funding. Mentors from IIT Delhi and top VC funds will provide live feedback and scoring.",
    link: "/events/ai-pitch-2026",
    isPastEvent: false,
  },
  {
    id: "founder-mixer-may-2026",
    title: "Founder Mixer — NCR Startup Network",
    date: "May 24, 2026",
    time: "6:00 PM – 9:00 PM",
    venue: "The Quorum, Sector 18, Noida",
    type: "Mixer",
    description:
      "An informal networking evening for JSS STEP founders, alumni, and invited guests from the broader NCR startup ecosystem. Build relationships, share stories, and find co-founders.",
    link: "/events/founder-mixer-may-2026",
    isPastEvent: false,
  },
  {
    id: "ip-workshop-2025",
    title: "IP Protection & Patent Filing Workshop",
    date: "December 10, 2025",
    time: "9:30 AM – 12:30 PM",
    venue: "JSS STEP Conference Room, JSSATEN",
    type: "Workshop",
    description:
      "A hands-on session on filing patents, protecting trade secrets, and navigating IP compliance for deep-tech startups in India. Conducted by a senior IP attorney.",
    link: "/events/ip-workshop-2025",
    isPastEvent: true,
  },
  {
    id: "nidhi-orientation-2025",
    title: "NIDHI EIR Orientation — Batch 4",
    date: "November 3, 2025",
    time: "10:00 AM – 12:00 PM",
    venue: "JSSATEN Seminar Hall",
    type: "Workshop",
    description:
      "Onboarding session for the fourth batch of NIDHI Entrepreneur-in-Residence fellows. Covered program structure, lab access protocols, and mentorship pairing.",
    link: "/events/nidhi-orientation-2025",
    isPastEvent: true,
  },
];
