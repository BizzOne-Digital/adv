import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/utils";
import {
  getEvents,
  getKnownServiceSlugs,
  getProducts,
  getPublishedBlogs,
} from "@/lib/data";
import { SERVICE_LINKS } from "@/lib/navigation";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths = [
    "/",
    "/about",
    "/services",
    "/activities",
    "/events",
    "/gallery",
    "/team",
    "/booking",
    "/products",
    "/pricing",
    "/testimonials",
    "/faq",
    "/blog",
    "/contact",
    "/privacy-policy",
    "/terms-and-conditions",
    ...SERVICE_LINKS.map((s) => s.href),
  ];

  const [blogs, events, products] = await Promise.all([
    getPublishedBlogs(),
    getEvents(),
    getProducts(),
  ]);

  // Ensure known service slugs are covered even if SERVICE_LINKS changes
  const servicePaths = getKnownServiceSlugs().map((slug) => `/services/${slug}`);

  const entries: MetadataRoute.Sitemap = [
    ...new Set([...staticPaths, ...servicePaths]),
  ].map((path) => ({
    url: absoluteUrl(path),
    lastModified: new Date(),
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));

  for (const post of blogs) {
    entries.push({
      url: absoluteUrl(`/blog/${post.slug}`),
      lastModified: new Date(post.updatedAt || post.publishedAt || Date.now()),
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  for (const event of events) {
    entries.push({
      url: absoluteUrl(`/events/${event.slug}`),
      lastModified: new Date(event.updatedAt || event.startDate),
      changeFrequency: "weekly",
      priority: 0.6,
    });
  }

  for (const product of products) {
    entries.push({
      url: absoluteUrl(`/products/${product.slug}`),
      lastModified: new Date(product.updatedAt || Date.now()),
      changeFrequency: "monthly",
      priority: 0.5,
    });
  }

  return entries;
}
