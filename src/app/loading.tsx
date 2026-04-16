/* ─── Root route loading skeleton ────────────────────────────────────── */

export default function Loading() {
  return (
    <div className="w-full min-h-screen bg-[#0F172A] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-cyan-500/20 border-t-cyan-500
                        animate-spin" />
        <p className="text-slate-400 text-sm font-medium tracking-widest uppercase">
          Loading…
        </p>
      </div>
    </div>
  );
}
