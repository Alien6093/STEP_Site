import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// 🔒 Hardcoded Admin List (Add your co-founders here too)
const ADMIN_EMAILS = ["alien.adi24@gmail.com" , "deviloffers.service@gmail.com"]; 

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
  if (!user.email || !ADMIN_EMAILS.includes(user.email)) {
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