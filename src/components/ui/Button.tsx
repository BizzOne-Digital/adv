"use client";

import Link from "next/link";
import {
  forwardRef,
  useRef,
  type ButtonHTMLAttributes,
  type PointerEvent,
  type ReactNode,
  type Ref,
} from "react";
import { cn } from "@/lib/utils";
import { useMagnetic } from "@/hooks/useMagnetic";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "lime";
type Size = "sm" | "md" | "lg";

const VARIANT: Record<Variant, string> = {
  primary: "bg-forest text-white hover:bg-agri focus-visible:ring-forest/40",
  secondary: "bg-agri text-white hover:bg-forest focus-visible:ring-agri/40",
  outline:
    "border border-forest/25 bg-transparent text-forest hover:bg-forest/5 focus-visible:ring-forest/30",
  ghost: "bg-transparent text-forest hover:bg-forest/5 focus-visible:ring-forest/20",
  lime: "bg-lime text-forest hover:bg-white focus-visible:ring-lime/50",
};

const SIZE_CLS: Record<Size, string> = {
  sm: "min-h-11 px-4 text-xs",
  md: "min-h-11 px-5 text-sm",
  lg: "min-h-12 px-5 text-sm sm:px-7",
};

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  magnetic?: boolean;
  href?: string;
  children: ReactNode;
  className?: string;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = "primary",
    size = "md",
    magnetic = false,
    href,
    children,
    className,
    type = "button",
    disabled,
    ...rest
  },
  forwardedRef,
) {
  const localRef = useRef<HTMLButtonElement | null>(null);
  const { onPointerMove, onPointerLeave } = useMagnetic(localRef, {
    disabled: !magnetic || disabled,
    strength: 10,
  });

  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-semibold uppercase tracking-wider transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    VARIANT[variant],
    SIZE_CLS[size],
    className,
  );

  const setRefs = (node: HTMLButtonElement | null) => {
    localRef.current = node;
    if (typeof forwardedRef === "function") forwardedRef(node);
    else if (forwardedRef) forwardedRef.current = node;
  };

  if (href) {
    return (
      <Link
        href={href}
        className={classes}
        ref={localRef as unknown as Ref<HTMLAnchorElement>}
        onPointerMove={
          magnetic
            ? (e) => onPointerMove(e as unknown as PointerEvent<HTMLButtonElement>)
            : undefined
        }
        onPointerLeave={magnetic ? onPointerLeave : undefined}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      ref={setRefs}
      type={type}
      disabled={disabled}
      className={classes}
      onPointerMove={magnetic ? onPointerMove : rest.onPointerMove}
      onPointerLeave={magnetic ? onPointerLeave : rest.onPointerLeave}
      style={rest.style}
      {...rest}
    >
      {children}
    </button>
  );
});

export default Button;
