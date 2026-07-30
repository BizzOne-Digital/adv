import type { Metadata } from "next";
import { Accordion } from "@/components/ui/Accordion";
import { CTASection } from "@/components/ui/CTASection";
import { GreenBand } from "@/components/ui/GreenBand";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getFAQs } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import { idString } from "@/lib/serialize";

export const metadata: Metadata = buildMetadata({
  title: "FAQ",
  description: "Frequently asked questions about CAFBEX programmes, participation, and contact.",
  path: "/faq",
});

const FALLBACK_FAQS = [
  {
    question: "What is CAFBEX?",
    answer:
      "CAFBEX — Canada–Africa Farmers Business Exchange — aims to connect farmers, agribusinesses, investors, researchers, and policymakers to advance agricultural knowledge exchange, trade dialogue, and sustainable growth between Canada and Africa.",
  },
  {
    question: "How do I participate?",
    answer:
      "Use the booking or contact forms to express interest. When specific events or activities are published, registration details will be shared on those pages.",
  },
  {
    question: "Do you list confirmed prices online?",
    answer:
      "Pricing depends on scope. Visit the Pricing page and contact us for details — we do not invent published prices.",
  },
  {
    question: "Is the product catalogue a shop?",
    answer:
      "No. The catalogue supports Request Information inquiries. Checkout is not available.",
  },
  {
    question: "How can partners work with CAFBEX?",
    answer:
      "Partnership discussions are welcome via booking or contact. Related service pages outline potential collaboration areas.",
  },
];

export default async function FaqPage() {
  const faqs = await getFAQs();

  const byCategory = faqs.reduce<Record<string, typeof faqs>>((acc, faq) => {
    const key = faq.category || "General";
    acc[key] = acc[key] || [];
    acc[key].push(faq);
    return acc;
  }, {});

  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title="Frequently asked questions"
        subtitle="Answers about participation, services, and how to reach CAFBEX."
        imageSrc="/images/faq/hero.jpg"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "FAQ" }]}
      />

      <GreenBand variant="soft">
        <div className="mx-auto max-w-3xl">
          {faqs.length === 0 ? (
            <>
              <SectionHeading title="Common questions" />
              <Reveal className="mt-8">
                <Accordion items={FALLBACK_FAQS} />
              </Reveal>
            </>
          ) : (
            <div className="space-y-12">
              {Object.entries(byCategory).map(([category, list]) => (
                <div key={category}>
                  <SectionHeading eyebrow="Category" title={category} />
                  <Reveal className="mt-6">
                    <Accordion
                      items={list.map((f) => ({
                        id: idString(f),
                        question: f.question,
                        answer: f.answer,
                      }))}
                    />
                  </Reveal>
                </div>
              ))}
            </div>
          )}
        </div>
      </GreenBand>

      <CTASection
        title="Still have questions?"
        description="Send an inquiry or book a meeting — we aim to respond promptly."
      />
    </>
  );
}
