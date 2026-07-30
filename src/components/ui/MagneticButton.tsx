"use client";

import Link from "next/link";
import { useRef, type PointerEventHandler, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useMagnetic } from "@/hooks/useMagnetic";
import { useCoarsePointer } from "@/hooks/useCoarsePointer";

export type MagneticButtonProps = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "lime" | "outline";
  size?: "sm" | "md" | "lg";
  type?: "button" | "submit";
  strength?: number;
};

const VARIANT = {
  primary: "bg-forest text-white hover:bg-agri",
  lime: "bg-lime text-forest hover:bg-white",
  outline: "border border-forest/25 bg-white/80 text-forest hover:bg-forest/5",
} as const;

const SIZE = {
  sm: "min-h-11 px-4 text-xs",
  md: "min-h-11 px-5 text-sm",
  lg: "min-h-12 px-5 text-sm sm:px-7",
} as const;

export function MagneticButton({
  children,
  href,
  onClick,
  className,
  variant = "primary",
  size = "md",
  type = "button",
  strength = 12,
}: MagneticButtonProps) {
  const elementRef = useRef<HTMLElement | null>(null);
  const coarse = useCoarsePointer();
  const { onPointerMove, onPointerLeave } = useMagnetic(elementRef, {
    strength,
    disabled: coarse,
  });

  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-semibold uppercase tracking-wider transition touch-manipulation",
    "min-h-11 select-none",
    VARIANT[variant],
    SIZE[size],
    className,
  );

  if (href) {
    return (
      <Link
        href={href}
        className={classes}
        ref={elementRef as React.RefObject<HTMLAnchorElement>}
        onPointerMove={onPointerMove as unknown as PointerEventHandler<HTMLAnchorElement>}
        onPointerLeave={onPointerLeave}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={classes}
      ref={elementRef as React.RefObject<HTMLButtonElement>}
      onPointerMove={onPointerMove as unknown as PointerEventHandler<HTMLButtonElement>}
      onPointerLeave={onPointerLeave}
    >
      {children}
    </button>
  );
}

export default MagneticButton;
