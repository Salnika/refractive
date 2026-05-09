import { useEffect, useState } from "react";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export function readReducedMotion(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }

  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

export function subscribeToReducedMotion(callback: (matches: boolean) => void): () => void {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return () => {};
  }

  const mediaQueryList = window.matchMedia(REDUCED_MOTION_QUERY);

  function handleChange(event: MediaQueryListEvent): void {
    callback(event.matches);
  }

  mediaQueryList.addEventListener("change", handleChange);

  return () => {
    mediaQueryList.removeEventListener("change", handleChange);
  };
}

/**
 * Returns whether the user has requested reduced motion via the
 * `prefers-reduced-motion: reduce` media query.
 *
 * SSR-safe: returns `false` when `window` is unavailable. In the browser the
 * value updates live as the underlying media query changes.
 */
export function useReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState<boolean>(readReducedMotion);

  useEffect(() => {
    setReducedMotion(readReducedMotion());

    return subscribeToReducedMotion(setReducedMotion);
  }, []);

  return reducedMotion;
}
