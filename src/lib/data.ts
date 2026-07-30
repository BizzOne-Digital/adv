import { connectDB } from "@/lib/mongodb";
import { CONTACT } from "@/lib/contact";
import { toPlain } from "@/lib/serialize";
import {
  Activity,
  BlogPost,
  Event,
  FAQ,
  GalleryItem,
  Page,
  PricingItem,
  Product,
  Service,
  SiteSettings,
  TeamMember,
  Testimonial,
} from "@/models";
import type {
  Activity as ActivityType,
  BlogPost as BlogPostType,
  Event as EventType,
  FAQ as FAQType,
  GalleryItem as GalleryItemType,
  Page as PageType,
  PricingItem as PricingItemType,
  Product as ProductType,
  Service as ServiceType,
  SiteSettings as SiteSettingsType,
  TeamMember as TeamMemberType,
  Testimonial as TestimonialType,
} from "@/types";
import { SERVICE_LINKS } from "@/lib/navigation";

export const DEFAULT_SETTINGS: SiteSettingsType = {
  _id: "default",
  organizationName: CONTACT.organizationName,
  shortName: CONTACT.shortName,
  primaryEmail: CONTACT.primaryEmail,
  secondaryEmail: CONTACT.secondaryEmail,
  phone: CONTACT.phone,
  address: CONTACT.addressLine,
  city: CONTACT.city,
  province: CONTACT.province,
  postalCode: CONTACT.postalCode,
  country: CONTACT.country,
  mission:
    "To build lasting partnerships between Canada and Africa through agricultural knowledge exchange, trade, investment, and technology that improve food security and create economic opportunities for farming communities.",
  vision:
    "To become the leading platform connecting Canadian and African farmers for sustainable agriculture, innovation, and economic prosperity.",
  introEnabled: true,
  introText: "Connecting Agriculture. Growing Opportunity.",
  copyright: "© CAFBEX. All rights reserved.",
  defaultSeo: {
    title: "CAFBEX — Canada–Africa Farmers Business Exchange",
    description:
      "Connecting farmers, agribusinesses, investors, researchers, and policymakers to advance trade, innovation, and sustainable agricultural growth between Canada and Africa.",
    keywords: [
      "CAFBEX",
      "Canada Africa agriculture",
      "farmers business exchange",
      "agribusiness",
      "sustainable agriculture",
    ],
  },
  contactRecipient: CONTACT.primaryEmail,
  bookingRecipient: CONTACT.primaryEmail,
  dataVerificationWarnings: {
    postalCodePending: CONTACT.verification.postalCodePending,
    secondaryEmailPending: CONTACT.verification.secondaryEmailPending,
  },
  createdAt: new Date(0).toISOString(),
  updatedAt: new Date(0).toISOString(),
};

async function safeQuery<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    await connectDB();
    return await fn();
  } catch (error) {
    console.warn("[data] MongoDB unavailable — returning empty defaults.", error);
    return fallback;
  }
}

export async function getSettings(): Promise<SiteSettingsType> {
  return safeQuery(async () => {
    const doc = await SiteSettings.findOne().lean();
    if (!doc) return DEFAULT_SETTINGS;
    return toPlain<SiteSettingsType>(doc);
  }, DEFAULT_SETTINGS);
}

export async function getPublishedServices(): Promise<ServiceType[]> {
  return safeQuery(async () => {
    const docs = await Service.find({ status: "active" }).sort({ order: 1, name: 1 }).lean();
    return toPlain<ServiceType[]>(docs);
  }, []);
}

export async function getServiceBySlug(slug: string): Promise<ServiceType | null> {
  return safeQuery(async () => {
    const doc = await Service.findOne({ slug, status: "active" }).lean();
    return doc ? toPlain<ServiceType>(doc) : null;
  }, null);
}

export async function getEvents(options?: {
  featured?: boolean;
  limit?: number;
  upcomingOnly?: boolean;
}): Promise<EventType[]> {
  return safeQuery(async () => {
    const filter: Record<string, unknown> = { status: "published" };
    if (options?.featured) filter.featured = true;
    if (options?.upcomingOnly) filter.startDate = { $gte: new Date() };

    let query = Event.find(filter).sort({ startDate: 1 });
    if (options?.limit) query = query.limit(options.limit);

    const docs = await query.lean();
    return toPlain<EventType[]>(docs);
  }, []);
}

export async function getPastEvents(limit = 20): Promise<EventType[]> {
  return safeQuery(async () => {
    const docs = await Event.find({
      status: "published",
      startDate: { $lt: new Date() },
    })
      .sort({ startDate: -1 })
      .limit(limit)
      .lean();
    return toPlain<EventType[]>(docs);
  }, []);
}

