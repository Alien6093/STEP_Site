/**
 * Embedded Sanity Studio — Server Component page.
 *
 * `force-static` + `metadata` must live in a Server Component (no "use client").
 * <NextStudio> needs a Client Component boundary (createContext).
 *
 * Solution: the official next-sanity split-file pattern —
 *   page.tsx   → Server Component (metadata, dynamic export)
 *   Studio.tsx → "use client" wrapper that mounts <NextStudio>
 */

import Studio from "./Studio";

export const dynamic = "force-static";

export const metadata = {
  title:       "JSS STEP — Content Studio",
  description: "Sanity Studio for managing JSS STEP mentor and portfolio content.",
};

export default function StudioPage() {
  return <Studio />;
}
