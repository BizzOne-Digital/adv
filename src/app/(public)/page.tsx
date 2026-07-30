import type { Metadata } from "next";
import { ActivitiesPreview } from "@/components/home/ActivitiesPreview";
import { ConnectionMap } from "@/components/home/ConnectionMap";
import { EventsPreview } from "@/components/home/EventsPreview";
import { FinalCTA } from "@/components/home/FinalCTA";
import { GalleryPreview } from "@/components/home/GalleryPreview";
import { Hero } from "@/components/home/Hero";
import { LatestNews } from "@/components/home/LatestNews";
import { MissionVision } from "@/components/home/MissionVision";
import { Objectives } from "@/components/home/Objectives";
import { ProductsPreview } from "@/components/home/ProductsPreview";
import { ServicesPreview } from "@/components/home/ServicesPreview";
import { TestimonialsPreview } from "@/components/home/TestimonialsPreview";
import { WhoWeConnect } from "@/components/home/WhoWeConnect";
import { CinematicIntro } from "@/components/intro/CinematicIntro";
import {
  getApprovedTestimonials,
  getEvents,
  getGallery,
  getProducts,
  getPublishedBlogs,
  getSettings,
} from "@/lib/data";
import {
  FALLBACK_ARTICLES,
  FALLBACK_GALLERY,
  FALLBACK_PRODUCTS,
  FALLBACK_TESTIMONIALS,
} from "@/lib/home-fallbacks";
import { PageImageStrip } from "@/components/ui/PageImageStrip";
import { buildMetadata } from "@/lib/seo";
import { idString } from "@/lib/serialize";
import { resolveCmsImage } from "@/lib/upload/resolve-image";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return buildMetadata({
    title: undefined,
    description: settings.defaultSeo.description,
    path: "/",
    ogImage: settings.defaultSeo.ogImage,
  });
}

export default async function HomePage() {
  const [settings, events, gallery, products, blogs, testimonials] =
    await Promise.all([
      getSettings(),
      getEvents({ limit: 3, upcomingOnly: true }),
      getGallery({ featured: true, limit: 6 }),
      getProducts({ featured: true, limit: 4 }),
      getPublishedBlogs({ limit: 3 }),
      getApprovedTestimonials({ limit: 6 }),
    ]);

  const galleryItems =
    gallery.length > 0
      ? gallery.map((g) => ({
          id: idString(g),
          src: resolveCmsImage(g.media?.url, `/images/gallery/${g.slug}.jpg`),
          alt: g.media?.alt || g.title,
          caption: g.caption,
          category: g.category,
        }))
      : [...FALLBACK_GALLERY];

  const productItems =
    products.length > 0
      ? products.map((p) => ({
          id: idString(p),
          name: p.name,
          slug: p.slug,
          summary: p.summary,
          category: p.category,
          countryOfOrigin: p.countryOfOrigin,
          imageSrc: resolveCmsImage(p.images?.[0]?.url, `/images/products/01.jpg`),
          featured: p.featured,
        }))
      : [...FALLBACK_PRODUCTS];

  const testimonialItems =
    testimonials.length > 0
      ? testimonials.map((t) => ({
          id: idString(t),
          quote: t.quote,
          authorName: t.name,
          authorRole: t.role,
          organization: t.organization,
          isSample: t.isSample,
        }))
      : [...FALLBACK_TESTIMONIALS];

  const articleItems =
    blogs.length > 0
      ? blogs.map((b) => ({
          id: idString(b),
          title: b.title,
          slug: b.slug,
          excerpt: b.excerpt,
          publishedAt: b.publishedAt || b.createdAt,
          coverImage: resolveCmsImage(b.coverImage?.url, "/images/blog/01.jpg"),
          category: undefined as string | undefined,
        }))
      : [...FALLBACK_ARTICLES];

  return (
    <>
      {settings.introEnabled ? <CinematicIntro /> : null}
      <Hero />
      <MissionVision mission={settings.mission} vision={settings.vision} />
      <Objectives />
      <ServicesPreview />
      <WhoWeConnect />
      <ConnectionMap />
      <ActivitiesPreview />
      <EventsPreview
        events={events.map((e) => ({
          id: idString(e),
          title: e.title,
          slug: e.slug,
          summary: e.summary,
          startDate: e.startDate,
          location: e.location,
          category: e.category,
        }))}
      />
      <GalleryPreview items={galleryItems} />
      <PageImageStrip
        folder="home"
        eyebrow="Landscapes"
        title="Canada and Africa, side by side"
        description="Aerial farms, greenhouses, and exchange moments — replace these slots with your photography."
        tone="soft"
        alts={[
          "Canadian farmland",
          "African farm landscape",
          "Farmers collaborating",
          "Greenhouse technology",
          "Trade and networking",
        ]}
      />
      <ProductsPreview products={productItems} />
      <TestimonialsPreview testimonials={testimonialItems} />
      <LatestNews articles={articleItems} />
      <FinalCTA />
    </>
  );
}
