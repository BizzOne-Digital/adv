import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { CTASection } from "@/components/ui/CTASection";
import { ImageGrid } from "@/components/ui/ImageGrid";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { RichText } from "@/components/ui/RichText";
import { getProductBySlug } from "@/lib/data";
import { buildMetadata, pageImages } from "@/lib/seo";
import { resolveCmsImage } from "@/lib/upload/resolve-image";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) {
    return buildMetadata({ title: "Product", path: `/products/${slug}`, noIndex: true });
  }
  return buildMetadata({
    title: product.seo?.title || product.name,
    description: product.seo?.description || product.summary,
    path: `/products/${slug}`,
    ogImage: product.seo?.ogImage || product.images?.[0]?.url,
  });
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const images = pageImages("products");

  return (
    <>
      <PageHero
        eyebrow={product.category}
        title={product.name}
        subtitle={product.summary}
        imageSrc={resolveCmsImage(
          product.images?.[0]?.url,
          `/images/products/${product.slug}/hero.jpg`,
        )}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Products", href: "/products" },
          { label: product.name },
        ]}
        actions={
          <MagneticButton
            href={`/contact?type=agribusiness&subject=${encodeURIComponent(`Info: ${product.name}`)}`}
            variant="lime"
            size="lg"
          >
            Request information
          </MagneticButton>
        }
      />

      <section className="bg-white py-16 sm:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <Reveal>
              <RichText html={product.description} />
            </Reveal>
            <Reveal delay={0.08}>
              <aside className="space-y-4 border border-border bg-surface p-6 text-sm text-muted">
                {product.countryOfOrigin ? (
                  <p>
                    <span className="font-medium text-forest">Origin: </span>
                    {product.countryOfOrigin}
                  </p>
                ) : null}
                {product.availability ? (
                  <p>
                    <span className="font-medium text-forest">Availability: </span>
                    {product.availability}
                  </p>
                ) : null}
                {product.minimumOrder ? (
                  <p>
                    <span className="font-medium text-forest">Minimum order: </span>
                    {product.minimumOrder}
                  </p>
                ) : null}
                {product.certification ? (
                  <p>
                    <span className="font-medium text-forest">Certification: </span>
                    {product.certification}
                  </p>
                ) : null}
                {product.supplierInfo ? (
                  <p>
                    <span className="font-medium text-forest">Supplier notes: </span>
                    {product.supplierInfo}
                  </p>
                ) : null}
                <p className="border-t border-border pt-4 text-xs">
                  This catalogue is for information requests only — not online checkout.
                </p>
              </aside>
            </Reveal>
          </div>

          {product.images && product.images.length > 0 ? (
            <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {product.images.slice(0, 5).map((img) => (
                <ImagePlaceholder
                  key={img.url}
                  src={img.url}
                  alt={img.alt || product.name}
                  label={img.caption || product.name}
                  className="aspect-[4/3]"
                />
              ))}
            </div>
          ) : (
            <Reveal className="mt-12">
              <ImageGrid images={images} />
            </Reveal>
          )}

          <p className="mt-10 text-sm">
            <Link href="/products" className="text-agri hover:text-forest">
              ← Back to catalogue
            </Link>
          </p>
        </Container>
      </section>

      <CTASection
        title="Request information"
        description={`Ask about ${product.name} — availability, partnerships, or next steps.`}
        primaryHref="/contact"
        primaryLabel="Request information"
        secondaryHref="/booking"
        secondaryLabel="Book a meeting"
      />
    </>
  );
}
