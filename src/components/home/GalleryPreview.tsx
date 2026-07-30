import Link from "next/link";
import { ArrowUpRight, Images } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";

export type GalleryPreviewItem = {
  id: string;
  src: string;
  alt: string;
  caption?: string;
  category?: string;
};

export type GalleryPreviewProps = {
  items?: GalleryPreviewItem[] | null;
  className?: string;
};

export function GalleryPreview({ items, className }: GalleryPreviewProps) {
  const list = items?.filter(Boolean) ?? [];

  return (
    <section className={cn("bg-white py-12 sm:py-24", className)}>
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Gallery"
            title="Moments from the exchange"
            description="Visual stories from conferences, farm visits, training, and community gatherings."
          />
          <Link
            href="/gallery"
            className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold uppercase tracking-wider text-agri transition hover:text-forest"
          >
            Open gallery
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        {list.length === 0 ? (
          <div className="mt-10">
            <EmptyState
              className="border border-dashed border-border bg-surface"
              icon={Images}
              title="Gallery coming soon"
              description="Images will appear here as CAFBEX publishes gallery content from the admin portal."
            />
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[1, 2, 3].map((n) => (
                <ImagePlaceholder
                  key={n}
                  src={`/images/gallery/preview-${n}.jpg`}
                  alt={`Gallery placeholder ${n}`}
                  label={`gallery/preview-${n}.jpg`}
                  className="aspect-[4/3]"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {list.slice(0, 8).map((item, index) => (
              <Reveal key={item.id} delay={index * 0.04} className={index === 0 ? "sm:col-span-2 sm:row-span-2" : ""}>
                <Link href="/gallery" className="group relative block overflow-hidden">
                  <div className={cn("relative", index === 0 ? "aspect-square sm:aspect-auto sm:h-full min-h-[240px]" : "aspect-[4/3]")}>
                    {/* eslint-disable-next-line @next/next/no-img-element -- dynamic CMS urls */}
                    <img
                      src={item.src}
                      alt={item.alt}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-forest/70 via-transparent to-transparent opacity-80" />
                    {(item.caption || item.category) && (
                      <div className="absolute inset-x-0 bottom-0 p-3 text-white">
                        {item.category ? (
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-lime">
                            {item.category}
                          </p>
                        ) : null}
                        {item.caption ? (
                          <p className="mt-0.5 line-clamp-2 text-sm">{item.caption}</p>
                        ) : null}
                      </div>
                    )}
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}

export default GalleryPreview;
