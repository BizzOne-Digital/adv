"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs, type Crumb } from "@/components/ui/Breadcrumbs";
import { resolveCmsImage } from "@/lib/upload/resolve-image";
import { cn } from "@/lib/utils";

export type PageHeroProps = {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  imageSrc?: string;
  imageAlt?: string;
  breadcrumbs?: Crumb[];
  actions?: ReactNode;
  className?: string;
  tone?: "forest" | "dark" | "light";
  /** When false, render a solid soft background with no photo. */
  showImage?: boolean;
};

export function PageHero({
  title,
  subtitle,
  eyebrow,
  imageSrc = "/images/heroes/page-hero.svg",
  imageAlt = "",
  breadcrumbs,
  actions,
  className,
  tone = "light",
  showImage = true,
}: PageHeroProps) {
  const resolved = resolveCmsImage(imageSrc);
  const [currentSrc, setCurrentSrc] = useState(resolved);
  const [imgFailed, setImgFailed] = useState(!showImage);
  const isMongoUpload = currentSrc.startsWith("/api/uploads/");

  useEffect(() => {
    if (!showImage) {
      setImgFailed(true);
      return;
    }
    setCurrentSrc(resolveCmsImage(imageSrc));
    setImgFailed(false);
  }, [imageSrc, showImage]);

  const toneCls =
    tone === "light"
      ? "bg-[#eaf7f0] text-forest"
      : tone === "dark"
        ? "bg-black text-white"
        : "bg-forest text-white";

  const handleImageError = () => {
    if (/\.(jpe?g|png|webp)$/i.test(currentSrc)) {
      const svg = currentSrc.replace(/\.(jpe?g|png|webp)$/i, ".svg");
      if (svg !== currentSrc) {
        setCurrentSrc(svg);
        return;
      }
    }
    if (!currentSrc.includes("page-hero.svg")) {
      setCurrentSrc("/images/heroes/page-hero.svg");
      return;
    }
    setImgFailed(true);
  };

  return (
    <section
      className={cn(
        "relative isolate overflow-hidden pt-[calc(var(--header-h)+env(safe-area-inset-top,0px))] sm:pt-28",
        toneCls,
        className,
      )}
    >
      <div className="absolute inset-0 -z-10">
        {showImage && !imgFailed ? (
          <Image
            src={currentSrc}
            alt={imageAlt}
            fill
            priority
            unoptimized={isMongoUpload || currentSrc.endsWith(".svg")}
            className="object-cover object-[70%_center] scale-105 motion-safe:animate-hero-kenburns sm:object-center"
            sizes="100vw"
            onError={handleImageError}
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background:
                tone === "light"
                  ? "linear-gradient(135deg, #EAF7F0 0%, #D5EFE0 45%, #B7DFC8 100%)"
                  : "linear-gradient(135deg, #0B3D2E 0%, #1B6B45 45%, #1E6B9F 100%)",
            }}
          />
        )}
        {showImage ? (
          <div
            className={cn(
              "absolute inset-0",
              tone === "light"
                ? "bg-gradient-to-b from-[#eaf7f0]/92 via-[#eaf7f0]/82 to-[#eaf7f0]/70 sm:bg-gradient-to-r sm:from-[#eaf7f0]/95 sm:via-[#eaf7f0]/78 sm:to-[#eaf7f0]/35"
                : tone === "dark"
                  ? "bg-gradient-to-r from-black/90 via-black/70 to-black/40"
                  : "bg-gradient-to-r from-forest/95 via-forest/80 to-forest/45",
            )}
          />
        ) : null}
      </div>

      <Container className="relative min-w-0 pb-12 pt-8 sm:pb-20 sm:pt-14">
        {breadcrumbs?.length ? (
          <Breadcrumbs
            items={breadcrumbs}
            className="mb-4 sm:mb-6"
            light={tone !== "light"}
          />
        ) : null}
        {eyebrow ? (
          <p
            className={cn(
              "mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] sm:mb-3 sm:text-xs sm:tracking-[0.22em]",
              tone === "light" ? "text-agri" : "text-lime",
            )}
          >
            {eyebrow}
          </p>
        ) : null}
        <h1 className="max-w-3xl text-[1.75rem] font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl xl:text-6xl">
          {title}
        </h1>
        {subtitle ? (
          <p
            className={cn(
              "mt-4 max-w-2xl text-sm leading-relaxed sm:mt-5 sm:text-lg",
              tone === "light" ? "text-forest/70" : "text-white/80",
            )}
          >
            {subtitle}
          </p>
        ) : null}
        {actions ? (
          <div className="mobile-cta-stack mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap">
            {actions}
          </div>
        ) : null}
      </Container>
    </section>
  );
}

export default PageHero;
