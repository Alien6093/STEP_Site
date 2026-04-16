import { useEffect, useState } from "react";

/**
 * Tracks the window's vertical scroll position.
 * Uses requestAnimationFrame to throttle updates and avoid
 * layout thrashing on every scroll event.
 *
 * @returns Current `window.scrollY` value in pixels
 */
export function useScrollPosition(): number {
  const [scrollY, setScrollY] = useState<number>(0);

  useEffect(() => {
    let rafId: number | null = null;

    const handleScroll = () => {
      if (rafId !== null) return; // already scheduled
      rafId = requestAnimationFrame(() => {
        setScrollY(window.scrollY);
        rafId = null;
      });
    };

    // Capture initial position
    setScrollY(window.scrollY);

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  return scrollY;
}
