import type { Metadata } from "next";
import Link from "next/link";
import { Users } from "lucide-react";
import { CTASection } from "@/components/ui/CTASection";
import { EmptyState } from "@/components/ui/EmptyState";
import { GreenBand } from "@/components/ui/GreenBand";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getTeam } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import { idString } from "@/lib/serialize";

export const metadata: Metadata = buildMetadata({
  title: "Team",
  description:
    "Meet the CAFBEX team. Profiles appear here only when published — we do not invent members.",
  path: "/team",
});

export default async function TeamPage() {
  const team = await getTeam();
  const leadership = team.filter((m) => m.isLeadership);
  const members = team.filter((m) => !m.isLeadership);

  return (
    <>
      <PageHero
        eyebrow="Team"
        title="People behind the exchange"
        subtitle="Team profiles are published when names, roles, and photographs are confirmed."
        imageSrc="/images/team/hero.jpg"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Team" }]}
      />

      <GreenBand variant="soft">
        {team.length === 0 ? (
          <EmptyState
            icon={Users}
            className="border border-dashed border-border bg-white"
            title="Team profiles coming soon"
            description="We do not invent team members. Published leadership and staff profiles will appear here once approved."
            action={
              <Link
                href="/contact"
                className="inline-flex rounded-full bg-forest px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white"
              >
                Connect with CAFBEX
              </Link>
            }
          />
        ) : (
          <>
            {leadership.length > 0 ? (
              <div>
                <SectionHeading eyebrow="Leadership" title="Leadership" />
                <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {leadership.map((member, i) => (
                    <Reveal key={idString(member)} delay={i * 0.05}>
                      <li className="overflow-hidden border border-border bg-white">
                        <ImagePlaceholder
                          src={member.image?.url || `/images/team/${member.slug}.jpg`}
                          alt={member.name}
                          className="aspect-[4/5]"
                        />
                        <div className="p-5">
                          <h3 className="text-lg font-semibold text-forest">{member.name}</h3>
                          <p className="mt-1 text-sm text-agri">{member.role}</p>
                          {member.bio ? (
                            <p className="mt-3 text-sm leading-relaxed text-muted">{member.bio}</p>
                          ) : null}
                        </div>
                      </li>
                    </Reveal>
                  ))}
                </ul>
              </div>
            ) : null}

            {members.length > 0 ? (
              <div className="mt-16">
                <SectionHeading eyebrow="Team" title="Team members" />
                <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {members.map((member, i) => (
                    <Reveal key={idString(member)} delay={i * 0.04}>
                      <li className="overflow-hidden border border-border bg-white">
                        <ImagePlaceholder
                          src={member.image?.url || `/images/team/${member.slug}.jpg`}
                          alt={member.name}
                          className="aspect-square"
                        />
                        <div className="p-4">
                          <h3 className="font-semibold text-forest">{member.name}</h3>
                          <p className="mt-1 text-sm text-muted">{member.role}</p>
                        </div>
                      </li>
                    </Reveal>
                  ))}
                </ul>
              </div>
            ) : null}
          </>
        )}
      </GreenBand>

      <CTASection
        title="Join or advise the mission"
        description="Partnership, advisory, and collaboration conversations are welcome."
        primaryHref="/booking"
        primaryLabel="Start a conversation"
      />
    </>
  );
}
