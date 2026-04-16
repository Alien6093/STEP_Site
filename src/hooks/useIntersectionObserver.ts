import { RefObject, useEffect, useState } from "react";

interface UseIntersectionObserverOptions {
  threshold?: number | number[];
  rootMargin?: string;
  root?: Element | null;
}

/**
 * Observes a DOM element and returns whether it is currently
 * intersecting the viewport (or a custom root).
 *
 * @param ref      - A React ref attached to the target element
 * @param options  - Optional IntersectionObserver configuration
 * @returns        Boolean `true` once the element is visible
 */
export function useIntersectionObserver(
  ref: RefObject<Element | null>,
  options: UseIntersectionObserverOptions = {}
): boolean {
  const { threshold = 0.1, rootMargin = "0px", root = null } = options;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Once visible, stop observing to avoid redundant callbacks
          observer.unobserve(element);
        }
      },
      { threshold, rootMargin, root }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [ref, threshold, rootMargin, root]);

  return isVisible;
}
