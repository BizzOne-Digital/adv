"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

export type ConnectionMapProps = {
  className?: string;
};

/**
 * Conceptual Canada–Africa connection visualization.
 * Intentionally omits fabricated offices, partner counts, and trade statistics.
 */
export function ConnectionMap({ className }: ConnectionMapProps) {
  const reduced = useReducedMotion();

  return (
    <section className={cn("relative overflow-hidden bg-surface py-12 sm:py-24", className)}>
      <Container>
        <SectionHeading
          eyebrow="Connection"
          title="A bridge across the Atlantic"
          description="CAFBEX is a conceptual exchange corridor between Canadian and African agricultural communities — focused on relationships, knowledge, and opportunity."
          align="center"
        />

        <Reveal className="mt-12">
          <div className="relative mx-auto aspect-[4/3] max-w-5xl overflow-hidden bg-forest sm:aspect-[16/9]">
            <div
              className="absolute inset-0 opacity-50"
              style={{
                background:
                  "radial-gradient(ellipse at 25% 40%, rgba(200,16,46,0.35), transparent 40%), radial-gradient(ellipse at 75% 55%, rgba(30,107,159,0.4), transparent 42%), radial-gradient(ellipse at 50% 100%, rgba(198,255,78,0.12), transparent 50%)",
              }}
            />

            <svg
              viewBox="0 0 800 450"
              className="absolute inset-0 h-full w-full"
              aria-hidden
            >
              {/* Abstract Canada */}
              <motion.path
                d="M120 140c50-45 120-55 180-25 35 18 60 55 50 95-8 35-45 58-85 65-55 10-115 0-150-35-32-32-28-72 5-100z"
                fill="rgba(200,16,46,0.45)"
                initial={reduced ? false : { opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              />
              {/* Abstract Africa */}
              <motion.path
                d="M520 160c55-20 120-5 155 45 28 40 30 100 0 145-35 52-105 75-165 55-55-18-95-70-95-125 0-55 40-100 105-120z"
                fill="rgba(30,107,159,0.5)"
                initial={reduced ? false : { opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.15 }}
              />

              {/* Route glow */}
              <motion.path
                d="M220 200 C340 150 460 220 600 250"
                fill="none"
                stroke="#C6FF4E"
                strokeWidth="2.5"
                strokeLinecap="round"
                initial={reduced ? false : { pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.4, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
                style={{ filter: "drop-shadow(0 0 6px rgba(198,255,78,0.8))" }}
              />

              {/* Nodes */}
              <motion.circle
                cx="220"
                cy="200"
                r="7"
                fill="#C6FF4E"
                initial={reduced ? false : { scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
              />
              <motion.circle
                cx="600"
                cy="250"
                r="7"
                fill="#C6FF4E"
                initial={reduced ? false : { scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 1.2 }}
              />

              {/* Subtle network dashes */}
              {[
                "M200 240 C300 280 420 260 580 290",
                "M240 170 C360 120 480 180 590 220",
              ].map((d, i) => (
                <motion.path
                  key={d}
                  d={d}
                  fill="none"
                  stroke="rgba(255,255,255,0.25)"
                  strokeWidth="1"
                  strokeDasharray="4 8"
                  initial={reduced ? false : { pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, delay: 0.6 + i * 0.15 }}
                />
              ))}
            </svg>

            <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-1 p-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/80 sm:flex-row sm:justify-between sm:gap-4 sm:p-6 sm:text-xs sm:tracking-[0.18em]">
              <span>Canada</span>
              <span className="hidden text-lime sm:inline">Exchange corridor</span>
              <span className="text-lime sm:hidden">Exchange</span>
              <span>Africa</span>
            </div>
          </div>
        </Reveal>

        <p className="mx-auto mt-6 max-w-2xl text-center text-sm text-muted">
          This map is illustrative. It does not represent offices, active partner locations, or
          verified trade volumes.
        </p>
      </Container>
    </section>
  );
}

export default ConnectionMap;
