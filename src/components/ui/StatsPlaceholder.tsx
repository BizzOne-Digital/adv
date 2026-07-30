import { cn } from "@/lib/utils";

export type StatItem = {
  label: string;
  value: string | number;
  hint?: string;
};

export type StatsPlaceholderProps = {
  /** Only render when this contains real, verified metrics. Empty/undefined hides the section. */
  stats?: StatItem[] | null;
  className?: string;
  title?: string;
};

/**
 * Displays organizational stats only when real data is provided.
 * Never invents figures — returns null if stats are missing or empty.
 */
export function StatsPlaceholder({ stats, className, title }: StatsPlaceholderProps) {
  if (!stats || stats.length === 0) return null;

  const valid = stats.filter(
    (s) => s.label && s.value !== "" && s.value !== null && s.value !== undefined,
  );
  if (valid.length === 0) return null;

  return (
    <section className={cn("py-12", className)} aria-label={title ?? "Key figures"}>
      {title ? (
        <h2 className="mb-8 text-center text-sm font-semibold uppercase tracking-[0.2em] text-agri">
          {title}
        </h2>
      ) : null}
      <dl className="mx-auto grid max-w-5xl grid-cols-2 gap-6 px-4 sm:grid-cols-4 sm:gap-8">
        {valid.map((stat) => (
          <div key={stat.label} className="text-center">
            <dt className="text-xs uppercase tracking-wider text-muted">{stat.label}</dt>
            <dd className="mt-2 text-3xl font-semibold text-forest sm:text-4xl">{stat.value}</dd>
            {stat.hint ? <p className="mt-1 text-xs text-muted">{stat.hint}</p> : null}
          </div>
        ))}
      </dl>
    </section>
  );
}

export default StatsPlaceholder;
