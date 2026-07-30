"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Container } from "@/components/ui/Container";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { resolveCmsImage } from "@/lib/upload/resolve-image";
import { cn } from "@/lib/utils";

export type HomeHeroProps = {
  className?: string;
  imageSrc?: string;
};

export function Hero({
  className,
  imageSrc = "/images/home/hero.svg",
}: HomeHeroProps) {
  const reduced = useReducedMotion();
  const resolved = resolveCmsImage(imageSrc, "/images/home/hero.svg");
  const [currentSrc, setCurrentSrc] = useState(resolved);
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    setCurrentSrc(resolveCmsImage(imageSrc, "/images/home/hero.svg"));
    setImgFailed(false);
  }, [imageSrc]);

  const handleError = () => {
    if (
      currentSrc.endsWith(".jpg") ||
      currentSrc.endsWith(".webp") ||
      currentSrc.endsWith(".png")
    ) {
      setCurrentSrc("/images/home/hero.svg");
      return;
    }
    setImgFailed(true);
  };

  return (
    <section
      className={cn(
        "relative isolate flex min-h-[min(100svh,900px)] items-end overflow-hidden bg-[#eaf7f0] text-forest sm:min-h-[92svh]",
        className,
      )}
    >
      <div className="absolute inset-0 -z-10">
        {!imgFailed ? (
          <Image
            src={currentSrc}
            alt="Canadian and African agricultural landscapes connected through CAFBEX"
            fill
            priority
            unoptimized={
              currentSrc.endsWith(".svg") || currentSrc.startsWith("/api/uploads/")
            }
            className="object-cover object-[70%_center] sm:object-center"
            sizes="100vw"
            onError={handleError}
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 15% 20%, #C6FF4E55, transparent 40%), radial-gradient(ellipse at 85% 30%, #1E6B9F33, transparent 45%), linear-gradient(180deg, #EAF7F0 0%, #D5EFE0 45%, #B7DFC8 100%)",
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-[#eaf7f0]/90 via-[#eaf7f0]/75 to-[#d8efe3]/95 sm:bg-gradient-to-r sm:from-[#eaf7f0]/95 sm:via-[#eaf7f0]/72 sm:to-[#eaf7f0]/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#d8efe3] via-transparent to-transparent sm:from-[#d8efe3]/90" />
      </div>

      <svg
        className="pointer-events-none absolute inset-0 hidden h-full w-full opacity-70 sm:block"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        <motion.path
          d="M180 520 C420 380 780 420 1180 280"
          fill="none"
          stroke="#1B6B45"
          strokeWidth="2.5"
          strokeLinecap="round"
          initial={reduced ? false : { pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.55 }}
          transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
        />
        <motion.circle
          cx="180"
          cy="520"
          r="7"
          fill="#C8102E"
          initial={reduced ? false : { scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5 }}
        />
        <motion.circle
          cx="1180"
          cy="280"
          r="7"
          fill="#1E6B9F"
          initial={reduced ? false : { scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.4 }}
        />
      </svg>

      <Container className="relative pb-12 pt-28 sm:pb-24 sm:pt-40">
        <motion.p
          className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-agri sm:mb-4 sm:text-xs sm:tracking-[0.28em]"
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Canada–Africa Exchange
        </motion.p>

        <motion.h1
          className="max-w-4xl text-[1.85rem] font-semibold leading-[1.15] tracking-tight text-forest sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl"
          initial={reduced ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          Canada–Africa Farmers Business Exchange
        </motion.h1>

        <motion.p
          className="mt-4 max-w-2xl text-sm leading-relaxed text-forest/75 sm:mt-6 sm:text-lg"
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.22 }}
        >
          Connecting farmers, agribusinesses, investors, researchers, and policymakers to
          advance trade, innovation, knowledge exchange, and sustainable agricultural growth
          between Canada and Africa.
        </motion.p>

        <motion.div
          className="mobile-cta-stack mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap"
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.35 }}
        >
          <MagneticButton
            href="/about"
            variant="primary"
            size="lg"
            className="w-full sm:w-auto"
          >
            Explore CAFBEX
            <ArrowRight className="h-4 w-4" />
          </MagneticButton>
          <MagneticButton
            href="/booking"
            variant="lime"
            size="lg"
            className="w-full sm:w-auto"
          >
            Become Part of the Exchange
          </MagneticButton>
          <Link
            href="/activities"
            className="inline-flex h-12 w-full items-center justify-center px-2 text-sm font-semibold uppercase tracking-wider text-forest/80 transition hover:text-agri sm:w-auto sm:justify-start"
          >
            View Activities
          </Link>
        </motion.div>
      </Container>
    </section>
  );
}

export default Hero;
