import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type StatsCardProps = {
  label: string;
  value: string | number;
  hint?: string;
  icon?: LucideIcon;
  className?: string;
};

export function StatsCard({
  label,
  value,
  hint,
  icon: Icon,
  className,
}: StatsCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-transparent p-5",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-white/45">
            {label}
          </p>
          <p className="mt-2 text-3xl font-semibold tabular-nums text-white">{value}</p>
          {hint ? <p className="mt-1 text-xs text-white/45">{hint}</p> : null}
        </div>
        {Icon ? (
          <div className="rounded-lg bg-lime/15 p-2 text-lime">
            <Icon className="h-5 w-5" />
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default StatsCard;
