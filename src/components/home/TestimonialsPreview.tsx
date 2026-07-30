import { Quote } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";

export type TestimonialItem = {
  id: string;
  quote: string;
  authorName: string;
  authorRole?: string;
  organization?: string;
  /** When true, shows a visible sample-content label — never present as a genuine endorsement */
  isSample?: boolean;
};

export type TestimonialsPreviewProps = {
  testimonials?: TestimonialItem[] | null;
  className?: string;
};

export function TestimonialsPreview({ testimonials, className }: TestimonialsPreviewProps) {
  const list = testimonials?.filter(Boolean) ?? [];

  return (
    <section className={cn("bg-white py-12 sm:py-24", className)}>
      <Container>
        <SectionHeading
          eyebrow="Voices"
          title="What participants say"
          description="Published testimonials appear here. Sample seed content is always labelled and is not a genuine endorsement."
          align="center"
        />

        {list.length === 0 ? (
          <EmptyState
            className="mt-10 border border-dashed border-border bg-surface"
            icon={Quote}
            title="No published testimonials yet"
            description="Authentic participant reflections will be shown once reviewed and published by CAFBEX."
          />
        ) : (
          <ul className="mx-auto mt-12 grid max-w-5xl gap-5 lg:grid-cols-3">
            {list.slice(0, 3).map((item, index) => (
              <Reveal key={item.id} delay={index * 0.06}>
                <li className="relative flex h-full flex-col border border-border bg-surface p-6">
                  {item.isSample ? (
                    <span className="mb-3 inline-flex w-fit rounded-full bg-wheat/30 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-soil">
                      Sample content — not a verified endorsement
                    </span>
                  ) : null}
                  <Quote className="h-5 w-5 text-agri/50" aria-hidden />
                  <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-foreground/85">
                    “{item.quote}”
                  </blockquote>
                  <footer className="mt-5 border-t border-border pt-4">
                    <p className="text-sm font-semibold text-forest">{item.authorName}</p>
                    {(item.authorRole || item.organization) && (
                      <p className="mt-0.5 text-xs text-muted">
                        {[item.authorRole, item.organization].filter(Boolean).join(" · ")}
                      </p>
                    )}
                  </footer>
                </li>
              </Reveal>
            ))}
          </ul>
        )}
      </Container>
    </section>
  );
}

export default TestimonialsPreview;
