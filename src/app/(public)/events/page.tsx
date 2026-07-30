import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { format } from "date-fns";
import { Container } from "@/components/ui/Container";
import { CTASection } from "@/components/ui/CTASection";
import { EmptyState } from "@/components/ui/EmptyState";
import { ImageGrid } from "@/components/ui/ImageGrid";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getEvents, getPastEvents } from "@/lib/data";
import { buildMetadata, pageImages } from "@/lib/seo";
import { idString } from "@/lib/serialize";

export const metadata: Metadata = buildMetadata({
  title: "Events",
  description:
    "Upcoming and past CAFBEX events. Confirmed gatherings are published here — we do not invent event listings.",
  path: "/events",
});

export default async function EventsPage() {
  const [upcoming, past] = await Promise.all([
    getEvents({ upcomingOnly: true }),
    getPastEvents(12),
  ]);
  const images = pageImages("events");

  return (
    <>
      <PageHero
        eyebrow="Events"
        title="Gatherings that move agriculture forward"
        subtitle="Conferences, forums, and exchange moments — listed only when published and confirmed."
        imageSrc="/images/events/hero.jpg"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Events" }]}
      />

      <section className="bg-white py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="Upcoming" title="Upcoming events" />
          {upcoming.length === 0 ? (
            <EmptyState
              className="mt-10 border border-dashed border-border bg-surface"
              icon={CalendarDays}
              title="No upcoming events published"
              description="When CAFBEX confirms and publishes events, they will appear here with dates, locations, and registration details."
              action={
                <Link
                  href="/booking"
                  className="inline-flex rounded-full bg-forest px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white"
                >
                  Inquire about events
                </Link>
              }
            />
          ) : (
            <ul className="mt-10 grid gap-5 lg:grid-cols-3">
              {upcoming.map((event, i) => (
                <Reveal key={idString(event)} delay={i * 0.05}>
                  <li>
                    <Link
                      href={`/events/${event.slug}`}
                      className="flex h-full flex-col overflow-hidden border border-border transition hover:border-agri/40"
                    >
                      <ImagePlaceholder
                        src={event.images?.[0]?.url || `/images/events/${event.slug}.jpg`}
                        alt={event.title}
                        className="aspect-[16/10]"
                      />
                      <div className="flex flex-1 flex-col p-5">
                        {event.category ? (
                          <span className="text-xs font-semibold uppercase tracking-wider text-agri">
                            {event.category}
                          </span>
                        ) : null}
                        <h3 className="mt-2 text-lg font-semibold text-forest">{event.title}</h3>
                        <p className="mt-2 text-sm text-muted">
                          {format(new Date(event.startDate), "MMM d, yyyy")}
                          {event.location ? ` · ${event.location}` : ""}
                        </p>
                        <p className="mt-3 line-clamp-3 text-sm text-muted">{event.summary}</p>
                      </div>
                    </Link>
                  </li>
                </Reveal>
              ))}
            </ul>
          )}

          <Reveal className="mt-14">
            <ImageGrid images={images} />
          </Reveal>
        </Container>
      </section>

      {past.length > 0 ? (
        <section className="bg-surface py-16 sm:py-20">
          <Container>
            <SectionHeading eyebrow="Archive" title="Past events" />
            <ul className="mt-8 space-y-3">
              {past.map((event) => (
                <li key={idString(event)}>
                  <Link
                    href={`/events/${event.slug}`}
                    className="flex flex-col gap-1 border border-border bg-white px-5 py-4 transition hover:border-agri/40 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <span className="font-medium text-forest">{event.title}</span>
                    <span className="text-sm text-muted">
                      {format(new Date(event.startDate), "MMM d, yyyy")}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}

      <CTASection
        title="Want to participate or host?"
        description="Event participation, exhibition, and partnership inquiries are welcome."
        primaryHref="/booking"
        primaryLabel="Event inquiry"
      />
    </>
  );
}
