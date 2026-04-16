import { ReactNode } from "react";

interface SectionHeadingProps {
  /** Small uppercase eyebrow text above the title */
  label?: string;
  /** Main H2 heading — required */
  title: string | ReactNode;
  /** Supporting paragraph below the title */
  subtitle?: string | ReactNode;
  /** Text alignment — defaults to 'center' */
  align?: "left" | "center";
  className?: string;
}

/**
 * Reusable section heading with an optional eyebrow label,
 * a prominent H2 title, and an optional subtitle.
 */
export default function SectionHeading({
  label,
  title,
  subtitle,
  align = "center",
  className = "",
}: SectionHeadingProps) {
  const isCentered = align === "center";

  return (
    <div className={`mb-10 sm:mb-12 md:mb-16 ${isCentered ? "text-center" : "text-left"} ${className}`}>
      {label && (
        <p className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-purple-600 mb-2">
          {label}
        </p>
      )}

      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-4">
        {title}
      </h2>

      {subtitle && (
        <p
          className={`text-sm sm:text-base md:text-lg mt-3 sm:mt-4 text-slate-600 max-w-2xl leading-relaxed ${
            isCentered ? "mx-auto" : ""
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
