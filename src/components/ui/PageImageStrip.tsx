import { ImageGrid, type ImageGridSlot } from "@/components/ui/ImageGrid";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { pageImages } from "@/lib/seo";
import { cn } from "@/lib/utils";

export type PageImageStripProps = {
  folder: string;
  alts?: string[];
  eyebrow?: string;
  title?: string;
  description?: string;
  className?: string;
  /** soft mint band vs plain white */
  tone?: "white" | "soft" | "forest";
};

/**
 * Ensures every public page has a visible 5-image editorial strip.
 */
export function PageImageStrip({
  folder,
  alts,
  eyebrow = "Visuals",
  title = "Moments from the exchange",
  description = "Moments from agricultural exchange, trade dialogue, and community gatherings.",
  className,
  tone = "soft",
}: PageImageStripProps) {
  const images = pageImages(folder, alts) as [
    ImageGridSlot,
    ImageGridSlot,
    ImageGridSlot,
    ImageGridSlot,
    ImageGridSlot,
  ];

  const toneCls =
    tone === "forest"
      ? "bg-forest text-white"
      : tone === "soft"
        ? "bg-[#eaf7f0]"
        : "bg-white";

  return (
    <section className={cn("py-12 sm:py-20", toneCls, className)}>
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow={eyebrow}
            title={title}
            description={description}
            tone={tone === "forest" ? "inverse" : "default"}
          />
        </Reveal>
        <Reveal className="mt-10" delay={0.06}>
          <ImageGrid images={images} />
        </Reveal>
      </div>
    </section>
  );
}

export default PageImageStrip;
