import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type ContainerProps = {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "article" | "main";
  size?: "default" | "narrow" | "wide";
};

const SIZE = {
  narrow: "max-w-3xl",
  default: "max-w-7xl",
  wide: "max-w-[90rem]",
} as const;

export function Container({
  children,
  className,
  as: Comp = "div",
  size = "default",
}: ContainerProps) {
  return (
    <Comp className={cn("mx-auto w-full min-w-0 px-3 sm:px-6 lg:px-8", SIZE[size], className)}>
      {children}
    </Comp>
  );
}

export default Container;
