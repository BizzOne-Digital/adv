"use client";

import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { resolveCmsImage } from "@/lib/upload/resolve-image";
import { cn } from "@/lib/utils";

export type ImagePlaceholderProps = {
  /** Path under /public or /api/uploads/... */
  src: string;
  alt: string;
  label?: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
};

function svgFallback(path: string): string | null {
  if (/\.(jpe?g|png|webp)$/i.test(path)) {
    return path.replace(/\.(jpe?g|png|webp)$/i, ".svg");
  }
  return null;
}

export function ImagePlaceholder({
  src,
  alt,
  label,
  className,
  fill = true,
  width,
  height,
  priority,
  sizes = "100vw",
}: ImagePlaceholderProps) {
  const resolved = resolveCmsImage(src);
  const [currentSrc, setCurrentSrc] = useState(resolved);
  const [failed, setFailed] = useState(false);
  const fallbackLabel = label ?? src.replace(/^\/images\//, "");
  const isMongoUpload = currentSrc.startsWith("/api/uploads/");

  useEffect(() => {
    setCurrentSrc(resolveCmsImage(src));
    setFailed(false);
  }, [src]);

  const handleError = () => {
    const next = svgFallback(currentSrc);
    if (next && next !== currentSrc) {
      setCurrentSrc(next);
      return;
    }
    setFailed(true);
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-gradient-to-br from-forest/90 via-agri/80 to-tech-blue/70",
        !fill && "inline-block",
        className,
      )}
    >
      {!failed ? (
        fill ? (
          <Image
            src={currentSrc}
            alt={alt}
            fill
            priority={priority}
            sizes={sizes}
            unoptimized={isMongoUpload}
            className="object-cover transition-transform duration-700 hover:scale-105"
            onError={handleError}
          />
        ) : (
          <Image
            src={currentSrc}
            alt={alt}
            width={width ?? 800}
            height={height ?? 600}
            priority={priority}
            unoptimized={isMongoUpload}
            className="h-auto w-full object-cover transition-transform duration-700 hover:scale-105"
            onError={handleError}
          />
        )
      ) : (
        <div
          className={cn(
            "flex items-center justify-center",
            fill ? "absolute inset-0" : "aspect-[4/3] w-full",
          )}
          aria-label={alt || fallbackLabel}
        >
          <ImageIcon className="h-10 w-10 text-white/35" aria-hidden />
        </div>
      )}
    </div>
  );
}

export default ImagePlaceholder;
