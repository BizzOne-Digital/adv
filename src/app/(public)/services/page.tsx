import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CTASection } from "@/components/ui/CTASection";
import { GreenBand } from "@/components/ui/GreenBand";
import { ImageGrid } from "@/components/ui/ImageGrid";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getPublishedServices } from "@/lib/data";
import { SERVICE_LINKS } from "@/lib/navigation";
import { buildMetadata, pageImages } from "@/lib/seo";
import { getAllStaticServices } from "@/lib/services-content";

export const metadata: Metadata = buildMetadata({
  title: "Services",
  description:
    "Eight CAFBEX service pathways for farmer connections, trade, technology, networking, and sustainable agriculture.",
  path: "/services",
});

export default async function ServicesPage() {
  const dbServices = await getPublishedServices();
  const staticServices = getAllStaticServices();
  const services =
    dbServices.length > 0
      ? dbServices.map((s) => ({
          name: s.name,
          href: `/services/${s.slug}`,
          summary: s.summary,
          slug: s.slug,
        }))
      : staticServices.map((s) => ({
          name: s.name,
          href: `/services/${s.slug}`,
          summary: s.summary,
          slug: s.slug,
        }));

  const images = pageImages("services", [
    "Service overview landscape",
    "Farmers in dialogue",
    "Technology demonstration",
    "Networking session",
    "Sustainable agriculture field",
  ]);

  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Eight pathways for agricultural exchange"
        subtitle="Each service area outlines purpose, participants, and how to express interest — using careful language for programmes that may evolve."
        imageSrc="/images/services/hero.jpg"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Services" }]}
      />

      <GreenBand variant="soft">
        <SectionHeading
          eyebrow="Overview"
          title="How CAFBEX can support you"
          description="Explore dedicated pages for each focus area. Content aims to inform — it does not invent confirmed programmes or outcomes."
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => (
            <Reveal key={service.href} delay={index * 0.04}>
              <Link
                href={service.href}
                className="group flex h-full flex-col overflow-hidden border border-border bg-white transition hover:border-agri/40"
              >
                <ImagePlaceholder
                  src={`/images/services/${service.slug}/01.jpg`}
                  alt={service.name}
                  className="aspect-[16/10]"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-base font-semibold text-forest group-hover:text-agri">
                    {service.name}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                    {service.summary}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-agri">
                    Learn more
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-14">
          <ImageGrid images={images} />
        </Reveal>

        {SERVICE_LINKS.length === 0 ? null : (
          <p className="mt-8 text-center text-sm text-muted">
            Prefer a conversation first?{" "}
            <Link href="/booking" className="font-semibold text-agri hover:text-forest">
              Book a meeting
            </Link>
            .
          </p>
        )}
      </GreenBand>

      <CTASection
        title="Not sure which service fits?"
        description="Share your goals and we will help point you toward the most relevant pathway."
      />
    </>
  );
}
