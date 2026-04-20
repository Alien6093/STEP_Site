import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Admin layout — RBAC gate.
 *
 * Protection chain:
 * 1. Must be authenticated (getUser).
 * 2. Must have role = 'admin' in the user_roles table.
 *
 * This layout wraps every route inside /dashboard/admin/**
 * so all future admin pages are protected automatically.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  /* Guard 1 — authentication ─────────────────────────────────────── */
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/");
  }

  /*
   * Security note: `redirect()` throws internally (NEXT_REDIRECT), so
   * TypeScript's control flow analysis may not narrow `user` to non-null.
   * We assert non-null explicitly to prevent a potential null-deref on line below.
   */
  const verifiedUser = user!;

  /* Guard 2 — RBAC role check ────────────────────────────────────── */
  const { data: roleData } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", verifiedUser.id)
    .maybeSingle();

  if (!roleData || roleData.role !== "admin") {
    redirect("/dashboard/profile");
  }


  /* Both guards passed — render admin content */
  return (
    <div className="admin-wrapper">
      {/* Persistent visual indicator — always visible to the admin */}
      <div
        className="bg-red-600 text-white text-[11px] font-bold text-center
                   py-1 uppercase tracking-widest select-none z-10 relative"
      >
        ⚠ Admin Mode Active
      </div>
      {children}
    </div>
  );
}