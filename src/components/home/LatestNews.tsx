import Link from "next/link";
import { ArrowUpRight, Newspaper } from "lucide-react";
import { format } from "date-fns";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";

export type NewsPreviewItem = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  publishedAt: string | Date;
  coverImage?: string;
  category?: string;
  /** Override article link (e.g. fallback cards → /blog) */
  href?: string;
};

export type LatestNewsProps = {
  articles?: NewsPreviewItem[] | null;
  className?: string;
};

export function LatestNews({ articles, className }: LatestNewsProps) {
  const list = articles?.filter(Boolean) ?? [];

  return (
    <section className={cn("bg-surface py-12 sm:py-24", className)}>
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Blog"
            title="Latest news"
            description="Updates, insights, and stories from the Canada–Africa agricultural exchange."
          />
          <Link
            href="/blog"
            className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold uppercase tracking-wider text-agri transition hover:text-forest"
          >
            All articles
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        {list.length === 0 ? (
          <EmptyState
            className="mt-10 border border-dashed border-border bg-white"
            icon={Newspaper}
            title="No articles published yet"
            description="When CAFBEX publishes blog posts, the latest three will appear here."
          />
        ) : (
          <ul className="mt-10 grid gap-5 lg:grid-cols-3">
            {list.slice(0, 3).map((article, index) => {
              const date =
                typeof article.publishedAt === "string"
                  ? new Date(article.publishedAt)
                  : article.publishedAt;
              const href = article.href || `/blog/${article.slug}`;

              return (
                <Reveal key={article.id} delay={index * 0.05}>
                  <li>
                    <article className="flex h-full flex-col overflow-hidden border border-border bg-white transition hover:border-agri/40">
                      {article.coverImage ? (
                        <Link href={href} className="relative aspect-[16/10] block">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={article.coverImage}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        </Link>
                      ) : null}
                      <div className="flex flex-1 flex-col p-5">
                        <p className="text-xs text-muted">
                          {article.category ? `${article.category} · ` : ""}
                          {format(date, "MMM d, yyyy")}
                        </p>
                        <h3 className="mt-2 text-lg font-semibold text-forest">
                          <Link href={href} className="hover:text-agri">
                            {article.title}
                          </Link>
                        </h3>
                        {article.excerpt ? (
                          <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-muted">
                            {article.excerpt}
                          </p>
                        ) : null}
                        <Link
                          href={href}
                          className="mt-4 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-agri"
                        >
                          Read more
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </article>
                  </li>
                </Reveal>
              );
            })}
          </ul>
        )}
      </Container>
    </section>
  );
}

export default LatestNews;
