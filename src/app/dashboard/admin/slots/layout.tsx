import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// 🔒 Admin list sourced from environment — never hardcoded in source.
// ADMIN_EMAILS="a@example.com, b@example.com" (comma-separated, set in .env.local / hosting secrets)
const adminEmails = (process.env.ADMIN_EMAILS || "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  // Guard 1: Not logged in at all
  if (error || !user) {
    redirect("/login"); 
  }

  // Guard 2: Logged in, but NOT an admin
  if (!user.email || !adminEmails.includes(user.email.toLowerCase())) {
    redirect("/dashboard/profile"); 
  }

  // Passed all guards! Render the admin tools.
  return (
    <div className="admin-wrapper">
      <div className="bg-red-500 text-white text-xs font-bold text-center py-1 uppercase tracking-widest">
        Admin Mode Active
      </div>
      {children}
    </div>
  );
}
