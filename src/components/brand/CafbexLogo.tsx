import { cn } from "@/lib/utils";

export type CafbexLogoProps = {
  className?: string;
  variant?: "full" | "mark" | "wordmark";
  size?: "sm" | "md" | "lg" | "xl";
  /** Invert to light colors for dark backgrounds */
  inverted?: boolean;
};

const SIZE_MAP = {
  sm: { mark: 28, text: 14, gap: 8 },
  md: { mark: 36, text: 18, gap: 10 },
  lg: { mark: 48, text: 24, gap: 12 },
  xl: { mark: 64, text: 32, gap: 14 },
} as const;

function LogoMark({
  size,
  className,
  inverted,
}: {
  size: number;
  className?: string;
  inverted?: boolean;
}) {
  const forest = inverted ? "#C6FF4E" : "#0B3D2E";
  const agri = inverted ? "#E8C547" : "#1B6B45";
  const lime = inverted ? "#FFFFFF" : "#C6FF4E";
  const red = "#C8102E";
  const blue = inverted ? "#7EB8D8" : "#1E6B9F";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden={true}
    >
      <defs>
        <linearGradient id="cafbex-seed" x1="32" y1="18" x2="32" y2="46" gradientUnits="userSpaceOnUse">
          <stop stopColor={lime} />
          <stop offset="1" stopColor={agri} />
        </linearGradient>
        <linearGradient id="cafbex-leaf" x1="10" y1="8" x2="54" y2="56" gradientUnits="userSpaceOnUse">
          <stop stopColor={forest} />
          <stop offset="1" stopColor={agri} />
        </linearGradient>
      </defs>

      {/* Soft ground disc */}
      <circle cx="32" cy="32" r="30" fill={inverted ? "rgba(255,255,255,0.08)" : "rgba(11,61,46,0.08)"} />

      {/* Abstract maple leaf (Canada) — left lobe */}
      <path
        d="M22 14c1.2-3.5 4.8-5.5 8.2-4.2 1.6.6 2.6 1.6 3.2 2.8.5-1.4 1.7-2.6 3.4-3.2 3.4-1.2 7 1 8 4.6.4 1.4.2 2.8-.4 4 2.2-.2 4.4.8 5.6 2.6 1.8 2.8.6 6.6-2.4 8.2-1.2.6-2.6.8-3.8.4.8 1.8.6 4-.8 5.6-1.8 2-5 2.2-7 .4-.6-.6-1-1.2-1.2-2-.2.8-.6 1.6-1.4 2.2-2 1.6-5.2 1.2-6.8-.8-1.2-1.6-1.2-3.8-.2-5.4-1.4.2-2.8-.2-3.8-1.2-2.4-2.2-2.2-6 .4-8 1.4-1 3.2-1.4 4.8-1-.8-1.4-.8-3.2.2-4.8z"
        fill="url(#cafbex-leaf)"
        opacity="0.92"
      />

      {/* Abstract Africa silhouette — right overlay */}
      <path
        d="M38.5 22.5c2.2-.4 4.4.2 5.8 1.8 1.2 1.4 1.6 3.4 1.2 5.2-.2 1 .2 2 1 2.6 1.4 1 2.2 2.8 1.8 4.6-.4 2-2 3.6-4 4.2-1 .4-1.6 1.4-1.4 2.4.4 2-1 4-3 4.6-1.4.4-2.8 0-3.8-1-.6-.6-1.6-.8-2.4-.4-1.6.8-3.6.2-4.6-1.2-1-1.4-.8-3.4.4-4.6.6-.6.8-1.6.4-2.4-.8-1.6-.4-3.6 1-4.8 1-.8 1.2-2.2.6-3.4-.8-1.6 0-3.6 1.6-4.4 1.6-.8 3.6-.6 5 0z"
        fill={blue}
        opacity="0.85"
      />

      {/* Seed / sprout motif at center */}
      <ellipse cx="32" cy="34" rx="5.5" ry="7.5" fill="url(#cafbex-seed)" />
      <path
        d="M32 28c0-4 2.2-7.5 5.5-9.5"
        stroke={lime}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M32 28c0-3.2-1.8-6-4.5-7.5"
        stroke={agri}
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
        opacity="0.9"
      />

      {/* Small maple tip accent */}
      <circle cx="32" cy="12" r="2" fill={red} />
    </svg>
  );
}

export function CafbexLogo({
  className,
  variant = "full",
  size = "md",
  inverted = false,
}: CafbexLogoProps) {
  const dims = SIZE_MAP[size];
  const textColor = inverted ? "text-white" : "text-forest";

  if (variant === "mark") {
    return (
      <span className={cn("inline-flex shrink-0", className)} aria-label="CAFBEX">
        <LogoMark size={dims.mark} inverted={inverted} />
      </span>
    );
  }

  if (variant === "wordmark") {
    return (
      <span
        className={cn(
          "inline-flex items-baseline font-semibold tracking-[0.18em]",
          textColor,
          className,
        )}
        style={{ fontSize: dims.text }}
        aria-label="CAFBEX"
      >
        CAFBEX
      </span>
    );
  }

  return (
    <span
      className={cn("inline-flex items-center", className)}
      style={{ gap: dims.gap }}
      aria-label="CAFBEX — Canada–Africa Farmers Business Exchange"
    >
      <LogoMark size={dims.mark} inverted={inverted} />
      <span
        className={cn("font-semibold tracking-[0.18em]", textColor)}
        style={{ fontSize: dims.text }}
      >
        CAFBEX
      </span>
    </span>
  );
}

export default CafbexLogo;
