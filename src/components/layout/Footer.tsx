"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Mail, Linkedin, Twitter, Instagram } from "lucide-react";
import { motion } from "framer-motion";

/* ─── Data ────────────────────────────────────────────────────────────── */

const QUICK_LINKS = [
  { label: "Home",      href: "/" },
  { label: "About",     href: "/about" },
  { label: "Programs",  href: "/programs" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Apply",     href: "/apply" },
];

const RESOURCE_LINKS = [
  { label: "Events",          href: "/events" },
  { label: "Downloads",       href: "/resources#downloads" },
  { label: "FAQs",            href: "/resources#faqs" },
  { label: "Privacy Policy",  href: "/privacy" },
];

const PARTNERS = [
  { name: "DST",           full: "Dept. of Science & Technology" },
  { name: "NIDHI",         full: "National Initiative for Developing & Harnessing Innovations" },
  { name: "Startup India", full: "Govt. of India Initiative" },
  { name: "JSSATEN",       full: "JSS Academy of Technical Education" },
];

const SOCIAL = [
  { label: "LinkedIn",   href: "#", Icon: Linkedin },
  { label: "Twitter/X",  href: "#", Icon: Twitter },
  { label: "Instagram",  href: "#", Icon: Instagram },
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
                sizes="(max-width: 768px) 100vw, 200px"
                className="object-contain mix-blend-multiply"
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

            <div className="flex items-center gap-2 text-slate-500">
              <Mail size={15} className="shrink-0 text-slate-400" />
              <a
                href="mailto:info@jssstepnoida.org"
                className="text-sm hover:text-cyan-600 transition-colors"
              >
                info@jssstepnoida.org
              </a>
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
            &copy; {new Date().getFullYear()} JSS STEP. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            {SOCIAL.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
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
