import { client } from "@/sanity/client";
import SlotGeneratorForm, { type SanityMentor } from "@/components/admin/SlotGeneratorForm";
import { CalendarPlus } from "lucide-react";

export const metadata = {
  title: "Slot Generator — JSS STEP Admin",
};

/* Force fresh data on every request — this is a write-heavy admin tool */
export const dynamic = "force-dynamic";

export default async function AdminSlotsPage() {
  /*
   * Fetch all published mentors from Sanity, sorted alphabetically.
   * `no-store` bypasses the Next.js fetch cache so the list is always current.
   */
  let mentors: SanityMentor[] = [];

  try {
    mentors = await client.fetch<SanityMentor[]>(
      `*[_type == "mentor"] | order(name asc) { _id, name }`,
      {},
      { cache: "no-store" }
    );
  } catch (err) {
    console.error("[admin/slots] Sanity fetch error:", err);
    /* Component still renders; SlotGeneratorForm shows an empty-state warning */
  }

  return (
    <div className="min-h-screen bg-[#0A0F1E] px-4 py-10 sm:px-8">
      <div className="max-w-2xl mx-auto space-y-8">

        {/* ── Page header ── */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl
                            bg-cyan-500/10 border border-cyan-500/20">
              <CalendarPlus size={20} className="text-cyan-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Slot Generator</h1>
              <p className="text-xs text-slate-500">
                Admin — bulk insert mentor availability into Supabase
              </p>
            </div>
          </div>

          {/* Warning banner */}
          <div className="mt-4 px-4 py-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
            <p className="text-xs text-amber-400 font-medium">
              ⚠ Admin-only tool. All inserts go directly to production data.
            </p>
          </div>

          {/* Mentor count badge */}
          <div className="mt-3 px-4 py-2 rounded-xl bg-slate-800/60 border border-slate-700/60
                          flex items-center gap-2">
            <span className="text-xs text-slate-500">Mentors fetched from Sanity:</span>
            <span className="text-xs font-bold text-cyan-400">{mentors.length}</span>
          </div>
        </div>

        {/* ── Client form (receives server-fetched mentor list) ── */}
        <SlotGeneratorForm mentors={mentors} />

      </div>
    </div>
  );
}
