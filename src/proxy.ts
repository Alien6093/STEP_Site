import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Route Protection Middleware
 *
 * Responsibilities:
 * 1. Refreshes the Supabase auth session on every request by writing updated
 *    cookies to the response (required by @supabase/ssr for token rotation).
 * 2. Guards protected routes — redirects unauthenticated users to / with
 *    ?login=true so the Navbar can open LoginModal automatically.
 */
export async function proxy(request: NextRequest) {
  /* Start with a copy of the incoming response so existing headers are kept */
  let response = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          /**
           * Write updated auth cookies to both the request (so server-side
           * code in the same request sees the refreshed token) and the
           * response (so the browser receives the new cookie).
           */
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );

          response = NextResponse.next({ request });

          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  /* IMPORTANT: Do not run arbitrary code between createServerClient and
   * getUser() — doing so can cause the session to not refresh properly. */
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  /* ── Protected route check ────────────────────────────────────────── */
  const isProtected =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/mentors/book");

  if (isProtected && !user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/";
    redirectUrl.searchParams.set("login", "true");
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

/* ─── Route matcher ──────────────────────────────────────────────────── */

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/mentors/book/:path*",
    /*
     * Exclude the Sanity Studio — it uses its own Sanity.io authentication.
     * Exclude Next.js internals and static assets from middleware processing.
     */
  ],
};
