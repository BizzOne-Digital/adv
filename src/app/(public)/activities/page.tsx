import type { Metadata } from "next";
import {
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
import { CTASection } from "@/components/ui/CTASection";
import { EmptyState } from "@/components/ui/EmptyState";
import { GreenBand } from "@/components/ui/GreenBand";
import { ImageGrid } from "@/components/ui/ImageGrid";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getActivities } from "@/lib/data";
import { buildMetadata, pageImages } from "@/lib/seo";
import { formatDate, cn } from "@/lib/utils";
import { idString } from "@/lib/serialize";

export const metadata: Metadata = buildMetadata({
  title: "Activities",
  description:
    "CAFBEX activity formats — conferences, farm visits, exhibitions, training, and networking.",
  path: "/activities",
});

const ACTIVITY_TYPES: { title: string; description: string; icon: LucideIcon }[] = [
  {
    title: "International conferences & workshops",
    description: "Convenings that may bring practitioners together for dialogue and learning.",
    icon: Mic2,
  },
  {
    title: "Farm visits",
    description: "Field visits designed to share practical production experience.",
    icon: Tractor,
  },
  {
    title: "Technology demonstrations",
    description: "Showcases that may introduce tools and climate-smart approaches.",
    icon: FlaskConical,
  },
  {
    title: "Agricultural exhibitions",
    description: "Exhibition formats for products, innovations, and partnerships.",
    icon: Building2,
  },
  {
    title: "Trade fairs",
    description: "Trade-oriented gatherings that may support market conversations.",
    icon: Ship,
  },
  {
    title: "B2B networking sessions",
    description: "Structured networking for agribusiness relationship-building.",
    icon: UsersRound,
  },
  {
    title: "Investment forums",
    description: "Dialogue spaces for responsible investment conversations.",
    icon: HandCoins,
  },
  {
    title: "Innovation, marketing & export training",
    description: "Learning sessions that may cover innovation, marketing, and export procedures.",
    icon: GraduationCap,
  },
  {
    title: "Workshop programmes",
    description: "Focused workshops tailored to sector themes when scheduled.",
    icon: Presentation,
  },
];

export default async function ActivitiesPage() {
  const activities = await getActivities();
  const images = pageImages("activities");

  return (
    <>
      <PageHero
        eyebrow="Activities"
        title="Formats that bring agriculture together"
        subtitle="CAFBEX aims to host and facilitate a range of activity types. Published activities appear below when available."
        imageSrc="/images/activities/hero.jpg"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Activities" }]}
      />

      <section className="bg-white py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Activity types"
            title="What activities may include"
            description="These formats describe the kinds of gatherings CAFBEX is designed to support — not a fixed calendar of confirmed events."
          />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ACTIVITY_TYPES.map((item, i) => {
              const Icon = item.icon;
              return (
                <Reveal key={item.title} delay={i * 0.03}>
                  <li className="border border-border bg-surface p-5">
                    <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-agri/10 text-agri">
                      <Icon className="h-5 w-5" aria-hidden />
                    </div>
                    <h3 className="font-semibold text-forest">{item.title}</h3>
                    <p className="mt-2 text-sm text-muted">{item.description}</p>
                  </li>
                </Reveal>
              );
            })}
          </ul>

          <Reveal className="mt-14">
            <ImageGrid images={images} />
          </Reveal>
        </Container>
      </section>

      <GreenBand variant="forest">
        <SectionHeading
          tone="inverse"
          eyebrow="Published"
          title="Active activities"
          description="Administrators publish individual activities with details, audience, and registration status."
        />
        {activities.length === 0 ? (
          <EmptyState
            className="mt-10 border border-dashed border-white/30 bg-white"
            title="No published activities yet"
            description="When CAFBEX publishes specific activities, they will appear here with dates and participation details."
            action={
              <Link
                href="/booking"
                className="inline-flex rounded-full bg-lime px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-forest"
              >
                Inquire about activities
              </Link>
            }
          />
        ) : (
          <ul className="mt-10 grid gap-4 lg:grid-cols-2">
            {activities.map((activity, i) => (
              <Reveal key={idString(activity)} delay={i * 0.04}>
                <li className="border border-white/15 bg-white/5 p-6 backdrop-blur-sm">
                  <p className="text-xs font-semibold uppercase tracking-wider text-lime">
                    {activity.registrationStatus.replace(/-/g, " ")}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-white">{activity.name}</h3>
                  <p className="mt-2 text-sm text-white/70">
                    {[activity.location, formatDate(activity.date)].filter(Boolean).join(" · ")}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-white/75">{activity.summary}</p>
                  {activity.cta?.href ? (
                    <Link
                      href={activity.cta.href}
                      className={cn(
                        "mt-4 inline-flex text-xs font-semibold uppercase tracking-wider text-lime",
                      )}
                    >
                      {activity.cta.label || "Learn more"}
                    </Link>
                  ) : null}
                </li>
              </Reveal>
            ))}
          </ul>
        )}
      </GreenBand>

      <CTASection
        title="Propose or join an activity"
        description="Tell us what format interests you — we aim to connect the right partners when opportunities arise."
      />
    </>
  );
}
