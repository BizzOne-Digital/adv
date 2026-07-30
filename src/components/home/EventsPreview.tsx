import Link from "next/link";
import { ArrowUpRight, CalendarDays } from "lucide-react";
import { format } from "date-fns";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";

export type EventPreviewItem = {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  startDate: string | Date;
  location?: string;
  category?: string;
};

export type EventsPreviewProps = {
  events?: EventPreviewItem[] | null;
  className?: string;
};

export function EventsPreview({ events, className }: EventsPreviewProps) {
  const list = events?.filter(Boolean) ?? [];

  return (
    <section className={cn("bg-surface py-12 sm:py-24", className)}>
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Events"
            title="Upcoming gatherings"
            description="Conferences, forums, and exchange moments — published when confirmed."
          />
          <Link
            href="/events"
            className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold uppercase tracking-wider text-agri transition hover:text-forest"
          >
            All events
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        {list.length === 0 ? (
          <EmptyState
            className="mt-10 border border-dashed border-border bg-white"
            icon={CalendarDays}
            title="No upcoming events yet"
            description="When CAFBEX publishes confirmed events, they will appear here. In the meantime, you can inquire about participation or propose a gathering."
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
          <ul className="mt-10 grid gap-4 lg:grid-cols-3">
            {list.slice(0, 3).map((event, index) => {
              const date =
                typeof event.startDate === "string"
                  ? new Date(event.startDate)
                  : event.startDate;

              return (
                <Reveal key={event.id} delay={index * 0.05}>
                  <li>
                    <Link
                      href={`/events/${event.slug}`}
                      className="flex h-full flex-col border border-border bg-white p-6 transition hover:border-agri/40"
                    >
                      {event.category ? (
                        <span className="text-xs font-semibold uppercase tracking-wider text-agri">
                          {event.category}
                        </span>
                      ) : null}
                      <h3 className="mt-2 text-lg font-semibold text-forest">{event.title}</h3>
                      <p className="mt-2 text-sm text-muted">
                        {format(date, "MMM d, yyyy")}
                        {event.location ? ` · ${event.location}` : ""}
                      </p>
                      {event.summary ? (
                        <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-muted">
                          {event.summary}
                        </p>
                      ) : null}
                    </Link>
                  </li>
                </Reveal>
              );
            })}
          </ul>
        )}
      </Container>
    </section>
  );
}

export default EventsPreview;
