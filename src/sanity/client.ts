import { createClient } from "next-sanity";
import { projectId, dataset, apiVersion } from "./env";

/**
 * The primary Sanity read client.
 * - `useCdn: true` → cached CDN responses for public pages (fast, eventually consistent)
 * - `token` is only needed for draft/preview mode; leave undefined for public reads
 * - `perspective: "published"` ensures only published documents are returned
 */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn:      true,
  perspective: "published",
  stega: false,           // disable Sanity Visual Editing overlays by default
});

/**
 * Authenticated client for server-side preview / draft content.
 * Import this only in Server Components or Route Handlers — never in client bundles.
 */
export const previewClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn:  false,
  token:   process.env.SANITY_API_TOKEN,
  perspective: "previewDrafts",
  stega: false,
});
