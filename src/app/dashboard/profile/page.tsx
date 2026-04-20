import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProfileForm, { type ProfileData } from "@/components/dashboard/ProfileForm";

export const metadata = {
  title: "Profile Settings — JSS STEP",
};

export default async function ProfilePage() {
  const supabase = await createClient();

  /* ── Verify session ─────────────────────────────────────────────── */
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/?login=true");
  }

  /* ── Fetch profile row ──────────────────────────────────────────── */
  /*
   * Use maybeSingle() instead of single():
   * .single() throws PGRST116 when no profile row exists yet (new users).
   * .maybeSingle() returns { data: null } gracefully — the form renders
   * with empty initial values, which is the correct first-run UX.
   */
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, phone, linkedin_url, organisation, avatar_url")
    .eq("id", user!.id)
    .maybeSingle();

  /* Build the initialData shape expected by ProfileForm */
  const initialData: ProfileData = {
    email:        user.email ?? "",
    full_name:    profile?.full_name    ?? null,
    phone:        profile?.phone        ?? null,
    linkedin_url: profile?.linkedin_url ?? null,
    organisation: profile?.organisation ?? null,
    avatar_url:   profile?.avatar_url   ?? null,
  };

  return <ProfileForm initialData={initialData} />;
}
