"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ScrollFadeInProps {
  children: ReactNode;
  /** Delay in seconds before the animation begins (for stagger effects) */
  delay?: number;
  className?: string;
}

/**
 * Wraps children in a Framer Motion div that fades up into view
 * once the element enters the viewport. Trigger fires once only.
 */
export default function ScrollFadeIn({
  children,
  delay = 0,
  className = "",
}: ScrollFadeInProps) {
  return (
    <motion.div
      className={`transform-gpu ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.6,
        delay,
        ease: "easeOut",
      }}
    >
      {children}
    </motion.div>
  );
}
