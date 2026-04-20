/**
 * Sanity environment variables.
 * NEXT_PUBLIC_ prefix makes them available in both server and client bundles.
 */

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
export const dataset   = process.env.NEXT_PUBLIC_SANITY_DATASET!;
export const apiVersion = "2024-04-18";

if (!projectId) throw new Error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID");
if (!dataset)   throw new Error("Missing NEXT_PUBLIC_SANITY_DATASET");
