import type { Metadata } from "next";
import Link from "next/link";
import { Package } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { CTASection } from "@/components/ui/CTASection";
import { EmptyState } from "@/components/ui/EmptyState";
import { ImageGrid } from "@/components/ui/ImageGrid";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getProducts } from "@/lib/data";
import { buildMetadata, pageImages } from "@/lib/seo";
import { idString } from "@/lib/serialize";
import { resolveCmsImage } from "@/lib/upload/resolve-image";

export const metadata: Metadata = buildMetadata({
  title: "Products & Opportunities",
  description:
    "CAFBEX agricultural products and opportunities catalogue. Request information — this is not a checkout storefront.",
  path: "/products",
});

export default async function ProductsPage() {
  const products = await getProducts();
  const images = pageImages("products");
  const categories = Array.from(new Set(products.map((p) => p.category))).sort();

  return (
    <>
      <PageHero
        eyebrow="Catalogue"
        title="Products & opportunities"
        subtitle="A dynamic agricultural catalogue. Use Request Information — there is no Buy Now checkout."
        imageSrc="/images/products/hero.jpg"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Products" }]}
      />

      <section className="bg-white py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Published items"
            title="Agricultural catalogue"
            description="Items appear when approved and activated. We do not invent real products or suppliers."
          />

          {categories.length > 0 ? (
            <p className="mt-4 text-sm text-muted">
              Categories: {categories.join(" · ")}
            </p>
          ) : null}

          {products.length === 0 ? (
            <EmptyState
              className="mt-10 border border-dashed border-border bg-surface"
              icon={Package}
              title="No catalogue items published"
              description="When CAFBEX publishes products or opportunities, they will appear here with Request Information CTAs."
              action={
                <Link
                  href="/contact"
                  className="inline-flex rounded-full bg-forest px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white"
                >
                  Request information
                </Link>
              }
            />
          ) : (
            <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product, i) => (
                <Reveal key={idString(product)} delay={i * 0.04}>
                  <li>
                    <Link
                      href={`/products/${product.slug}`}
                      className="flex h-full flex-col overflow-hidden border border-border transition hover:border-agri/40"
                    >
                      <ImagePlaceholder
                        src={resolveCmsImage(
                          product.images?.[0]?.url,
                          `/images/products/${product.slug}.jpg`,
                        )}
                        alt={product.name}
                        label={product.name}
                        className="aspect-[4/3]"
                      />
                      <div className="flex flex-1 flex-col p-5">
                        <p className="text-xs font-semibold uppercase tracking-wider text-agri">
                          {product.category}
                          {product.countryOfOrigin ? ` · ${product.countryOfOrigin}` : ""}
                        </p>
                        <h3 className="mt-2 text-lg font-semibold text-forest">{product.name}</h3>
                        <p className="mt-2 line-clamp-3 flex-1 text-sm text-muted">
                          {product.summary}
                        </p>
                        <span className="mt-4 text-xs font-semibold uppercase tracking-wider text-agri">
                          Request information
                        </span>
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

      <CTASection
        title="Looking for something specific?"
        description="Tell us what you need — we aim to connect you with relevant information or partners."
        primaryHref="/contact"
        primaryLabel="Request information"
      />
    </>
  );
}
