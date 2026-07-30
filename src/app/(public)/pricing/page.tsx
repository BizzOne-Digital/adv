import type { Metadata } from "next";
import Link from "next/link";
import { CTASection } from "@/components/ui/CTASection";
import { GreenBand } from "@/components/ui/GreenBand";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getPricingItems } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import { idString } from "@/lib/serialize";

export const metadata: Metadata = buildMetadata({
  title: "Pricing",
  description:
    "CAFBEX pricing depends on event, service, and partnership scope. Contact us for details — we do not invent prices.",
  path: "/pricing",
});

const FALLBACK_CATEGORIES = [
  {
    title: "Event participation",
    description: "Costs may vary by event format, duration, and inclusions.",
  },
  {
    title: "Exhibitor inquiry",
    description: "Exhibition presence is scoped per gathering and space requirements.",
  },
  {
    title: "Sponsorship inquiry",
    description: "Sponsorship packages are designed around specific programmes when announced.",
  },
  {
    title: "Training inquiry",
    description: "Training fees depend on curriculum, delivery mode, and cohort size.",
  },
  {
    title: "Partnership inquiry",
    description: "Partnership scope is discussed case by case.",
  },
  {
    title: "Trade facilitation inquiry",
    description: "Trade-related support is scoped to the corridor and stakeholders involved.",
  },
];

export default async function PricingPage() {
  const items = await getPricingItems();

  const byCategory = items.reduce<Record<string, typeof items>>((acc, item) => {
    const key = item.category || "General";
    acc[key] = acc[key] || [];
    acc[key].push(item);
    return acc;
  }, {});

  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title="Contact for pricing"
        subtitle="Costs depend on the event, service, programme, participation type, partnership scope, or requested support. We do not publish invented prices."
        imageSrc="/images/pricing/hero.jpg"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Pricing" }]}
      />

      <GreenBand variant="soft">
        <SectionHeading
          eyebrow="Inquiry categories"
          title="What you can inquire about"
          description="Select a category and reach out — we aim to provide relevant details for your context."
        />

        {items.length === 0 ? (
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FALLBACK_CATEGORIES.map((cat, i) => (
              <Reveal key={cat.title} delay={i * 0.04}>
                <li className="flex h-full flex-col border border-border bg-white p-6">
                  <h3 className="text-lg font-semibold text-forest">{cat.title}</h3>
                  <p className="mt-2 flex-1 text-sm text-muted">{cat.description}</p>
                  <Link
                    href="/contact"
                    className="mt-5 inline-flex text-xs font-semibold uppercase tracking-wider text-agri"
                  >
                    Contact for details
                  </Link>
                </li>
              </Reveal>
            ))}
          </ul>
        ) : (
          <div className="mt-10 space-y-12">
            {Object.entries(byCategory).map(([category, list]) => (
              <div key={category}>
                <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-agri">
                  {category}
                </h3>
                <ul className="mt-4 grid gap-4 sm:grid-cols-2">
                  {list.map((item, i) => (
                    <Reveal key={idString(item)} delay={i * 0.04}>
                      <li className="border border-border bg-white p-6">
                        <h4 className="text-lg font-semibold text-forest">{item.title}</h4>
                        <p className="mt-2 text-sm text-muted">{item.description}</p>
                        {item.inclusions && item.inclusions.length > 0 ? (
                          <ul className="mt-3 list-disc space-y-1 pl-4 text-sm text-muted">
                            {item.inclusions.map((inc) => (
                              <li key={inc}>{inc}</li>
                            ))}
                          </ul>
                        ) : null}
                        <p className="mt-4 text-sm font-medium text-forest">
                          {item.priceVisibility === "amount" && item.amount != null
                            ? `${item.currency || "CAD"} ${item.amount}`
                            : "Contact for details"}
                        </p>
                        <Link
                          href={item.cta?.href || "/contact"}
                          className="mt-4 inline-flex text-xs font-semibold uppercase tracking-wider text-agri"
                        >
                          {item.cta?.label || "Contact for details"}
                        </Link>
                      </li>
                    </Reveal>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </GreenBand>

      <CTASection
        title="Need a tailored quote?"
        description="Share your participation or partnership goals and we will follow up."
        primaryHref="/contact"
        primaryLabel="Contact for details"
      />
    </>
  );
}
