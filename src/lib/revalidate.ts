import { revalidatePath, revalidateTag } from "next/cache";

export const CACHE_TAGS = {
  settings: "settings",
  pages: "pages",
  services: "services",
  activities: "activities",
  events: "events",
  gallery: "gallery",
  team: "team",
  products: "products",
  pricing: "pricing",
  testimonials: "testimonials",
  blog: "blog",
  faq: "faq",
} as const;

export type CacheTag = (typeof CACHE_TAGS)[keyof typeof CACHE_TAGS];

export interface RevalidateOptions {
  paths?: string[];
  tags?: Array<CacheTag | string>;
  /** Next.js 16 cache life profile; defaults to "max". */
  profile?: string;
}

/**
 * Revalidate public paths and cache tags after admin publishes content.
 */
export function revalidateContent(options: RevalidateOptions): void {
  const profile = options.profile ?? "max";

  if (options.tags) {
    for (const tag of options.tags) {
      revalidateTag(tag, profile);
    }
  }

  if (options.paths) {
    for (const path of options.paths) {
      revalidatePath(path);
    }
  }
}

export function revalidateSettings(): void {
  revalidateContent({
    tags: [CACHE_TAGS.settings],
    paths: ["/", "/contact", "/booking", "/about"],
  });
}

export function revalidatePage(slug: string): void {
  const path = slug === "home" || slug === "index" ? "/" : `/${slug}`;
  revalidateContent({
    tags: [CACHE_TAGS.pages, `page:${slug}`],
    paths: [path],
  });
}

export function revalidateService(slug?: string): void {
  const paths = ["/services"];
  if (slug) {
    paths.push(`/services/${slug}`);
  }
  revalidateContent({
    tags: [CACHE_TAGS.services, ...(slug ? [`service:${slug}`] : [])],
    paths,
  });
}

export function revalidateEvent(slug?: string): void {
  const paths = ["/events"];
  if (slug) {
    paths.push(`/events/${slug}`);
  }
  revalidateContent({
    tags: [CACHE_TAGS.events, ...(slug ? [`event:${slug}`] : [])],
    paths,
  });
}

export function revalidateBlog(slug?: string): void {
  const paths = ["/blog", "/"];
  if (slug) {
    paths.push(`/blog/${slug}`);
  }
  revalidateContent({
    tags: [CACHE_TAGS.blog, ...(slug ? [`blog:${slug}`] : [])],
    paths,
  });
}

export function revalidateGallery(): void {
  revalidateContent({
    tags: [CACHE_TAGS.gallery],
    paths: ["/gallery", "/"],
  });
}

export function revalidateProducts(slug?: string): void {
  const paths = ["/products", "/"];
  if (slug) {
    paths.push(`/products/${slug}`);
  }
  revalidateContent({
    tags: [CACHE_TAGS.products, ...(slug ? [`product:${slug}`] : [])],
    paths,
  });
}
