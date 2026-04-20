import { createClient } from "@supabase/supabase-js";

/**
 * ⚠️  SERVICE ROLE CLIENT — STRICTLY BACKEND ONLY ⚠️
 *
 * This client uses the service_role secret key which BYPASSES Row Level
 * Security entirely.  It must NEVER be imported in any file that has
 * "use client" or that is bundled into the browser.
 *
 * Appropriate usage:
 *   - Next.js Route Handlers (src/app/api/...)
 *   - Server Actions that require admin data access
 *   - Seed / migration scripts
 */
export const adminClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      /**
       * Disable session persistence — admin client is ephemeral per request
       * and should never store tokens in cookies/localStorage.
       */
      autoRefreshToken:  false,
      persistSession:    false,
      detectSessionInUrl: false,
    },
  }
);
