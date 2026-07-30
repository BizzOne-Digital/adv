import {
  Briefcase,
  Cpu,
  FlaskConical,
  Landmark,
  Leaf,
  Scale,
  Ship,
  Users,
  Venus,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";

const AUDIENCES: { label: string; icon: LucideIcon }[] = [
  { label: "Farmers", icon: Leaf },
  { label: "Agribusinesses", icon: Briefcase },
  { label: "Investors", icon: Landmark },
  { label: "Researchers", icon: FlaskConical },
  { label: "Policymakers", icon: Scale },
  { label: "Youth", icon: Users },
  { label: "Women entrepreneurs", icon: Venus },
  { label: "Exporters", icon: Ship },
  { label: "Technology providers", icon: Cpu },
];

export type WhoWeConnectProps = {
  className?: string;
};

export function WhoWeConnect({ className }: WhoWeConnectProps) {
  return (
    <section className={cn("relative overflow-hidden bg-[#eaf7f0] py-12 sm:py-24", className)}>
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse at 90% 0%, rgba(198,255,78,0.35), transparent 40%), radial-gradient(ellipse at 0% 100%, rgba(27,107,69,0.12), transparent 45%)",
        }}
      />
      <Container className="relative">
        <SectionHeading
          eyebrow="Community"
          title="Who CAFBEX connects"
          description="A cross-sector network spanning producers, enterprises, research, policy, and technology."
          align="center"
        />

        <ul className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {AUDIENCES.map((item, index) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.label} delay={index * 0.03}>
                <li className="flex min-w-0 items-center gap-3 border border-forest/10 bg-white/80 px-4 py-4 shadow-sm shadow-forest/5 transition hover:border-agri/35 hover:bg-white">
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-forest/8 text-agri">
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                  <span className="min-w-0 text-sm font-medium leading-snug text-forest">
                    {item.label}
                  </span>
                </li>
              </Reveal>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}

export default WhoWeConnect;
