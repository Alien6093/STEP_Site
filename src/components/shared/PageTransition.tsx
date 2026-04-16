"use client";

import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
}

/**
 * Wraps page content in a Framer Motion div that animates on mount/unmount.
 * AnimatePresence + key={pathname} ensures exit animations fire on route changes.
 * Must be a Client Component (used inside the Server Component layout.tsx).
 */
export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="transform-gpu"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

