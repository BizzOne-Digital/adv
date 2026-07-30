import {
  ArrowUpRight,
  Building2,
  FlaskConical,
  GraduationCap,
  HandCoins,
  Mic2,
  Presentation,
  Ship,
  Tractor,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";

const ACTIVITIES: { title: string; icon: LucideIcon }[] = [
  { title: "International conferences", icon: Mic2 },
  { title: "Workshops", icon: Presentation },
  { title: "Farm visits", icon: Tractor },
  { title: "Technology demonstrations", icon: FlaskConical },
  { title: "Agricultural exhibitions", icon: Building2 },
  { title: "Trade fairs", icon: Ship },
  { title: "B2B networking", icon: UsersRound },
  { title: "Investment forums", icon: HandCoins },
  { title: "Innovation, marketing, and export training", icon: GraduationCap },
];

export type ActivitiesPreviewProps = {
  className?: string;
};

export function ActivitiesPreview({ className }: ActivitiesPreviewProps) {
  return (
    <section className={cn("bg-forest py-12 text-white sm:py-24", className)}>
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Activities"
            title="Formats designed for exchange"
            description="CAFBEX activities may include conferences, field learning, trade platforms, and training that bring Canadian and African agricultural stakeholders together."
            tone="inverse"
          />
          <Link
            href="/activities"
            className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold uppercase tracking-wider text-lime transition hover:text-white"
          >
            View activities
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ACTIVITIES.map((item, index) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.title} delay={index * 0.03}>
                <li className="flex items-center gap-4 border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-sm transition hover:border-lime/40 hover:bg-white/10">
                  <Icon className="h-5 w-5 shrink-0 text-lime" aria-hidden />
                  <span className="text-sm font-medium">{item.title}</span>
                </li>
              </Reveal>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}

export default ActivitiesPreview;
