"use client";

import { Search } from "lucide-react";
import { SECTORS, STAGES } from "@/lib/data/startups";

/* ─── Props ──────────────────────────────────────────────────────────── */

interface FilterBarProps {
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  selectedSector: string;
  setSelectedSector: (v: string) => void;
  selectedStage: string;
  setSelectedStage: (v: string) => void;
}

/* ─── Shared input/select styles ─────────────────────────────────────── */

const inputBase =
  "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm \
   text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 \
   focus:ring-cyan-500 focus:border-transparent transition-shadow duration-200";

/* ─── Component ──────────────────────────────────────────────────────── */

export default function FilterBar({
  searchTerm,
  setSearchTerm,
  selectedSector,
  setSelectedSector,
  selectedStage,
  setSelectedStage,
}: FilterBarProps) {
  return (
    <div
      className="bg-white border border-slate-200 shadow-sm rounded-2xl p-4
                 flex flex-col md:flex-row gap-3 mb-8"
      role="search"
      aria-label="Filter startups"
    >
      {/* Search input */}
      <div className="relative w-full md:w-auto md:flex-1 min-w-0">
        <Search
          size={15}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
        />
        <input
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search startups, founders, or sectors…"
          className={`${inputBase} pl-9`}
          aria-label="Search startups"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:flex-wrap md:overflow-visible md:pb-0 md:mx-0 md:px-0 w-full md:w-auto mt-1 md:mt-0">
        {/* Sector dropdown */}
        <select
        value={selectedSector}
        onChange={(e) => setSelectedSector(e.target.value)}
        className={`${inputBase} flex-shrink-0 whitespace-nowrap w-auto md:w-48 cursor-pointer`}
        aria-label="Filter by sector"
      >
        {SECTORS.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      {/* Stage dropdown */}
      <select
        value={selectedStage}
        onChange={(e) => setSelectedStage(e.target.value)}
        className={`${inputBase} flex-shrink-0 whitespace-nowrap w-auto md:w-40 cursor-pointer`}
        aria-label="Filter by stage"
      >
        {STAGES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      </div>
    </div>
  );
}
