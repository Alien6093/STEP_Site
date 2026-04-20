export const dynamic = "force-dynamic";

import { client } from "@/sanity/client";
import { urlFor } from "@/sanity/image";
import type { Startup } from "@/lib/data/startups";
import PortfolioHero from "@/components/portfolio/PortfolioHero";
import PortfolioGrid from "@/components/portfolio/PortfolioGrid";

export const metadata = {
  title:       "Portfolio — JSS STEP",
  description: "Deep-tech startups incubated and accelerated by JSS STEP.",
};

/* ─── GROQ query ──────────────────────────────────────────────────────── */

const PORTFOLIO_QUERY = `
  *[_type == "portfolio"] | order(cohortYear desc) {
    _id,
    startupName,
    "slug": slug.current,
    founderNames,
    sector,
    description,
    logo,
    websiteUrl,
    status,
    cohortYear,
    isFeatured
  }
`;

/* ─── Sanity result type ──────────────────────────────────────────────── */

interface SanityStartup {
  _id:          string;
  startupName:  string;
  slug:         string;
  founderNames: string | null;
  sector:       string | null;
  description:  string | null;
  logo:         { asset: { _ref: string } } | null;
  websiteUrl:   string | null;
  status:       "Active" | "Acquired" | "Alumni" | "Dead" | null;
  cohortYear:   number | null;
  isFeatured?:  boolean;          // optional — false/undefined on existing docs
}

/* ─── Page ────────────────────────────────────────────────────────────── */

export default async function PortfolioPage() {
  const sanityData = await client.fetch<SanityStartup[]>(
    PORTFOLIO_QUERY,
    {},
    { cache: "no-store" }               // always fetch fresh data
  );

  /* Map Sanity shape → existing Startup type used by StartupCard */
  const startups: Startup[] = sanityData.map((item) => ({
    id:          item._id,
    name:        item.startupName,
    slug:        item.slug ?? "",
    founders:    item.founderNames ?? "—",
    sector:      item.sector       ?? "Other",
    description: item.description  ?? "",
    website:     item.websiteUrl   ?? "",
    stage:       (item.status ?? "Active") as Startup["stage"],
    cohortYear:  item.cohortYear != null ? String(item.cohortYear) : String(new Date().getFullYear()),
    logo:        item.logo
      ? urlFor(item.logo).width(120).height(120).fit("crop").url()
      : null,
  }));

  return (
    <div className="w-full">
      <PortfolioHero />
      <PortfolioGrid startups={startups} />
    </div>
  );
}