export async function getEventBySlug(slug: string): Promise<EventType | null> {
  return safeQuery(async () => {
    const doc = await Event.findOne({ slug, status: "published" }).lean();
    return doc ? toPlain<EventType>(doc) : null;
  }, null);
}

export async function getGallery(options?: {
  featured?: boolean;
  category?: string;
  limit?: number;
}): Promise<GalleryItemType[]> {
  return safeQuery(async () => {
    const filter: Record<string, unknown> = { status: "published" };
    if (options?.featured) filter.featured = true;
    if (options?.category) filter.category = options.category;

    let query = GalleryItem.find(filter).sort({ order: 1, createdAt: -1 });
    if (options?.limit) query = query.limit(options.limit);

    const docs = await query.lean();
    return toPlain<GalleryItemType[]>(docs);
  }, []);
}

export async function getTeam(): Promise<TeamMemberType[]> {
  return safeQuery(async () => {
    const docs = await TeamMember.find({ status: "published" })
      .sort({ isLeadership: -1, order: 1, name: 1 })
      .lean();
    return toPlain<TeamMemberType[]>(docs);
  }, []);
}

export async function getProducts(options?: {
  featured?: boolean;
  category?: string;
  limit?: number;
}): Promise<ProductType[]> {
  return safeQuery(async () => {
    const filter: Record<string, unknown> = { status: "active" };
    if (options?.featured) filter.featured = true;
    if (options?.category) filter.category = options.category;

    let query = Product.find(filter).sort({ order: 1, name: 1 });
    if (options?.limit) query = query.limit(options.limit);

    const docs = await query.lean();
    return toPlain<ProductType[]>(docs);
  }, []);
}

export async function getProductBySlug(slug: string): Promise<ProductType | null> {
  return safeQuery(async () => {
    const doc = await Product.findOne({ slug, status: "active" }).lean();
    return doc ? toPlain<ProductType>(doc) : null;
  }, null);
}

export async function getApprovedTestimonials(options?: {
  featured?: boolean;
  limit?: number;
}): Promise<TestimonialType[]> {
  return safeQuery(async () => {
    const filter: Record<string, unknown> = { approved: true };
    if (options?.featured) filter.featured = true;

    let query = Testimonial.find(filter).sort({ order: 1, createdAt: -1 });
    if (options?.limit) query = query.limit(options.limit);

    const docs = await query.lean();
    return toPlain<TestimonialType[]>(docs);
  }, []);
}

export async function getPublishedBlogs(options?: {
  featured?: boolean;
  limit?: number;
  tag?: string;
}): Promise<BlogPostType[]> {
  return safeQuery(async () => {
    const filter: Record<string, unknown> = { status: "published" };
    if (options?.featured) filter.featured = true;
    if (options?.tag) filter.tags = options.tag;

    let query = BlogPost.find(filter).sort({ publishedAt: -1, createdAt: -1 });
    if (options?.limit) query = query.limit(options.limit);

    const docs = await query.lean();
    return toPlain<BlogPostType[]>(docs);
  }, []);
}

export async function getBlogBySlug(slug: string): Promise<BlogPostType | null> {
  return safeQuery(async () => {
    const doc = await BlogPost.findOne({ slug, status: "published" }).lean();
    return doc ? toPlain<BlogPostType>(doc) : null;
  }, null);
}

export async function getFAQs(category?: string): Promise<FAQType[]> {
  return safeQuery(async () => {
    const filter: Record<string, unknown> = { status: "active" };
    if (category) filter.category = category;

    const docs = await FAQ.find(filter).sort({ order: 1, question: 1 }).lean();
    return toPlain<FAQType[]>(docs);
  }, []);
}

export async function getPricingItems(): Promise<PricingItemType[]> {
  return safeQuery(async () => {
    const docs = await PricingItem.find({ status: "active" })
      .sort({ order: 1, title: 1 })
      .lean();
    return toPlain<PricingItemType[]>(docs);
  }, []);
}

export async function getActivities(options?: { limit?: number }): Promise<ActivityType[]> {
  return safeQuery(async () => {
    let query = Activity.find({ status: "active" }).sort({ order: 1, name: 1 });
    if (options?.limit) query = query.limit(options.limit);
    const docs = await query.lean();
    return toPlain<ActivityType[]>(docs);
  }, []);
}

export async function getPageBySlug(slug: string): Promise<PageType | null> {
  return safeQuery(async () => {
    const doc = await Page.findOne({ slug, status: "published" }).lean();
    return doc ? toPlain<PageType>(doc) : null;
  }, null);
}

/** Known service slugs from navigation — used for static generation & fallbacks. */
export function getKnownServiceSlugs(): string[] {
  return SERVICE_LINKS.map((s) => s.href.replace("/services/", ""));
}
