import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { CTASection } from "@/components/ui/CTASection";
import { ImageGrid } from "@/components/ui/ImageGrid";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { GalleryClient } from "./GalleryClient";
import { getGallery } from "@/lib/data";
import { buildMetadata, pageImages } from "@/lib/seo";
import { idString } from "@/lib/serialize";
import { resolveCmsImage } from "@/lib/upload/resolve-image";

export const metadata: Metadata = buildMetadata({
  title: "Gallery",
  description:
    "Visual stories from CAFBEX conferences, farm visits, training, and community gatherings.",
  path: "/gallery",
});

export default async function GalleryPage() {
  const items = await getGallery();
  const placeholders = pageImages("gallery");

  const mapped =
    items.length > 0
      ? items.map((g) => ({
          id: idString(g),
          src: resolveCmsImage(
            g.media?.url,
            `/images/gallery/${g.slug}.jpg`,
          ),
          alt: g.media?.alt || g.title,
          caption: g.caption || g.title,
          category: g.category,
          location: g.location,
        }))
      : placeholders.map((p, i) => ({
          id: `placeholder-${i}`,
          src: p.src,
          alt: p.alt,
          caption: `Gallery placeholder ${i + 1}`,
          category: ["Conferences", "Farm Visits", "Technology", "Networking", "Community"][i]!,
        }));

  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title="Images from the corridor"
        subtitle="A cinematic archive of exchange moments — populated as media is published."
        imageSrc="/images/gallery/hero.jpg"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Gallery" }]}
      />

      <GalleryClient items={mapped} />

      {items.length === 0 ? (
        <section className="bg-surface py-12">
          <Container>
            <Reveal>
              <ImageGrid images={placeholders} />
            </Reveal>
          </Container>
        </section>
      ) : null}

      <CTASection
        title="Share a moment with CAFBEX"
        description="Media partnerships and event photography inquiries are welcome."
      />
    </>
  );
}
