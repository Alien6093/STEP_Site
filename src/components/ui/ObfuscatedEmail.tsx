"use client";

/**
 * ObfuscatedEmail
 * ═══════════════
 * Renders an email address in a way that defeats automated scrapers:
 *
 *   1. SSR / static HTML: renders only a generic label ("Email Us") —
 *      no address, no mailto:, appears in the server-rendered markup.
 *
 *   2. Client hydration: useEffect runs atob() to decode the Base64
 *      payload and injects the mailto: link — this only happens in the
 *      browser, never at build time.
 *
 * Base64 is NOT encryption — it is purely an encoding step that ensures
 * the plain-text address never appears as a literal string in the HTML
 * source or the JS bundle, defeating regex-based scrapers.
 *
 * Usage:
 *   // info@jssstepnoida.org → btoa("info@jssstepnoida.org") = "aW5mb0Bqc3NzdGVwbm9pZGEub3Jn"
 *   <ObfuscatedEmail encoded="aW5mb0Bqc3NzdGVwbm9pZGEub3Jn" />
 *
 *   // custom label
 *   <ObfuscatedEmail encoded="aW5mb0Bqc3NzdGVwbm9pZGEub3Jn" label="info@jssstepnoida.org" />
 *
 *   // fully custom styling
 *   <ObfuscatedEmail encoded="aW5mb0Bqc3NzdGVwbm9pZGEub3Jn" className="text-cyan-600" />
 */

import { useState, useEffect } from "react";

interface ObfuscatedEmailProps {
  /**
   * Base64-encoded email address.
   * Generate with: btoa("your@email.com")
   * The plain-text address must NEVER appear anywhere in this file.
   */
  encoded: string;

  /**
   * Visible link text after decode.
   * Defaults to the decoded email address itself.
   * Pass a custom value (e.g. "Email Us") to hide the address until hover.
   */
  label?: string;

  /** Additional Tailwind/CSS classes applied to the <a> element. */
  className?: string;
}

export default function ObfuscatedEmail({
  encoded,
  label,
  className = "",
}: ObfuscatedEmailProps) {
  /*
   * decoded: null  → not yet hydrated (SSR state — renders generic label)
   * decoded: string → hydrated on client — mailto: link is active
   */
  const [decoded, setDecoded] = useState<string | null>(null);

  useEffect(() => {
    /*
     * atob() only runs in the browser. Even if a scraper executes JS,
     * the address is not a string literal anywhere in the bundle —
     * it must be actively decoded from the encoded prop.
     */
    try {
      setDecoded(atob(encoded));
    } catch {
      /* Malformed base64 — fail silently, show fallback */
      console.error("[ObfuscatedEmail] Failed to decode base64 payload.");
    }
  }, [encoded]);

  if (!decoded) {
    /*
     * SSR / pre-hydration fallback.
     * A plain <span> (not an <a>) so no href leaks into static HTML.
     * Screen readers will still announce this as a label.
     */
    return (
      <span
        className={`cursor-default ${className}`}
        aria-label="Email address (loading…)"
      >
        Email Us
      </span>
    );
  }

  return (
    <a
      href={`mailto:${decoded}`}
      className={`hover:text-cyan-500 transition-colors duration-200 ${className}`}
      aria-label={`Send email to ${decoded}`}
    >
      {label ?? decoded}
    </a>
  );
}
