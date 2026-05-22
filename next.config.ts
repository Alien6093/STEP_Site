import type { NextConfig } from "next";

/* ══════════════════════════════════════════════════════════════════════════
   CONTENT SECURITY POLICY
   ══════════════════════════════════════════════════════════════════════════ */

const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://va.vercel-scripts.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' blob: data: https://cdn.sanity.io https://*.supabase.co",
  "connect-src 'self' https://*.sanity.io https://*.supabase.co https://vitals.vercel-insights.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "frame-src https://www.google.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "upgrade-insecure-requests",
].join("; ");

/* ══════════════════════════════════════════════════════════════════════════
   SECURITY HEADERS
   ══════════════════════════════════════════════════════════════════════════ */

const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
  { key: "Content-Security-Policy", value: CSP },
];

/* ══════════════════════════════════════════════════════════════════════════
   NEXT.JS CONFIG
   ══════════════════════════════════════════════════════════════════════════ */

const nextConfig: NextConfig = {
  /* Whitelist Sanity CDN for Next.js Image optimisation */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/**",
      },
    ],
  },

  /* Security headers applied to every route */
  async headers() {
    // Only apply strict headers in production to prevent local HMR/Safari lockouts
    if (process.env.NODE_ENV === "production") {
      return [
        {
          source: "/(.*)",
          headers: securityHeaders,
        },
      ];
    }

    // Return empty headers for local development (npm run dev)
    return [];
  },
};

export default nextConfig;