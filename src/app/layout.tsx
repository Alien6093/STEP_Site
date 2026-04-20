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

/* ─── Metadata ───────────────────────────────────────────────────────── */

export const metadata: Metadata = {
  title: "JSS STEP",
  description: "Empowering Deep-Tech Innovations for Global Impact.",
  icons: {
    icon: "/jss-step-logo.jpg?v=final",
    apple: [
      { url: "/apple-touch-icon.png" },
      { url: "/apple-touch-icon-precomposed.png", rel: "apple-touch-icon-precomposed" },
    ],
  },
};

/* ─── Root Layout ────────────────────────────────────────────────────── */

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
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
