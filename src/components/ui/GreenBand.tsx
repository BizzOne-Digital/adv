import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";

export type GreenBandProps = {
  children: ReactNode;
  className?: string;
  /** Soft mint vs deep forest */
  variant?: "soft" | "forest" | "agri";
  id?: string;
};

/**
 * Brand-green section wrapper used across pages for visual rhythm.
 */
export function GreenBand({
  children,
  className,
  variant = "forest",
  id,
}: GreenBandProps) {
  const variants = {
    soft: "bg-[#eaf7f0] text-forest",
    forest: "bg-forest text-white",
    agri: "bg-agri text-white",
  } as const;

  return (
    <section
      id={id}
      className={cn(
        "relative overflow-hidden py-12 sm:py-20",
        variants[variant],
        className,
      )}
    >
      {variant !== "soft" ? (
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          aria-hidden
          style={{
            background:
              "radial-gradient(ellipse at 85% 15%, rgba(198,255,78,0.22), transparent 42%), radial-gradient(ellipse at 10% 90%, rgba(30,107,159,0.28), transparent 40%)",
          }}
        />
      ) : (
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          aria-hidden
          style={{
            background:
              "radial-gradient(ellipse at 90% 10%, rgba(198,255,78,0.35), transparent 40%), radial-gradient(ellipse at 5% 80%, rgba(27,107,69,0.12), transparent 45%)",
          }}
        />
      )}
      <Container className="relative">{children}</Container>
    </section>
  );
}

export default GreenBand;
