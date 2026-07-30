import {
  Handshake,
  Leaf,
  Network,
  Package,
  Sprout,
  TrendingUp,
  Users,
  Wheat,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";

const OBJECTIVES: { title: string; icon: LucideIcon }[] = [
  { title: "Connect Canadian and African farmers", icon: Handshake },
  { title: "Promote agricultural trade and investment", icon: TrendingUp },
  { title: "Showcase modern farming technologies", icon: Sprout },
  { title: "Facilitate business networking and partnerships", icon: Network },
  { title: "Encourage value addition and food processing", icon: Package },
  { title: "Support youth and women in agribusiness", icon: Users },
  { title: "Create export and import opportunities", icon: Wheat },
  {
    title: "Share best practices in sustainable and climate-smart agriculture",
    icon: Leaf,
  },
];

export type ObjectivesProps = {
  className?: string;
};

export function Objectives({ className }: ObjectivesProps) {
  return (
    <section className={cn("relative overflow-hidden bg-forest py-12 text-white sm:py-24", className)}>
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse at 80% 10%, rgba(198,255,78,0.25), transparent 40%), radial-gradient(ellipse at 10% 90%, rgba(30,107,159,0.3), transparent 40%)",
        }}
      />
      <Container className="relative">
        <SectionHeading
          tone="inverse"
          eyebrow="Objectives"
          title="What CAFBEX aims to advance"
          description="Eight interconnected priorities guide how we design programs, partnerships, and exchange opportunities."
        />

        <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {OBJECTIVES.map((item, index) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.title} delay={index * 0.04}>
                <li className="flex h-full flex-col gap-4 border border-white/15 bg-white/5 p-5 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold tabular-nums text-lime">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <Icon className="h-5 w-5 text-lime" aria-hidden />
                  </div>
                  <p className="text-sm font-medium leading-snug text-white">{item.title}</p>
                </li>
              </Reveal>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}

export default Objectives;
