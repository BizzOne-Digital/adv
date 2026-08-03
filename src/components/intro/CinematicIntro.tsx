"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { INTRO_SEEN_KEY, SITE_ENTER_EVENT } from "@/lib/site-events";
import { cn } from "@/lib/utils";

export type CinematicIntroProps = {
  force?: boolean;
  onComplete?: () => void;
  className?: string;
};

export function CinematicIntro({ onComplete, className }: CinematicIntroProps) {
  const reduced = useReducedMotion();
  // Start visible so the hero never flashes before the intro
  const [visible, setVisible] = useState(true);
  const [phase, setPhase] = useState(0);

  const finish = useCallback(() => {
    try {
      sessionStorage.setItem(INTRO_SEEN_KEY, "1");
    } catch {
      /* ignore */
    }
    try {
      window.dispatchEvent(new Event(SITE_ENTER_EVENT));
    } catch {
      /* ignore */
    }
    setVisible(false);
    onComplete?.();
  }, [onComplete]);

  useEffect(() => {
    if (!visible || reduced) {
      if (visible && reduced) setPhase(5);
      return;
    }

    const timers = [
      window.setTimeout(() => setPhase(1), 400),
      window.setTimeout(() => setPhase(2), 1100),
      window.setTimeout(() => setPhase(3), 1900),
      window.setTimeout(() => setPhase(4), 2800),
      window.setTimeout(() => setPhase(5), 3600),
    ];

    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [visible, reduced]);

  useEffect(() => {
    if (!visible) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [visible]);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          className={cn(
            "fixed inset-0 z-[200] flex cursor-pointer flex-col items-center justify-center overflow-hidden bg-[#1a0f08] text-white",
            className,
          )}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }}
          role="dialog"
          aria-modal="true"
          aria-label="CAFBEX intro"
          onClick={finish}
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 50% 70%, #3d2414 0%, #1a0f08 55%, #0b0806 100%)",
            }}
          />

          <motion.div
            className="absolute left-1/2 top-[52%] h-4 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime"
            animate={
              phase >= 1
                ? {
                    scale: [1, 1.4, 1.1],
                    boxShadow: [
                      "0 0 0 rgba(198,255,78,0)",
                      "0 0 40px rgba(198,255,78,0.8)",
                      "0 0 24px rgba(198,255,78,0.55)",
                    ],
                  }
                : { scale: 0.4, opacity: 0.4 }
            }
            transition={{ duration: 0.9 }}
          />

          <svg
            className="pointer-events-none absolute left-1/2 top-[52%] h-[55vmin] w-[70vmin] -translate-x-1/2"
            viewBox="0 0 400 300"
            fill="none"
            aria-hidden
          >
            {[
              "M200 20 C180 80 140 120 80 180",
              "M200 20 C200 90 210 140 220 220",
              "M200 20 C230 70 280 110 340 160",
              "M200 20 C160 60 120 90 60 120",
              "M200 20 C250 55 300 80 360 100",
            ].map((d, i) => (
              <motion.path
                key={d}
                d={d}
                stroke="rgba(198,255,78,0.45)"
                strokeWidth="1.5"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={
                  phase >= 2 ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }
                }
                transition={{ duration: 0.9, delay: i * 0.06 }}
              />
            ))}

            {phase >= 3 &&
              [
                [60, 120, 340, 160],
                [80, 180, 360, 100],
                [60, 120, 220, 220],
                [340, 160, 220, 220],
              ].map(([x1, y1, x2, y2], i) => (
                <motion.line
                  key={`net-${x1}-${y1}-${x2}-${y2}-${i}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="rgba(30,107,159,0.55)"
                  strokeWidth="1"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.7, delay: i * 0.05 }}
                />
              ))}
          </svg>

          <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            viewBox="0 0 1000 600"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden
          >
            <motion.path
              d="M180 140c40-30 90-40 140-20 30 12 55 40 50 75-4 30-35 48-65 55-40 10-85 5-115-20-28-24-35-60-10-90z"
              fill="rgba(200,16,46,0.35)"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={phase >= 3 ? { opacity: 1, scale: 1 } : { opacity: 0 }}
              transition={{ duration: 0.6 }}
              style={{ transformOrigin: "240px 180px" }}
            />
            <motion.path
              d="M620 220c45-15 95-5 125 35 20 28 25 70 5 100-25 38-75 55-120 45-40-8-75-40-80-80-6-42 25-85 70-100z"
              fill="rgba(30,107,159,0.4)"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={phase >= 3 ? { opacity: 1, scale: 1 } : { opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              style={{ transformOrigin: "680px 280px" }}
            />
            <motion.path
              d="M260 190 C380 160 520 200 680 260"
              stroke="#C6FF4E"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={
                phase >= 4
                  ? { pathLength: 1, opacity: 1, filter: "drop-shadow(0 0 8px #C6FF4E)" }
                  : { pathLength: 0, opacity: 0 }
              }
              transition={{ duration: 0.85 }}
            />
          </svg>

          <div className="relative z-10 px-6 text-center">
            <motion.p
              className="text-3xl font-semibold tracking-[0.18em] sm:text-5xl sm:tracking-[0.28em] md:text-6xl"
              initial={{ opacity: 0, y: 16 }}
              animate={phase >= 5 ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              transition={{ duration: 0.55 }}
            >
              CAFBEX
            </motion.p>
            <motion.p
              className="mt-3 px-2 text-xs text-white/75 sm:mt-4 sm:text-base"
              initial={{ opacity: 0 }}
              animate={phase >= 5 ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.55, delay: 0.15 }}
            >
              Connecting Agriculture. Growing Opportunity.
            </motion.p>
          </div>

          <motion.p
            className="absolute bottom-[max(2.5rem,env(safe-area-inset-bottom))] left-0 right-0 z-20 text-center text-xs font-semibold uppercase tracking-[0.28em] text-lime/90 sm:text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.45, 1, 0.45] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          >
            Tap to enter
          </motion.p>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export default CinematicIntro;
