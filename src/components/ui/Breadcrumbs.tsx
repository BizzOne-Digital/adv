import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type Crumb = {
  label: string;
  href?: string;
};

export type BreadcrumbsProps = {
  items: Crumb[];
  className?: string;
  light?: boolean;
};

export function Breadcrumbs({ items, className, light = false }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn(className)}>
      <ol className="flex flex-wrap items-center gap-1.5 text-xs sm:text-sm">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="inline-flex items-center gap-1.5">
              {index > 0 ? (
                <ChevronRight
                  className={cn("h-3.5 w-3.5", light ? "text-white/40" : "text-muted")}
                  aria-hidden
                />
              ) : null}
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className={cn(
                    "transition",
                    light ? "text-white/70 hover:text-white" : "text-muted hover:text-forest",
                  )}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={cn(light ? "text-white" : "text-forest", "font-medium")}
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumbs;
