import { Eye, Target } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";

export type MissionVisionProps = {
  className?: string;
  mission?: string;
  vision?: string;
};

const DEFAULT_VISION =
  "To become the leading platform connecting Canadian and African farmers for sustainable agriculture, innovation, and economic prosperity.";

const DEFAULT_MISSION =
  "To build lasting partnerships between Canada and Africa through agricultural knowledge exchange, trade, investment, and technology that improve food security and create economic opportunities for farming communities.";

export function MissionVision({
  className,
  mission = DEFAULT_MISSION,
  vision = DEFAULT_VISION,
}: MissionVisionProps) {
  return (
    <section className={cn("bg-[#eaf7f0] py-12 sm:py-24", className)}>
      <Container>
        <SectionHeading
          eyebrow="Purpose"
          title="Mission & Vision"
          description="CAFBEX exists to connect agricultural communities across the Atlantic through knowledge, trade, and opportunity."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <Reveal>
            <article className="relative h-full overflow-hidden bg-forest p-5 text-white sm:p-10">
              <div
                className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full opacity-30"
                style={{ background: "radial-gradient(circle, #C6FF4E, transparent 70%)" }}
              />
              <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-full bg-lime/20 text-lime">
                <Target className="h-5 w-5" aria-hidden />
              </div>
              <h3 className="text-xl font-semibold tracking-tight">Mission</h3>
              <p className="mt-4 text-base leading-relaxed text-white/80">{mission}</p>
            </article>
          </Reveal>

          <Reveal delay={0.1}>
            <article className="relative h-full overflow-hidden bg-surface p-5 sm:p-10">
              <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-full bg-agri/10 text-agri">
                <Eye className="h-5 w-5" aria-hidden />
              </div>
              <h3 className="text-xl font-semibold tracking-tight text-forest">Vision</h3>
              <p className="mt-4 text-base leading-relaxed text-muted">{vision}</p>
            </article>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

export default MissionVision;
