"use client";

import { useEffect, useState } from "react";

/**
 * Tracks prefers-reduced-motion. Safe for SSR (defaults to false until mounted).
 * GSAP/Framer consumers should gate timelines with this hook.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();

    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return reduced;
}

export default useReducedMotion;
