import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Server Component / Server Action Supabase client.
 * Must be called inside a Server Component, Route Handler, or Server Action
 * so that `cookies()` from next/headers is available.
 * Uses the public anon key — respects Row Level Security.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        /**
         * getAll / setAll are the only two methods required by @supabase/ssr
         * for the Next.js App Router cookie adapter.
         */
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            /**
             * setAll is called from Server Components which cannot set cookies.
             * The middleware handles cookie refresh in that scenario — this
             * catch is intentional and safe to ignore.
             */
          }
        },
      },
    }
  );
}
