import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageTransition from "@/components/shared/PageTransition";
import CookieBanner from "@/components/shared/CookieBanner";

/* ─── Fonts ──────────────────────────────────────────────────────────── */

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/* ─── Site constants ─────────────────────────────────────────────────── */

const SITE_URL = "https://www.jssstepnoida.in";
const SITE_NAME = "JSS STEP Incubator";
const TITLE = "JSS STEP — DST-Supported Deep-Tech Incubator, Noida";
const DESC =
  "JSS STEP is a DST-supported Technology Business Incubator at JSS Academy of " +
  "Technical Education, Noida, empowering deep-tech startups in AI, Clean-Tech, " +
  "Health-Tech, Robotics, and Industry 4.0 to scale globally.";

/* ─── Metadata ───────────────────────────────────────────────────────── */

export const metadata: Metadata = {
  /*
   * metadataBase resolves relative URLs in openGraph.images, twitter.images,
   * icons, etc. against the production domain. Without this, Next.js warns
   * and social crawlers may receive malformed absolute URLs.
   */
  metadataBase: new URL(SITE_URL),

  /* ── Core ── */
  title: {
    default: TITLE,
    template: "%s | JSS STEP",  // child pages use: export const metadata = { title: "Portfolio" }
  },
  description: DESC,

  /* ── Canonical ── */
  alternates: {
    canonical: "/",
  },

  /* ── Icons ── */
  icons: {
    icon: "/jss-step-logo.jpg?v=final",
    apple: [
      { url: "/apple-touch-icon.png" },
      { url: "/apple-touch-icon-precomposed.png", rel: "apple-touch-icon-precomposed" },
    ],
  },

  /* ── Open Graph ─────────────────────────────────────────────────────────
   *
   * Consumed by: Facebook, LinkedIn, WhatsApp, Telegram, Discord, Slack.
   * og:image dimensions: 1200×630 is the universal recommended size.
   * og:locale: en_IN signals Indian English content to regional crawlers.
   */
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: TITLE,
    description: DESC,
    images: [
      {
        url: "/og-image.png",   // resolved against metadataBase
        width: 1200,
        height: 630,
        alt: "JSS STEP — DST-Supported Deep-Tech Incubator, Noida",
      },
    ],
  },

  /* ── Twitter / X Card ───────────────────────────────────────────────────
   *
   * summary_large_image: renders the full 1200×630 banner on X, not a thumbnail.
   * @site: the official X handle (update if the handle changes).
   */

  twitter: {
    card: "summary_large_image",
    site: "@JSSSTEP_Noida",
    title: TITLE,
    description: DESC,
    images: ["/og-image.png"],
  },

  /* ── Indexing directives ─────────────────────────────────────────────── */
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  /* ── Verification tokens (add when ready to claim in Google/Bing) ───── */
  // verification: {
  //   google: "YOUR_GOOGLE_SITE_VERIFICATION_TOKEN",
  //   other:  { "msvalidate.01": "YOUR_BING_TOKEN" },
  // },
};

/* ─── JSON-LD Structured Data ────────────────────────────────────────── */
/*
 * Schema.org/Organization tells Google rich-result features (knowledge panel,
 * sitelinks searchbox, etc.) about the organisation behind this site.
 *
 * XSS note: JSON.stringify with no replacer is safe here because this is a
 * static object defined in server code — no user input is interpolated.
 * The __html pattern is the standard Next.js / React way to inject a raw
 * <script> tag; it does NOT evaluate arbitrary strings from users.
 */


/* ─── Root Layout ────────────────────────────────────────────────────── */

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        {/*
         * JSON-LD Organisation schema injected into <head> as a raw script.
         * Using dangerouslySetInnerHTML is the correct pattern for ld+json —
         * it is not dangerous here because the payload is a static server-side
         * constant with no user-controlled interpolation.
         */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "JSS STEP Incubator",
              "url": "https://www.jssstepnoida.in",
              "logo": "https://www.jssstepnoida.in/og-image.png",
              "contactPoint": {
                "@type": "ContactPoint",
                "email": "info@jssstepnoida.in",
                "contactType": "Admissions & Support"
              },
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "JSS Academy of Technical Education, C-20/1, Sector 62",
                "addressLocality": "Noida",
                "addressRegion": "Uttar Pradesh",
                "postalCode": "201301",
                "addressCountry": "IN"
              }
            })
          }}
        />
      </head>
      <body
        className={`
          ${geistSans.variable} ${geistMono.variable}
          antialiased font-sans
          bg-[#F8FAFC] text-slate-900
          flex flex-col min-h-screen
          overflow-x-hidden
        `}
      >
        <Navbar />

        <main className="flex-grow pt-16">
          <PageTransition>
            {children}
          </PageTransition>
        </main>

        <Footer />

        {/* ── Global floating widgets ── */}
        <CookieBanner />
      </body>
    </html>
  );
}
