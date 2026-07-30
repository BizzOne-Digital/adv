"use client";

import { useMemo, useState } from "react";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { Lightbox } from "@/components/ui/Lightbox";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";

export type GalleryClientItem = {
  id: string;
  src: string;
  alt: string;
  caption?: string;
  category: string;
  location?: string;
};

const CATEGORIES = [
  "All",
  "Conferences",
  "Farm Visits",
  "Technology",
  "Exhibitions",
  "Networking",
  "Training",
  "Trade",
  "Community",
];

export function GalleryClient({ items }: { items: GalleryClientItem[] }) {
  const [category, setCategory] = useState("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered = useMemo(() => {
    if (category === "All") return items;
    return items.filter((i) => i.category.toLowerCase() === category.toLowerCase());
  }, [items, category]);

  return (
    <section className="bg-white py-12 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow="Gallery"
          title="Moments from the exchange"
          description="Filter by category. Images appear when published by CAFBEX."
        />

        <div className="mt-8 -mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:flex-wrap sm:overflow-visible">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={cn(
                "shrink-0 rounded-full px-3.5 py-2 text-[11px] font-semibold uppercase tracking-wider transition sm:px-4 sm:py-1.5 sm:text-xs",
                category === cat
                  ? "bg-forest text-white"
                  : "bg-surface text-forest hover:bg-agri/10",
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            className="mt-10 border border-dashed border-border bg-surface"
            title="No gallery items yet"
            description="Published photographs and media will appear here. Placeholder slots below show where imagery will live."
          />
        ) : (
          <ul className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3">
            {filtered.map((item, index) => (
              <Reveal key={item.id} className="mb-4 break-inside-avoid">
                <button
                  type="button"
                  className="block w-full text-left"
                  onClick={() => setLightboxIndex(index)}
                >
                  <ImagePlaceholder
                    src={item.src}
                    alt={item.alt}
                    label={item.caption || item.category}
                    className="aspect-[4/5] sm:aspect-auto sm:min-h-[220px]"
                  />
                  <p className="mt-2 text-sm font-medium text-forest">
                    {item.caption || item.alt}
                  </p>
                  <p className="text-xs text-muted">
                    {[item.category, item.location].filter(Boolean).join(" · ")}
                  </p>
                </button>
              </Reveal>
            ))}
          </ul>
        )}

        <Lightbox
          items={filtered.map((i) => ({
            src: i.src,
            alt: i.alt,
            caption: i.caption,
          }))}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onChange={setLightboxIndex}
        />
      </Container>
    </section>
  );
}
