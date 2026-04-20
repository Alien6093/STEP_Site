import { redirect } from "next/navigation";

/**
 * /dashboard root — always redirect to the profile sub-page.
 * This prevents a 404 when Supabase auth redirects to /dashboard after login.
 */
export default function DashboardRootPage() {
  redirect("/dashboard/profile");
}
