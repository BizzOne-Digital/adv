import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SERVICE_LINKS } from "@/lib/navigation";
import { cn } from "@/lib/utils";

export type ServicesPreviewProps = {
  className?: string;
};

export function ServicesPreview({ className }: ServicesPreviewProps) {
  return (
    <section className={cn("bg-[#f3faf6] py-12 sm:py-24", className)}>
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Services"
            title="Eight pathways for agricultural exchange"
            description="Each service area has a dedicated page outlining purpose, participants, and how to express interest."
          />
          <Link
            href="/services"
            className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold uppercase tracking-wider text-agri transition hover:text-forest"
          >
            All services
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICE_LINKS.map((service, index) => {
            const slug = service.href.replace("/services/", "");
            return (
            <Reveal key={service.href} delay={index * 0.04}>
              <Link
                href={service.href}
                className="group flex h-full flex-col overflow-hidden border border-forest/10 bg-white shadow-sm shadow-forest/5 transition hover:border-agri/40 hover:shadow-md"
              >
                <ImagePlaceholder
                  src={`/images/services/${slug}/01.jpg`}
                  alt={service.label}
                  label={`services/${slug}/01.jpg`}
                  className="aspect-[16/10]"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-base font-semibold text-forest group-hover:text-agri">
                    {service.label}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                    {service.description}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-agri">
                    Learn more
                    <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </Link>
            </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

export default ServicesPreview;
