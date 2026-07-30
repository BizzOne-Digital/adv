import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { CTASection } from "@/components/ui/CTASection";
import { GreenBand } from "@/components/ui/GreenBand";
import { ImageGrid } from "@/components/ui/ImageGrid";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getSettings } from "@/lib/data";
import { buildMetadata, pageImages } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "About",
    description:
      "Learn about CAFBEX — the Canada–Africa Farmers Business Exchange connecting agriculture, trade, and opportunity.",
    path: "/about",
  });
}

const OBJECTIVES = [
  "Facilitate knowledge exchange between Canadian and African farmers",
  "Promote modern agricultural technology and innovation",
  "Encourage agricultural trade and investment",
  "Support youth and women in agribusiness",
  "Strengthen food security and sustainable farming",
  "Create business networking and partnership opportunities",
];

const VALUES = [
  "Collaboration",
  "Sustainability",
  "Innovation",
  "Inclusion",
  "Knowledge sharing",
  "Economic opportunity",
  "Food security",
  "Responsible growth",
];

export default async function AboutPage() {
  const settings = await getSettings();
  const images = pageImages("about", [
    "Canadian farmland landscape",
    "African agricultural community",
    "Knowledge exchange workshop",
    "Trade and partnership dialogue",
    "Sustainable farming practices",
  ]);

  return (
    <>
      <PageHero
        tone="light"
        eyebrow="About CAFBEX"
        title="Canada–Africa Farmers Business Exchange"
        subtitle="Connecting agriculture. Growing opportunity across the Atlantic."
        imageSrc="/images/about/hero.jpg"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
        actions={
          <MagneticButton href="/booking" variant="primary" size="lg">
            Book a meeting
          </MagneticButton>
        }
      />

      <section className="bg-white py-16 sm:py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <Reveal>
              <SectionHeading
                eyebrow="Who we are"
                title="A platform for lasting agricultural partnerships"
                description="CAFBEX aims to connect farmers, agribusinesses, investors, researchers, and policymakers across Canada and Africa."
              />
              <p className="mt-6 text-base leading-relaxed text-muted">
                We are designed to support knowledge exchange, trade dialogue, investment
                conversations, and technology awareness that may improve food security and
                create economic opportunity for farming communities.
              </p>
            </Reveal>
            <Reveal delay={0.08}>
              <ImagePlaceholder
                src="/images/about/feature.jpg"
                alt="CAFBEX agricultural exchange"
                className="aspect-[4/3]"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </Reveal>
          </div>

          <Reveal className="mt-14">
            <ImageGrid images={images} />
          </Reveal>
        </Container>
      </section>

      <GreenBand variant="forest">
        <div className="grid gap-6 lg:grid-cols-2">
          <Reveal>
            <article className="h-full border border-white/15 bg-white/5 p-5 backdrop-blur-sm sm:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-lime">
                Mission
              </p>
              <p className="mt-4 text-base leading-relaxed text-white/85">
                {settings.mission}
              </p>
            </article>
          </Reveal>
          <Reveal delay={0.08}>
            <article className="h-full border border-white/15 bg-white/5 p-5 backdrop-blur-sm sm:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-lime">
                Vision
              </p>
              <p className="mt-4 text-base leading-relaxed text-white/85">{settings.vision}</p>
            </article>
          </Reveal>
        </div>
      </GreenBand>

      <GreenBand variant="soft">
        <SectionHeading
          eyebrow="Objectives"
          title="What we aim to advance"
          description="These objectives guide CAFBEX programmes and conversations."
        />
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {OBJECTIVES.map((item, i) => (
            <Reveal key={item} delay={i * 0.04}>
              <li className="border-l-2 border-agri bg-white/80 px-4 py-3 text-sm text-forest/80">
                {item}
              </li>
            </Reveal>
          ))}
        </ul>
      </GreenBand>

      <section className="bg-white py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Values"
            title="How we work"
            description="Principles that shape partnerships and program design."
          />
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v, i) => (
              <Reveal key={v} delay={i * 0.03}>
                <li className="border border-forest/10 bg-[#eaf7f0] px-4 py-5 text-sm font-medium text-forest">
                  {v}
                </li>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      <CTASection
        title="Ready to connect?"
        description="Whether you are a farmer, investor, or institutional partner, we welcome thoughtful inquiries."
      />
    </>
  );
}
