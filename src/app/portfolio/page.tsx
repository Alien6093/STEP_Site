"use client";

import { useState, useMemo } from "react";
import { SearchX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import PortfolioHero from "@/components/portfolio/PortfolioHero";
import FilterBar from "@/components/portfolio/FilterBar";
import StartupCard from "@/components/portfolio/StartupCard";
import ScrollFadeIn from "@/components/shared/ScrollFadeIn";
import { startupsData } from "@/lib/data/startups";

/* ─── Card animation variants ────────────────────────────────────────── */

const cardVariants = {
  hidden:  { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] as const },
  }),
  exit: { opacity: 0, scale: 0.97, transition: { duration: 0.2 } },
};

/* ─── Page ───────────────────────────────────────────────────────────── */

export default function PortfolioPage() {
  /* ── Filter state ── */
  const [searchTerm,      setSearchTerm]      = useState("");
  const [selectedSector,  setSelectedSector]  = useState("All Sectors");
  const [selectedStage,   setSelectedStage]   = useState("All Stages");

  /* ── Derived filtered list (memoised) ── */
  const filteredStartups = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return startupsData.filter((startup) => {
      const matchesSearch =
        !query ||
        startup.name.toLowerCase().includes(query) ||
        startup.founders.toLowerCase().includes(query) ||
        startup.sector.toLowerCase().includes(query) ||
        startup.description.toLowerCase().includes(query);

      const matchesSector =
        selectedSector === "All Sectors" || startup.sector === selectedSector;

      const matchesStage =
        selectedStage === "All Stages" || startup.stage === selectedStage;

      return matchesSearch && matchesSector && matchesStage;
    });
  }, [searchTerm, selectedSector, selectedStage]);

  /* ── Render ── */
  return (
    <div className="w-full">
      <PortfolioHero />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Filter bar */}
        <ScrollFadeIn>
          <FilterBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedSector={selectedSector}
            setSelectedSector={setSelectedSector}
            selectedStage={selectedStage}
            setSelectedStage={setSelectedStage}
          />
        </ScrollFadeIn>

        {/* Result count */}
        <p className="text-sm text-slate-400 mb-6">
          Showing{" "}
          <span className="font-semibold text-slate-700">{filteredStartups.length}</span>{" "}
          {filteredStartups.length === 1 ? "startup" : "startups"}
        </p>

        {/* ── Grid or Empty State ── */}
        {filteredStartups.length > 0 ? (
          <AnimatePresence mode="popLayout">
            <motion.div
              key="grid"
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredStartups.map((startup, i) => (
                <motion.div
                  key={startup.id}
                  custom={i}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  layout
                >
                  <StartupCard startup={startup} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
              <SearchX size={28} className="text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              No startups found
            </h3>
            <p className="text-sm text-slate-500 max-w-xs">
              No startups match your current filters. Try adjusting your search
              term, sector, or stage.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedSector("All Sectors");
                setSelectedStage("All Stages");
              }}
              className="mt-6 text-sm font-medium text-cyan-600 hover:text-cyan-700
                         underline underline-offset-2 transition-colors"
            >
              Clear all filters
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
