import type { Metadata } from "next";
import { Quote } from "lucide-react";
import { CTASection } from "@/components/ui/CTASection";
import { EmptyState } from "@/components/ui/EmptyState";
import { GreenBand } from "@/components/ui/GreenBand";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getApprovedTestimonials } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import { idString } from "@/lib/serialize";

export const metadata: Metadata = buildMetadata({
  title: "Testimonials",
  description:
    "Approved participant reflections from the CAFBEX community. Sample content is always labelled.",
  path: "/testimonials",
});

export default async function TestimonialsPage() {
  const testimonials = await getApprovedTestimonials();

  return (
    <>
      <PageHero
        eyebrow="Voices"
        title="What participants say"
        subtitle="Only approved testimonials are shown publicly. Sample seed content is labelled and is not a verified endorsement."
        showImage={false}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Testimonials" }]}
      />

      <GreenBand variant="soft">
        <SectionHeading
          align="center"
          eyebrow="Approved"
          title="Published reflections"
          description="Authentic voices appear after review."
        />

        {testimonials.length === 0 ? (
          <EmptyState
            className="mt-10 border border-dashed border-border bg-white"
            icon={Quote}
            title="No approved testimonials yet"
            description="Participant reflections will be shown once reviewed and published by CAFBEX."
          />
        ) : (
          <ul className="mx-auto mt-12 grid max-w-5xl gap-5 lg:grid-cols-2">
            {testimonials.map((t, i) => (
              <Reveal key={idString(t)} delay={i * 0.05}>
                <li className="relative border border-border bg-white p-6 sm:p-8">
                  {t.isSample ? (
                    <span className="mb-3 inline-flex rounded-full bg-wheat/30 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-soil">
                      Sample content — not a verified endorsement
                    </span>
                  ) : null}
                  <Quote className="mb-4 h-6 w-6 text-agri/40" aria-hidden />
                  <blockquote className="text-base leading-relaxed text-forest">
                    “{t.quote}”
                  </blockquote>
                  <p className="mt-4 text-sm font-semibold text-forest">{t.name}</p>
                  <p className="text-sm text-muted">
                    {[t.role, t.organization, t.country].filter(Boolean).join(" · ")}
                  </p>
                </li>
              </Reveal>
            ))}
          </ul>
        )}
      </GreenBand>

      <CTASection
        title="Share your CAFBEX experience"
        description="If you have participated in a CAFBEX activity, we welcome thoughtful reflections for review."
        primaryHref="/contact"
        primaryLabel="Submit a reflection"
      />
    </>
  );
}
