"use client";

/**
 * Client boundary for Sanity Studio.
 * NextStudio internally calls createContext, which requires a Client Component.
 * This wrapper provides that boundary so page.tsx can remain a Server Component
 * and export metadata / dynamic correctly.
 */

import { NextStudio } from "next-sanity/studio";
import config from "../../../../sanity.config";

export default function Studio() {
  return <NextStudio config={config} />;
}
