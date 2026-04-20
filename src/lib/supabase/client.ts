import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser-side Supabase client.
 * Safe to import inside any "use client" component.
 * Uses the public anon key — respects Row Level Security.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
