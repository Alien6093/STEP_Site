"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Mail, Linkedin, Instagram } from "lucide-react";

/* Official X (formerly Twitter) monogram — not available in lucide-react */
const XIcon = ({ size = 18 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);
import { motion } from "framer-motion";
import ObfuscatedEmail from "@/components/ui/ObfuscatedEmail";
import { SITE_CONFIG } from "@/lib/constants"; // <-- Imported the central config

/* ─── Data ────────────────────────────────────────────────────────────── */

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Programs", href: "/programs" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Apply", href: "/apply" },
];

const RESOURCE_LINKS = [
  { label: "Events", href: "/events" },
  { label: "Downloads", href: "/resources#downloads" },
  { label: "FAQs", href: "/resources#faqs" },
  { label: "Privacy Policy", href: "/privacy-policy" },
];

const PARTNERS = [
  { name: "DST", full: "Dept. of Science & Technology" },
  { name: "NIDHI", full: "National Initiative for Developing & Harnessing Innovations" },
  { name: "Startup India", full: "Govt. of India Initiative" },
  { name: "JSSATEN", full: "JSS Academy of Technical Education" },
];

// UI mapping for social icons to use the central config URLs
const SOCIAL = [
  { label: "LinkedIn", href: SITE_CONFIG.socials.linkedin, Icon: Linkedin },
  { label: "X (formerly Twitter)", href: SITE_CONFIG.socials.x, Icon: XIcon },
  { label: "Instagram", href: SITE_CONFIG.socials.instagram, Icon: Instagram },
];

/* ─── Helpers ─────────────────────────────────────────────────────────── */

function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">
      {children}
    </h4>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="text-sm text-slate-500 hover:text-cyan-600 transition-colors duration-200"
      >
        {children}
      </Link>
    </li>
  );
}

/* ─── Footer ──────────────────────────────────────────────────────────── */

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">

        {/* ── Main Grid ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 transform-gpu"
        >
          {/* Col 1 — Brand & Address */}
          <div className="sm:col-span-2 lg:col-span-1 space-y-5">
            <div className="relative w-44 h-12 shrink-0">
              <Image
                src="/jss-step-logo.jpg"
                alt="JSS STEP Logo"
                fill
                sizes="176px"
                className="object-contain mix-blend-multiply"
                priority={false}
              />
            </div>

            <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
              DST‑supported Technology Business Incubator empowering deep‑tech startups
              to scale globally.
            </p>

            <div className="flex items-start gap-2 text-slate-500">
              <MapPin size={15} className="shrink-0 mt-0.5 text-slate-400" />
              <address className="not-italic text-sm leading-relaxed">
                JSS Academy of Technical Education<br />
                C‑20/1, Sector 62, Noida<br />
                Uttar Pradesh — 201301
              </address>
            </div>

            <div className="flex items-center gap-2.5 text-slate-500">
              <Mail size={15} className="shrink-0 text-slate-400 -translate-y-[1px]" />
              <ObfuscatedEmail
                encoded={SITE_CONFIG.supportEmailBase64}
                className="text-sm hover:text-cyan-600 transition-colors"
              />
            </div>
          </div>

          {/* Col 2 — Quick Links */}
          <div>
            <FooterHeading>Quick Links</FooterHeading>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map((l) => (
                <FooterLink key={l.href} href={l.href}>{l.label}</FooterLink>
              ))}
            </ul>
          </div>

          {/* Col 3 — Resources */}
          <div>
            <FooterHeading>Resources</FooterHeading>
            <ul className="space-y-2.5">
              {RESOURCE_LINKS.map((l) => (
                <FooterLink key={l.href} href={l.href}>{l.label}</FooterLink>
              ))}
            </ul>
          </div>

          {/* Col 4 — Ecosystem Partners */}
          <div>
            <FooterHeading>Ecosystem Partners</FooterHeading>
            <p className="text-xs text-slate-400 mb-3">Supported by</p>
            <ul className="space-y-3">
              {PARTNERS.map((p) => (
                <li key={p.name} className="flex flex-col">
                  <span className="text-sm font-semibold text-slate-700">{p.name}</span>
                  <span className="text-xs text-slate-400 leading-tight">{p.full}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* ── Bottom Bar ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-12 pt-8 border-t border-slate-200 flex flex-col sm:flex-row
                     items-center justify-between gap-4"
        >
          <p className="text-sm text-slate-400">
            &copy;{" "}
            <span suppressHydrationWarning>{new Date().getFullYear()}</span>
            {" "}JSS STEP. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            {SOCIAL.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${label} (opens in new tab)`}
                className="text-slate-400 hover:text-cyan-600 transition-colors duration-200"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
}