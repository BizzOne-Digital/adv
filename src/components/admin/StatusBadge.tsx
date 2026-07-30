import { cn } from "@/lib/utils";

const STYLES: Record<string, string> = {
  published: "bg-lime/15 text-lime border-lime/30",
  draft: "bg-wheat/15 text-wheat border-wheat/30",
  active: "bg-lime/15 text-lime border-lime/30",
  inactive: "bg-white/10 text-white/60 border-white/15",
  new: "bg-tech-blue/20 text-sky-300 border-tech-blue/30",
  reviewed: "bg-wheat/15 text-wheat border-wheat/30",
  scheduled: "bg-agri/25 text-emerald-300 border-agri/40",
  completed: "bg-lime/15 text-lime border-lime/30",
  cancelled: "bg-canada-red/20 text-red-300 border-canada-red/30",
  "in-progress": "bg-wheat/15 text-wheat border-wheat/30",
  resolved: "bg-lime/15 text-lime border-lime/30",
  archived: "bg-white/10 text-white/50 border-white/15",
  approved: "bg-lime/15 text-lime border-lime/30",
  pending: "bg-wheat/15 text-wheat border-wheat/30",
  featured: "bg-lime/15 text-lime border-lime/30",
};

export type StatusBadgeProps = {
  status: string;
  className?: string;
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const key = status.toLowerCase();
  return (
    <span
      className={cn(
        "inline-flex items-center rounded border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
        STYLES[key] || "bg-white/10 text-white/70 border-white/15",
        className,
      )}
    >
      {status.replace(/-/g, " ")}
    </span>
  );
}

export default StatusBadge;
