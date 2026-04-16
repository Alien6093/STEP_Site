"use client";

import Link from "next/link";
import { Download, FileText, FileSpreadsheet, Presentation } from "lucide-react";
import type { Resource } from "@/lib/data/resources";

/* ─── Icon for file type ─────────────────────────────────────────────── */

function FileIcon({ type }: { type: Resource["fileType"] }) {
  const cls = "text-slate-400 group-hover:text-cyan-600 transition-colors duration-300";
  switch (type) {
    case "XLSX": return <FileSpreadsheet size={22} className={cls} strokeWidth={1.75} />;
    case "PPT":  return <Presentation    size={22} className={cls} strokeWidth={1.75} />;
    default:     return <FileText        size={22} className={cls} strokeWidth={1.75} />;
  }
}

/* ─── Component ──────────────────────────────────────────────────────── */

export default function ResourceCard({ resource }: { resource: Resource }) {
  const { title, description, fileType, size, link } = resource;

  return (
    <Link
      href={link}
      download
      className="group flex items-center gap-4 bg-white rounded-xl p-5
                 border border-slate-200 hover:border-cyan-400 hover:shadow-md
                 hover:shadow-cyan-500/10 transition-all duration-300 cursor-pointer"
      aria-label={`Download ${title}`}
    >
      {/* File type icon box */}
      <div
        className="shrink-0 w-12 h-12 rounded-lg bg-slate-50 flex items-center justify-center
                   group-hover:bg-cyan-50 transition-colors duration-300"
      >
        <FileIcon type={fileType} />
      </div>

      {/* Text content */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-slate-900 text-sm leading-snug truncate">{title}</p>
        <p className="text-xs text-slate-500 mt-0.5 line-clamp-1 leading-relaxed">{description}</p>
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mt-1.5">
          {fileType} &bull; {size}
        </p>
      </div>

      {/* Download action icon */}
      <div
        className="shrink-0 min-w-[44px] min-h-[44px] rounded-lg flex items-center justify-center
                   text-slate-300 group-hover:text-cyan-600 group-hover:bg-cyan-50
                   transition-all duration-300"
      >
        <Download size={16} strokeWidth={2} />
      </div>
    </Link>
  );
}
