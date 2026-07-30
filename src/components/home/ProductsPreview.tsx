import Link from "next/link";
import { ArrowUpRight, Package } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";

export type ProductPreviewItem = {
  id: string;
  name: string;
  slug: string;
  summary?: string;
  category?: string;
  countryOfOrigin?: string;
  imageSrc?: string;
  featured?: boolean;
};

export type ProductsPreviewProps = {
  products?: ProductPreviewItem[] | null;
  className?: string;
};

export function ProductsPreview({ products, className }: ProductsPreviewProps) {
  const list = products?.filter(Boolean) ?? [];

  return (
    <section className={cn("bg-surface py-12 sm:py-24", className)}>
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Products & Opportunities"
            title="Agricultural catalogue"
            description="Featured products and opportunities published by CAFBEX. Request information — this is not a checkout storefront."
          />
          <Link
            href="/products"
            className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold uppercase tracking-wider text-agri transition hover:text-forest"
          >
            Browse catalogue
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        {list.length === 0 ? (
          <EmptyState
            className="mt-10 border border-dashed border-border bg-white"
            icon={Package}
            title="No products listed yet"
            description="When administrators publish catalogue items, featured opportunities will appear here."
            action={
              <Link
                href="/contact"
                className="inline-flex rounded-full bg-forest px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white"
              >
                Ask about opportunities
              </Link>
            }
          />
        ) : (
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {list.slice(0, 6).map((product, index) => (
              <Reveal key={product.id} delay={index * 0.04}>
                <li>
                  <Link
                    href={`/products/${product.slug}`}
                    className="flex h-full flex-col overflow-hidden border border-border bg-white transition hover:border-agri/40"
                  >
                    <div className="relative aspect-[16/10] bg-forest/5">
                      {product.imageSrc ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={product.imageSrc}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-muted">
                          <Package className="h-8 w-8 opacity-40" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      {product.category ? (
                        <span className="text-xs font-semibold uppercase tracking-wider text-agri">
                          {product.category}
                        </span>
                      ) : null}
                      <h3 className="mt-1 text-base font-semibold text-forest">{product.name}</h3>
                      {product.countryOfOrigin ? (
                        <p className="mt-1 text-xs text-muted">{product.countryOfOrigin}</p>
                      ) : null}
                      {product.summary ? (
                        <p className="mt-2 line-clamp-3 flex-1 text-sm text-muted">
                          {product.summary}
                        </p>
                      ) : null}
                      <span className="mt-4 text-xs font-semibold uppercase tracking-wider text-tech-blue">
                        Request information
                      </span>
                    </div>
                  </Link>
                </li>
              </Reveal>
            ))}
          </ul>
        )}
      </Container>
    </section>
  );
}

export default ProductsPreview;
