import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { Container } from "@/components/ui/Container";
import { CTASection } from "@/components/ui/CTASection";
import { ImageGrid } from "@/components/ui/ImageGrid";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { RichText } from "@/components/ui/RichText";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getEventBySlug } from "@/lib/data";
import { buildMetadata, pageImages } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) return buildMetadata({ title: "Event", path: `/events/${slug}`, noIndex: true });
  return buildMetadata({
    title: event.seo?.title || event.title,
    description: event.seo?.description || event.summary,
    path: `/events/${slug}`,
    ogImage: event.seo?.ogImage || event.images?.[0]?.url,
  });
}

export default async function EventDetailPage({ params }: Props) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) notFound();

  const images = pageImages("events", [
    event.title,
    "Event atmosphere",
    "Participants",
    "Session",
    "Venue",
  ]);

  return (
    <>
      <PageHero
        eyebrow={event.category || "Event"}
        title={event.title}
        subtitle={event.summary}
        imageSrc={event.images?.[0]?.url || `/images/events/${event.slug}/hero.jpg`}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Events", href: "/events" },
          { label: event.title },
        ]}
        actions={
          event.registrationUrl ? (
            <MagneticButton href={event.registrationUrl} variant="lime" size="lg">
              Register
            </MagneticButton>
          ) : (
            <MagneticButton href="/booking" variant="lime" size="lg">
              Inquire about this event
            </MagneticButton>
          )
        }
      />

      <section className="bg-white py-16 sm:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <Reveal>
              <RichText html={event.description} />
            </Reveal>
            <Reveal delay={0.08}>
              <aside className="space-y-4 border border-border bg-surface p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-agri">Details</p>
                <dl className="space-y-3 text-sm text-muted">
                  <div>
                    <dt className="font-medium text-forest">Date</dt>
                    <dd>{format(new Date(event.startDate), "MMMM d, yyyy")}</dd>
                  </div>
                  {event.location ? (
                    <div>
                      <dt className="font-medium text-forest">Location</dt>
                      <dd>{event.location}</dd>
                    </div>
                  ) : null}
                  {event.venue ? (
                    <div>
                      <dt className="font-medium text-forest">Venue</dt>
                      <dd>{event.venue}</dd>
                    </div>
                  ) : null}
                  {event.timezone ? (
                    <div>
                      <dt className="font-medium text-forest">Time zone</dt>
                      <dd>{event.timezone}</dd>
                    </div>
                  ) : null}
                </dl>
              </aside>
            </Reveal>
          </div>

          {event.images && event.images.length > 0 ? (
            <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {event.images.slice(0, 5).map((img) => (
                <ImagePlaceholder
                  key={img.url}
                  src={img.url}
                  alt={img.alt || event.title}
                  label={img.caption || "event image"}
                  className="aspect-[4/3]"
                />
              ))}
            </div>
          ) : (
            <Reveal className="mt-12">
              <ImageGrid images={images} />
            </Reveal>
          )}

          {event.agenda && event.agenda.length > 0 ? (
            <div className="mt-14">
              <SectionHeading title="Agenda" />
              <ul className="mt-6 space-y-3">
                {event.agenda.map((item, i) => (
                  <li key={`${item.title}-${i}`} className="border border-border p-4">
                    <p className="text-xs text-agri">{item.time}</p>
                    <h3 className="font-semibold text-forest">{item.title}</h3>
                    {item.description ? (
                      <p className="mt-1 text-sm text-muted">{item.description}</p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {event.speakers && event.speakers.length > 0 ? (
            <div className="mt-14">
              <SectionHeading title="Speakers" />
              <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {event.speakers.map((speaker) => (
                  <li key={speaker.name} className="border border-border bg-surface p-5">
                    <h3 className="font-semibold text-forest">{speaker.name}</h3>
                    <p className="mt-1 text-sm text-muted">
                      {[speaker.role, speaker.organization].filter(Boolean).join(" · ")}
                    </p>
                    {speaker.bio ? (
                      <p className="mt-2 text-sm text-muted">{speaker.bio}</p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <p className="mt-10 text-sm text-muted">
            <Link href="/events" className="text-agri hover:text-forest">
              ← Back to events
            </Link>
          </p>
        </Container>
      </section>

      <CTASection title="Questions about this event?" description="Reach out for participation or partnership details." />
    </>
  );
}
