import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { cn } from "@/lib/utils";

export type CTASectionProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  children?: ReactNode;
  className?: string;
  tone?: "forest" | "lime" | "surface";
};

export function CTASection({
  eyebrow,
  title,
  description,
  primaryHref = "/booking",
  primaryLabel = "Book a Meeting",
  secondaryHref = "/contact",
  secondaryLabel = "Contact Us",
  children,
  className,
  tone = "forest",
}: CTASectionProps) {
  const tones = {
    forest: "bg-forest text-white",
    lime: "bg-lime text-forest",
    surface: "bg-surface text-forest",
  } as const;

  return (
    <section className={cn("relative overflow-hidden py-12 sm:py-20", tones[tone], className)}>
      {tone === "forest" ? (
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(ellipse at 80% 20%, rgba(198,255,78,0.2), transparent 45%), radial-gradient(ellipse at 10% 90%, rgba(30,107,159,0.3), transparent 40%)",
          }}
        />
      ) : null}

      <Container className="relative text-center">
        {eyebrow ? (
          <p
            className={cn(
              "mb-3 text-xs font-semibold uppercase tracking-[0.22em]",
              tone === "forest" ? "text-lime" : "text-agri",
            )}
          >
            {eyebrow}
          </p>
        ) : null}
        <h2 className="mx-auto max-w-2xl text-2xl font-semibold tracking-tight sm:text-4xl">
          {title}
        </h2>
        {description ? (
          <p
            className={cn(
              "mx-auto mt-3 max-w-xl text-sm leading-relaxed sm:mt-4 sm:text-base",
              tone === "forest" ? "text-white/75" : "text-muted",
            )}
          >
            {description}
          </p>
        ) : null}

        <div className="mobile-cta-stack mt-6 flex flex-col items-stretch justify-center gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center">
          <MagneticButton
            href={primaryHref}
            variant={tone === "lime" ? "primary" : "lime"}
            size="lg"
            className="w-full sm:w-auto"
          >
            {primaryLabel}
          </MagneticButton>
          {secondaryHref && secondaryLabel ? (
            <MagneticButton
              href={secondaryHref}
              variant={tone === "forest" ? "outline" : "outline"}
              size="lg"
              className={cn(
                "w-full sm:w-auto",
                tone === "forest"
                  ? "border-white/30 bg-transparent text-white hover:bg-white/10"
                  : undefined,
              )}
            >
              {secondaryLabel}
            </MagneticButton>
          ) : null}
        </div>
        {children}
      </Container>
    </section>
  );
}

export default CTASection;
