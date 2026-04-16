"use client";

import { useEffect, useRef } from "react";
import { useSpring, useInView, useMotionValue, useTransform, motion } from "framer-motion";

interface AnimatedNumberProps {
  /** Target numeric value to count up to */
  value: number;
  /** Optional string appended after the number (e.g. "+" or "%") */
  suffix?: string;
  /** Optional string prepended before the number (e.g. "$") */
  prefix?: string;
  className?: string;
}

/**
 * Counts from 0 to `value` using a Framer Motion spring animation.
 * The counter triggers once when the element scrolls into view.
 */
export default function AnimatedNumber({
  value,
  suffix = "",
  prefix = "",
  className = "",
}: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    duration: 2000,
    bounce: 0,
  });
  const rounded = useTransform(springValue, (latest) => Math.round(latest));

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, value, motionValue]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
}
