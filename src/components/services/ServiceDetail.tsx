import Link from "next/link";
import { Accordion } from "@/components/ui/Accordion";
import { Container } from "@/components/ui/Container";
import { CTASection } from "@/components/ui/CTASection";
import { GreenBand } from "@/components/ui/GreenBand";
import { ImageGrid } from "@/components/ui/ImageGrid";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SERVICE_LINKS } from "@/lib/navigation";
import {
  serviceImageSlots,
  type ServiceContent,
} from "@/lib/services-content";

export type ServiceDetailProps = {
  service: ServiceContent;
};

export function ServiceDetail({ service }: ServiceDetailProps) {
  const images = serviceImageSlots(service.imageFolder);
  const related = SERVICE_LINKS.filter((s) =>
    service.relatedServiceSlugs.includes(s.href.replace("/services/", "")),
  );

  return (
    <>
      <PageHero
        eyebrow="Service"
        title={service.heroHeading}
        subtitle={service.heroSubheading}
        imageSrc={`/images/${service.imageFolder}/hero.jpg`}
        imageAlt={service.name}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/services" },
          { label: service.name },
        ]}
        actions={
          <>
            <MagneticButton href="/booking" variant="lime" size="lg">
              Express interest
            </MagneticButton>
            <MagneticButton href="/contact" variant="outline" size="lg">
              Contact us
            </MagneticButton>
          </>
        }
      />

      <section className="bg-white py-16 sm:py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <Reveal>
              <SectionHeading
                eyebrow="Overview"
                title={service.name}
                description={service.summary}
              />
              <p className="mt-6 text-base leading-relaxed text-muted">{service.description}</p>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="border border-border bg-surface p-6 sm:p-8">
                <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-agri">
                  Purpose
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{service.purpose}</p>
              </div>
            </Reveal>
          </div>

          <Reveal className="mt-14">
            <ImageGrid images={images} />
          </Reveal>
        </Container>
      </section>

      <GreenBand variant="forest">
        <div className="grid gap-10 lg:grid-cols-3">
          <Reveal>
            <h3 className="text-lg font-semibold text-white">Intended participants</h3>
            <ul className="mt-4 space-y-2 text-sm text-white/75">
              {service.intendedParticipants.map((item) => (
                <li key={item} className="border-l-2 border-lime pl-3">
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.06}>
            <h3 className="text-lg font-semibold text-white">Potential activities</h3>
            <ul className="mt-4 space-y-2 text-sm text-white/75">
              {service.potentialActivities.map((item) => (
                <li key={item} className="border-l-2 border-lime/70 pl-3">
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.12}>
            <h3 className="text-lg font-semibold text-white">Areas of value</h3>
            <ul className="mt-4 space-y-2 text-sm text-white/75">
              {service.valueAreas.map((item) => (
                <li key={item} className="border-l-2 border-white/40 pl-3">
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </GreenBand>

      {service.faqs.length > 0 ? (
        <section className="bg-white py-16 sm:py-20">
          <Container className="max-w-3xl">
            <SectionHeading
              eyebrow="FAQ"
              title={`Questions about ${service.name}`}
              description="Answers use careful language reflecting programmes that may evolve as partnerships confirm."
            />
            <Reveal className="mt-8">
              <Accordion items={service.faqs} />
            </Reveal>
          </Container>
        </section>
      ) : null}

      {related.length > 0 ? (
        <section className="border-t border-border bg-white py-16 sm:py-20">
          <Container>
            <SectionHeading eyebrow="Related" title="Related services" />
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item, i) => (
                <Reveal key={item.href} delay={i * 0.04}>
                  <li>
                    <Link
                      href={item.href}
                      className="block h-full border border-border bg-surface p-5 transition hover:border-agri/40 hover:bg-white"
                    >
                      <h3 className="font-semibold text-forest">{item.label}</h3>
                      <p className="mt-2 text-sm text-muted">{item.description}</p>
                    </Link>
                  </li>
                </Reveal>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}

      <CTASection
        eyebrow="Next step"
        title="Interested in this service?"
        description="Tell us about your organisation and goals. We aim to respond with relevant next steps or introductions when available."
        primaryHref="/booking"
        primaryLabel="Book a meeting"
        secondaryHref="/contact"
        secondaryLabel="Send an inquiry"
      />
    </>
  );
}

export default ServiceDetail;
