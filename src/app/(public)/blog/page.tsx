import type { Metadata } from "next";
import Link from "next/link";
import { Newspaper } from "lucide-react";
import { format } from "date-fns";
import { Container } from "@/components/ui/Container";
import { CTASection } from "@/components/ui/CTASection";
import { EmptyState } from "@/components/ui/EmptyState";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getPublishedBlogs } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import { idString } from "@/lib/serialize";
import { resolveCmsImage } from "@/lib/upload/resolve-image";
import { readingTime } from "@/lib/utils";

export const metadata: Metadata = buildMetadata({
  title: "Blog",
  description:
    "News and insights from CAFBEX on Canada–Africa agricultural cooperation, technology, and opportunity.",
  path: "/blog",
});

export default async function BlogPage() {
  const posts = await getPublishedBlogs();

  return (
    <>
      <PageHero
        eyebrow="Blog"
        title="News & insights"
        subtitle="Published articles appear here. Draft topics stay in the admin portal until released."
        imageSrc="/images/blog/hero.jpg"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Blog" }]}
      />

      <section className="bg-white py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Articles"
            title="Latest from CAFBEX"
            description="Stories and perspectives on agricultural exchange between Canada and Africa."
          />

          {posts.length === 0 ? (
            <EmptyState
              className="mt-10 border border-dashed border-border bg-surface"
              icon={Newspaper}
              title="No articles published yet"
              description="When CAFBEX publishes blog posts, they will appear here with reading time and related links."
            />
          ) : (
            <ul className="mt-10 grid gap-6 lg:grid-cols-3">
              {posts.map((post, i) => {
                const date = post.publishedAt || post.createdAt;
                return (
                  <Reveal key={idString(post)} delay={i * 0.04}>
                    <li>
                      <article className="flex h-full flex-col overflow-hidden border border-border transition hover:border-agri/40">
                        <Link href={`/blog/${post.slug}`} className="relative aspect-[16/10] block">
                          <ImagePlaceholder
                            src={resolveCmsImage(
                              post.coverImage?.url,
                              `/images/blog/${post.slug}.jpg`,
                            )}
                            alt={post.title}
                            className="absolute inset-0 h-full w-full"
                          />
                        </Link>
                        <div className="flex flex-1 flex-col p-5">
                          <p className="text-xs text-muted">
                            {format(new Date(date), "MMM d, yyyy")}
                            {" · "}
                            {post.readingTimeMinutes || readingTime(post.content)} min read
                          </p>
                          <h3 className="mt-2 text-lg font-semibold text-forest">
                            <Link href={`/blog/${post.slug}`} className="hover:text-agri">
                              {post.title}
                            </Link>
                          </h3>
                          <p className="mt-2 line-clamp-3 flex-1 text-sm text-muted">
                            {post.excerpt}
                          </p>
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

      <CTASection title="Want updates from CAFBEX?" description="Reach out to stay informed about programmes and publications." />
    </>
  );
}
