import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { cn } from "@/lib/utils";

export type ImageGridSlot = {
  src: string;
  alt: string;
  label?: string;
};

export type ImageGridProps = {
  /** Exactly 5 image slots for page layouts */
  images: [ImageGridSlot, ImageGridSlot, ImageGridSlot, ImageGridSlot, ImageGridSlot];
  className?: string;
  basePath?: string;
};

/**
 * Five-slot editorial image grid for content pages.
 * Paths should live under /public/images/...
 */
export function ImageGrid({ images, className }: ImageGridProps) {
  const [a, b, c, d, e] = images;

  return (
    <div className={cn("grid gap-2.5 sm:gap-4", className)}>
      <div className="grid gap-2.5 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        <ImagePlaceholder
          src={a.src}
          alt={a.alt}
          label={a.label}
          className="aspect-[4/3] lg:col-span-2 lg:aspect-[16/9]"
          sizes="(max-width: 1024px) 100vw, 66vw"
        />
        <ImagePlaceholder
          src={b.src}
          alt={b.alt}
          label={b.label}
          className="aspect-[4/3]"
          sizes="(max-width: 1024px) 100vw, 33vw"
        />
      </div>
      <div className="grid gap-2.5 sm:grid-cols-3 sm:gap-4">
        {[c, d, e].map((img, i) => (
          <ImagePlaceholder
            key={`${img.src}-${i}`}
            src={img.src}
            alt={img.alt}
            label={img.label}
            className={cn("aspect-[4/3]", i === 2 && "sm:col-span-1")}
            sizes="(max-width: 640px) 100vw, 33vw"
          />
        ))}
      </div>
    </div>
  );
}

export default ImageGrid;
