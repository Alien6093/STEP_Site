import { ReactNode } from "react";

type BadgeVariant = "primary" | "secondary" | "outline" | "success";

interface BadgeProps {
  children: ReactNode;
  /** Visual style variant — defaults to 'primary' */
  variant?: BadgeVariant;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  primary:   "bg-cyan-100 text-cyan-800",
  secondary: "bg-slate-100 text-slate-800",
  outline:   "bg-transparent border border-slate-200 text-slate-600",
  success:   "bg-emerald-100 text-emerald-800",
};

/**
 * Pill-shaped badge for status labels, tags, and category markers.
 * Supports four variants: primary, secondary, outline, and success.
 */
export default function Badge({
  children,
  variant = "primary",
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
