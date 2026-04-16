/* ─── Resource Data Model ────────────────────────────────────────────── */

export interface Resource {
  id: string;
  title: string;
  description: string;
  fileType: "PDF" | "PPT" | "XLSX" | "DOC";
  size: string;           // e.g. "2.4 MB"
  link: string;
  category: "Templates" | "Guidelines" | "Legal" | "Playbooks";
}

/* ─── Seed Data ──────────────────────────────────────────────────────── */

export const resourcesData: Resource[] = [
  {
    id: "pitch-deck-template",
    title: "Startup Pitch Deck Template",
    description:
      "A professionally structured 12-slide presentation template used by JSS STEP founders during Demo Days and investor pitches.",
    fileType: "PPT",
    size: "3.8 MB",
    link: "/downloads/pitch-deck-template.pptx",
    category: "Templates",
  },
  {
    id: "business-model-canvas",
    title: "Business Model Canvas (BMC)",
    description:
      "The standard Osterwalder BMC adapted for deep-tech startups — pre-filled examples included for AI, Health-Tech, and Clean-Tech ventures.",
    fileType: "PDF",
    size: "1.2 MB",
    link: "/downloads/business-model-canvas.pdf",
    category: "Templates",
  },
  {
    id: "nidhi-seed-fund-guidelines",
    title: "NIDHI PRAYAS Seed Fund Guidelines",
    description:
      "Official DST guidelines for the NIDHI PRAYAS grant scheme — eligibility criteria, funding quantum, disbursement schedule, and compliance reporting.",
    fileType: "PDF",
    size: "2.1 MB",
    link: "/downloads/nidhi-prayas-guidelines.pdf",
    category: "Guidelines",
  },
  {
    id: "ip-legal-guide",
    title: "IP & Legal Handbook for Startups",
    description:
      "A comprehensive guide covering patent filing, trademark registration, founder agreements, and DPIIT startup recognition in India.",
    fileType: "PDF",
    size: "4.5 MB",
    link: "/downloads/ip-legal-guide.pdf",
    category: "Legal",
  },
  {
    id: "gtm-playbook",
    title: "Go-To-Market Playbook",
    description:
      "A step-by-step market entry framework for deep-tech B2B startups — includes ICP definition, early customer acquisition, and channel strategy templates.",
    fileType: "PDF",
    size: "2.8 MB",
    link: "/downloads/gtm-playbook.pdf",
    category: "Playbooks",
  },
  {
    id: "financial-projection-template",
    title: "5-Year Financial Projection Template",
    description:
      "An Excel template pre-built with revenue, burn rate, runway, and unit economics models tailored for seed-stage deep-tech companies.",
    fileType: "XLSX",
    size: "0.9 MB",
    link: "/downloads/financial-projection.xlsx",
    category: "Templates",
  },
];

/* ─── Ecosystem external links ───────────────────────────────────────── */

export const ecosystemLinks = [
  {
    title: "Startup India Portal",
    description: "Register your startup and apply for DPIIT recognition benefits.",
    href: "https://startupindia.gov.in",
  },
  {
    title: "DPIIT Startup Recognition",
    description: "Official portal for applying for DPIIT startup certificate.",
    href: "https://dpiit.gov.in",
  },
  {
    title: "MSME Registration (Udyam)",
    description: "Register as an MSME to unlock government schemes and priority lending.",
    href: "https://udyamregistration.gov.in",
  },
  {
    title: "NIDHI Program Dashboard",
    description: "Track NIDHI scheme announcements, call for proposals, and guidelines.",
    href: "https://dst.gov.in/nidhi",
  },
  {
    title: "MeitY Startup Hub",
    description: "Grants and accelerator programs for IT and electronics startups.",
    href: "https://msins.in",
  },
];
