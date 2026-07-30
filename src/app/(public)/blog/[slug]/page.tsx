import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { Container } from "@/components/ui/Container";
import { CTASection } from "@/components/ui/CTASection";
import { ImageGrid } from "@/components/ui/ImageGrid";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { RichText } from "@/components/ui/RichText";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getBlogBySlug, getPublishedBlogs } from "@/lib/data";
import { buildMetadata, pageImages } from "@/lib/seo";
import { idString } from "@/lib/serialize";
import { resolveCmsImage } from "@/lib/upload/resolve-image";
import { readingTime, absoluteUrl } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);
  if (!post) return buildMetadata({ title: "Article", path: `/blog/${slug}`, noIndex: true });
  return buildMetadata({
    title: post.seo?.title || post.title,
    description: post.seo?.description || post.excerpt,
    path: `/blog/${slug}`,
    ogImage: post.seo?.ogImage || post.coverImage?.url,
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);
  if (!post) notFound();

  const related = (await getPublishedBlogs({ limit: 4 })).filter((p) => p.slug !== slug).slice(0, 3);
  const images = pageImages("blog");
  const date = post.publishedAt || post.createdAt;
  const minutes = post.readingTimeMinutes || readingTime(post.content);
  const shareUrl = absoluteUrl(`/blog/${post.slug}`);

  return (
    <>
      <PageHero
        eyebrow="Article"
        title={post.title}
        subtitle={post.excerpt}
        imageSrc={resolveCmsImage(
          post.coverImage?.url,
          `/images/blog/${post.slug}/hero.jpg`,
        )}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: post.title },
        ]}
      />

      <article className="bg-white py-16 sm:py-20">
        <Container className="max-w-3xl">
          <p className="text-sm text-muted">
            {format(new Date(date), "MMMM d, yyyy")}
            {post.authorName ? ` · ${post.authorName}` : ""}
            {` · ${minutes} min read`}
          </p>

          <Reveal className="mt-8">
            <RichText html={post.content} />
          </Reveal>

          {post.images && post.images.length > 0 ? (
            <div className="mt-10 grid gap-3 sm:grid-cols-2">
              {post.images.slice(0, 4).map((img) => (
                <ImagePlaceholder
                  key={img.url}
                  src={img.url}
                  alt={img.alt || post.title}
                  className="aspect-[4/3]"
                />
              ))}
            </div>
          ) : (
            <Reveal className="mt-10">
              <ImageGrid images={images} />
            </Reveal>
          )}

          {post.tags && post.tags.length > 0 ? (
            <div className="mt-8 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-surface px-3 py-1 text-xs font-medium text-forest"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}

          <div className="mt-10 border-t border-border pt-6 text-sm text-muted">
            <p className="font-medium text-forest">Share</p>
            <div className="mt-2 flex flex-wrap gap-3">
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-agri hover:text-forest"
              >
                LinkedIn
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-agri hover:text-forest"
              >
                X / Twitter
              </a>
            </div>
          </div>

          <p className="mt-8 text-sm">
            <Link href="/blog" className="text-agri hover:text-forest">
              ← Back to blog
            </Link>
          </p>
        </Container>
      </article>

      {related.length > 0 ? (
        <section className="bg-surface py-16">
          <Container>
            <SectionHeading title="Related articles" />
            <ul className="mt-8 grid gap-4 lg:grid-cols-3">
              {related.map((r) => (
                <li key={idString(r)}>
                  <Link
                    href={`/blog/${r.slug}`}
                    className="block border border-border bg-white p-5 transition hover:border-agri/40"
                  >
                    <h3 className="font-semibold text-forest">{r.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm text-muted">{r.excerpt}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}

      <CTASection title="Continue the conversation" description="Inquire about topics covered in this article." />
    </>
  );
}
