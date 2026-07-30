import { CTASection } from "@/components/ui/CTASection";
import { cn } from "@/lib/utils";

export type FinalCTAProps = {
  className?: string;
};

export function FinalCTA({ className }: FinalCTAProps) {
  return (
    <CTASection
      className={cn(className)}
      tone="forest"
      eyebrow="Join the exchange"
      title="Connect. Participate. Grow opportunity."
      description="Whether you are a farmer, agribusiness, investor, researcher, or policymaker — CAFBEX welcomes dialogue that advances Canada–Africa agricultural partnership."
      primaryHref="/booking"
      primaryLabel="Book a Meeting"
      secondaryHref="/contact"
      secondaryLabel="Contact CAFBEX"
    />
  );
}

export default FinalCTA;
