"use client";

import {
  useCallback,
  useEffect,
  useRef,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export type UseMagneticOptions = {
  /** Max pixel displacement from center. Default 12. */
  strength?: number;
  /** Ease factor 0–1 for lerp toward target. Default 0.18. */
  ease?: number;
  /** Disable magnetic effect. */
  disabled?: boolean;
};

export type UseMagneticResult<T extends HTMLElement> = {
  onPointerMove: (event: ReactPointerEvent<T>) => void;
  onPointerLeave: () => void;
};

/**
 * Magnetic hover offset for buttons/CTAs.
 * Mutates `ref.current.style.transform` directly (no render-phase ref reads).
 */
export function useMagnetic<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T | null>,
  options: UseMagneticOptions = {},
): UseMagneticResult<T> {
  const { strength = 12, ease = 0.18, disabled = false } = options;
  const reduced = useReducedMotion();
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const raf = useRef<number | null>(null);
  const opts = useRef({ strength, ease, disabled, reduced });

  useEffect(() => {
    opts.current = { strength, ease, disabled, reduced };
  }, [strength, ease, disabled, reduced]);

  const start = useCallback(() => {
    if (raf.current != null) return;

    const tick = () => {
      const { ease: e } = opts.current;
      current.current.x += (target.current.x - current.current.x) * e;
      current.current.y += (target.current.y - current.current.y) * e;

      const el = ref.current;
      if (el) {
        el.style.transform = `translate3d(${current.current.x}px, ${current.current.y}px, 0)`;
        el.style.willChange = "transform";
      }

      if (
        Math.abs(target.current.x - current.current.x) > 0.05 ||
        Math.abs(target.current.y - current.current.y) > 0.05
      ) {
        raf.current = requestAnimationFrame(tick);
      } else {
        raf.current = null;
      }
    };

    raf.current = requestAnimationFrame(tick);
  }, [ref]);

  const onPointerMove = useCallback(
    (event: ReactPointerEvent<T>) => {
      const { disabled: d, reduced: r, strength: s } = opts.current;
      if (d || r) return;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const relX = event.clientX - rect.left - rect.width / 2;
      const relY = event.clientY - rect.top - rect.height / 2;
      target.current = {
        x: (relX / (rect.width / 2)) * s,
        y: (relY / (rect.height / 2)) * s,
      };
      start();
    },
    [ref, start],
  );

  const onPointerLeave = useCallback(() => {
    target.current = { x: 0, y: 0 };
    start();
  }, [start]);

  useEffect(() => {
    return () => {
      if (raf.current != null) cancelAnimationFrame(raf.current);
    };
  }, []);

  return {
    onPointerMove,
    onPointerLeave,
  };
}

export default useMagnetic;
