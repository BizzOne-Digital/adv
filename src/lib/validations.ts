import { z } from "zod";

const publishStatusSchema = z.enum(["draft", "published"]);
const activeStatusSchema = z.enum(["active", "inactive"]);

const mediaRefSchema = z.object({
  url: z.string().url(),
  publicId: z.string().optional(),
  alt: z.string().max(300).optional(),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  caption: z.string().max(500).optional(),
});

const ctaSchema = z.object({
  label: z.string().max(120).optional(),
  href: z.string().max(500).optional(),
  variant: z.enum(["primary", "secondary", "outline", "ghost"]).optional(),
});

const seoSchema = z.object({
  title: z.string().max(120).optional(),
  description: z.string().max(320).optional(),
  ogImage: z.string().url().optional().or(z.literal("")),
  canonicalUrl: z.string().url().optional().or(z.literal("")),
  noIndex: z.boolean().optional(),
});

const socialLinksSchema = z.object({
  linkedin: z.string().url().optional().or(z.literal("")),
  twitter: z.string().url().optional().or(z.literal("")),
  facebook: z.string().url().optional().or(z.literal("")),
  instagram: z.string().url().optional().or(z.literal("")),
  youtube: z.string().url().optional().or(z.literal("")),
  website: z.string().url().optional().or(z.literal("")),
});

const honeypotSchema = z.string().max(0).optional().or(z.literal(""));

export const bookingTypeSchema = z.enum([
  "general-meeting",
  "farmer-participation",
  "agribusiness",
  "investor-meeting",
  "partnership",
  "event-participation",
  "exhibition",
  "training",
  "trade",
  "media",
]);

export const bookingSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  organization: z.string().trim().max(160).optional(),
  role: z.string().trim().max(120).optional(),
  country: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(40).optional(),
  bookingType: bookingTypeSchema,
  preferredDate: z.coerce.date().optional(),
  preferredTime: z.string().trim().max(40).optional(),
  timezone: z.string().trim().max(80).optional(),
  areasOfInterest: z.array(z.string().trim().max(100)).max(20).optional(),
  message: z.string().trim().min(10).max(5000),
  consent: z.literal(true, {
    error: "Consent is required to submit a booking request.",
  }),
  website: honeypotSchema,
});

export const inquiryTypeSchema = z.enum([
  "general",
  "farmer",
  "agribusiness",
  "investment",
  "partnership",
  "media",
]);

export const inquirySchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(40).optional(),
  organization: z.string().trim().max(160).optional(),
  country: z.string().trim().max(100).optional(),
  inquiryType: inquiryTypeSchema,
  subject: z.string().trim().max(200).optional(),
  message: z.string().trim().min(10).max(5000),
  consent: z.literal(true, {
    error: "Consent is required to submit an inquiry.",
  }),
  website: honeypotSchema,
});

export const contactSchema = inquirySchema;

export const loginSchema = z.object({
  email: z.string().trim().email().max(200),
  password: z.string().min(8).max(128),
});

export const pageSectionSchema = z.object({
  _id: z.string().optional(),
  key: z.string().trim().min(1).max(80),
  eyebrow: z.string().trim().max(120).optional(),
  heading: z.string().trim().max(200).optional(),
  subheading: z.string().trim().max(400).optional(),
  body: z.string().max(50_000).optional(),
  bulletPoints: z.array(z.string().trim().max(500)).max(30).optional(),
  images: z.array(mediaRefSchema).max(20).optional(),
  background: z.string().max(200).optional(),
  layout: z.string().max(80).optional(),
  ctas: z.array(ctaSchema).max(5).optional(),
  visible: z.boolean().default(true),
  order: z.number().int().min(0).default(0),
  customFields: z
    .record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.null()]))
    .optional(),
});

export const pageSchema = z.object({
  title: z.string().trim().min(2).max(200),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be URL-safe lowercase."),
  summary: z.string().trim().max(500).optional(),
  sections: z.array(pageSectionSchema).max(40).default([]),
  status: publishStatusSchema.default("draft"),
  seo: seoSchema.optional(),
  publishedAt: z.coerce.date().optional().nullable(),
});

export const testimonialSchema = z.object({
  name: z.string().trim().min(2).max(120),
  role: z.string().trim().max(160).optional(),
  organization: z.string().trim().max(160).optional(),
  country: z.string().trim().max(100).optional(),
  quote: z.string().trim().min(10).max(2000),
  image: mediaRefSchema.optional(),
  featured: z.boolean().default(false),
  approved: z.boolean().default(false),
  isSample: z.boolean().default(false),
  order: z.number().int().min(0).default(0),
});

export const bookingAdminUpdateSchema = z.object({
  status: z
    .enum(["new", "reviewed", "scheduled", "completed", "cancelled"])
    .optional(),
  adminNotes: z.string().max(5000).optional(),
});

export const inquiryAdminUpdateSchema = z.object({
  status: z
    .enum(["new", "in-progress", "resolved", "archived"])
    .optional(),
  adminNotes: z.string().max(5000).optional(),
});

export const mediaAssetSchema = z.object({
  publicId: z.string().trim().min(1).max(300),
  url: z.string().url(),
  secureUrl: z.string().url(),
  resourceType: z.enum(["image", "video", "raw"]).default("image"),
  format: z.string().max(20).optional(),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  bytes: z.number().int().nonnegative().optional(),
  folder: z.string().max(200).optional(),
  alt: z.string().max(300).optional(),
  caption: z.string().max(500).optional(),
  tags: z.array(z.string().trim().max(60)).max(30).optional(),
});

export const blogSchema = z.object({
  title: z.string().trim().min(3).max(200),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be URL-safe lowercase."),
  excerpt: z.string().trim().min(10).max(500),
  content: z.string().min(20).max(200_000),
  coverImage: mediaRefSchema.optional(),
  images: z.array(mediaRefSchema).max(30).optional(),
  categoryIds: z.array(z.string()).max(10).optional(),
  tags: z.array(z.string().trim().max(60)).max(30).optional(),
  authorName: z.string().trim().max(120).optional(),
  featured: z.boolean().default(false),
  status: publishStatusSchema.default("draft"),
  publishedAt: z.coerce.date().optional().nullable(),
  seo: seoSchema.optional(),
});

export const productSchema = z.object({
  name: z.string().trim().min(2).max(200),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  category: z.string().trim().min(2).max(120),
  countryOfOrigin: z.string().trim().max(100).optional(),
  summary: z.string().trim().min(10).max(500),
  description: z.string().min(20).max(50_000),
  images: z.array(mediaRefSchema).max(20).optional(),
  availability: z.string().trim().max(200).optional(),
  minimumOrder: z.string().trim().max(200).optional(),
  certification: z.string().trim().max(300).optional(),
  supplierInfo: z.string().trim().max(1000).optional(),
  featured: z.boolean().default(false),
  status: activeStatusSchema.default("inactive"),
  order: z.number().int().min(0).default(0),
  seo: seoSchema.optional(),
});

export const eventSchema = z.object({
  title: z.string().trim().min(3).max(200),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  summary: z.string().trim().min(10).max(500),
  description: z.string().min(20).max(100_000),
  category: z.string().trim().max(100).optional(),
  location: z.string().trim().max(200).optional(),
  venue: z.string().trim().max(200).optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional().nullable(),
  timezone: z.string().trim().max(80).optional(),
  images: z.array(mediaRefSchema).max(20).optional(),
  agenda: z
    .array(
      z.object({
        time: z.string().max(40).optional(),
        title: z.string().min(1).max(200),
        description: z.string().max(1000).optional(),
        speaker: z.string().max(120).optional(),
      }),
    )
    .max(50)
    .optional(),
  speakers: z
    .array(
      z.object({
        name: z.string().min(1).max(120),
        role: z.string().max(120).optional(),
        organization: z.string().max(160).optional(),
        bio: z.string().max(2000).optional(),
        image: mediaRefSchema.optional(),
      }),
    )
    .max(40)
    .optional(),
  capacity: z.number().int().positive().optional(),
  registrationDeadline: z.coerce.date().optional().nullable(),
  registrationUrl: z.string().url().optional().or(z.literal("")),
  contactEmail: z.string().email().optional().or(z.literal("")),
  contactPhone: z.string().max(40).optional(),
  status: publishStatusSchema.default("draft"),
  featured: z.boolean().default(false),
  seo: seoSchema.optional(),
});

export const gallerySchema = z.object({
  title: z.string().trim().min(2).max(200),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  caption: z.string().trim().max(500).optional(),
  category: z.string().trim().min(2).max(100),
  mediaType: z.enum(["image", "video"]).default("image"),
  media: mediaRefSchema,
  location: z.string().trim().max(200).optional(),
  date: z.coerce.date().optional().nullable(),
  activitySlug: z.string().max(200).optional(),
  eventSlug: z.string().max(200).optional(),
  status: publishStatusSchema.default("draft"),
  featured: z.boolean().default(false),
  order: z.number().int().min(0).default(0),
});

export const teamSchema = z.object({
  name: z.string().trim().min(2).max(120),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  role: z.string().trim().min(2).max(160),
  bio: z.string().max(5000).optional(),
  image: mediaRefSchema.optional(),
  socialLinks: socialLinksSchema.optional(),
  department: z.string().trim().max(120).optional(),
  isLeadership: z.boolean().default(false),
  status: publishStatusSchema.default("draft"),
  order: z.number().int().min(0).default(0),
});

export const settingsSchema = z.object({
  organizationName: z.string().trim().min(2).max(200),
  shortName: z.string().trim().min(2).max(40),
  logo: mediaRefSchema.optional(),
  favicon: mediaRefSchema.optional(),
  primaryEmail: z.string().trim().email(),
  secondaryEmail: z.string().trim().email().optional().or(z.literal("")),
  phone: z.string().trim().min(5).max(40),
  address: z.string().trim().min(5).max(300),
  city: z.string().trim().min(2).max(100),
  province: z.string().trim().min(2).max(100),
  postalCode: z.string().trim().min(3).max(20),
  country: z.string().trim().min(2).max(100),
  mapEmbed: z.string().max(5000).optional(),
  mission: z.string().trim().min(20).max(5000),
  vision: z.string().trim().min(20).max(5000),
  socialLinks: socialLinksSchema.optional(),
  footerContent: z.string().max(5000).optional(),
  introEnabled: z.boolean().default(true),
  introText: z.string().trim().max(300).default("Connecting Agriculture. Growing Opportunity."),
  copyright: z.string().trim().max(300),
  defaultSeo: z.object({
    title: z.string().trim().min(3).max(120),
    description: z.string().trim().min(10).max(320),
    ogImage: z.string().url().optional().or(z.literal("")),
    keywords: z.array(z.string().max(60)).max(30).optional(),
  }),
  analyticsIds: z
    .object({
      googleAnalytics: z.string().max(40).optional(),
      googleTagManager: z.string().max(40).optional(),
      metaPixel: z.string().max(40).optional(),
    })
    .optional(),
  contactRecipient: z.string().trim().email(),
  bookingRecipient: z.string().trim().email(),
  dataVerificationWarnings: z.object({
    postalCodePending: z.boolean().default(true),
    secondaryEmailPending: z.boolean().default(true),
  }),
});

export const faqSchema = z.object({
  question: z.string().trim().min(5).max(400),
  answer: z.string().trim().min(5).max(10_000),
  category: z.string().trim().min(2).max(100),
  status: activeStatusSchema.default("active"),
  order: z.number().int().min(0).default(0),
});

export const pricingSchema = z.object({
  title: z.string().trim().min(2).max(200),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  category: z.string().trim().min(2).max(120),
  description: z.string().trim().min(10).max(5000),
  inclusions: z.array(z.string().trim().max(300)).max(40).optional(),
  priceVisibility: z.enum(["contact", "amount", "hidden"]).default("contact"),
  amount: z.number().nonnegative().optional(),
  currency: z.string().trim().max(10).optional(),
  cta: ctaSchema.optional(),
  status: activeStatusSchema.default("active"),
  order: z.number().int().min(0).default(0),
});

export const activitySchema = z.object({
  name: z.string().trim().min(2).max(200),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  summary: z.string().trim().min(10).max(500),
  description: z.string().min(20).max(50_000),
  images: z.array(mediaRefSchema).max(20).optional(),
  intendedAudience: z.array(z.string().trim().max(120)).max(30).optional(),
  location: z.string().trim().max(200).optional(),
  date: z.coerce.date().optional().nullable(),
  registrationStatus: z
    .enum([
      "open",
      "closed",
      "waitlist",
      "invitation-only",
      "not-applicable",
    ])
    .default("not-applicable"),
  cta: ctaSchema.optional(),
  status: activeStatusSchema.default("active"),
  order: z.number().int().min(0).default(0),
  seo: seoSchema.optional(),
});

export const serviceSchema = z.object({
  name: z.string().trim().min(2).max(200),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  icon: z.string().max(80).optional(),
  summary: z.string().trim().min(10).max(500),
  description: z.string().min(20).max(100_000),
  heroHeading: z.string().trim().max(200).optional(),
  heroSubheading: z.string().trim().max(400).optional(),
  heroImage: mediaRefSchema.optional(),
  purpose: z.string().max(5000).optional(),
  intendedParticipants: z.array(z.string().trim().max(160)).max(30).optional(),
  potentialActivities: z.array(z.string().trim().max(300)).max(40).optional(),
  valueAreas: z.array(z.string().trim().max(300)).max(40).optional(),
  objectives: z.array(z.string().trim().max(300)).max(40).optional(),
  activities: z.array(z.string().trim().max(300)).max(40).optional(),
  gallery: z.array(mediaRefSchema).max(30).optional(),
  faqs: z
    .array(
      z.object({
        question: z.string().min(5).max(400),
        answer: z.string().min(5).max(5000),
      }),
    )
    .max(30)
    .optional(),
  relatedServiceSlugs: z.array(z.string().max(200)).max(10).optional(),
  cta: ctaSchema.optional(),
  seo: seoSchema.optional(),
  order: z.number().int().min(0).default(0),
  status: activeStatusSchema.default("active"),
});

export type BookingInput = z.infer<typeof bookingSchema>;
export type InquiryInput = z.infer<typeof inquirySchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type BlogInput = z.infer<typeof blogSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type EventInput = z.infer<typeof eventSchema>;
export type GalleryInput = z.infer<typeof gallerySchema>;
export type TeamInput = z.infer<typeof teamSchema>;
export type SettingsInput = z.infer<typeof settingsSchema>;
export type FaqInput = z.infer<typeof faqSchema>;
export type PricingInput = z.infer<typeof pricingSchema>;
export type ActivityInput = z.infer<typeof activitySchema>;
export type ServiceInput = z.infer<typeof serviceSchema>;
export type PageSectionInput = z.infer<typeof pageSectionSchema>;
export type PageInput = z.infer<typeof pageSchema>;
export type TestimonialInput = z.infer<typeof testimonialSchema>;
export type MediaAssetInput = z.infer<typeof mediaAssetSchema>;

export {
  mediaRefSchema,
  ctaSchema,
  seoSchema,
  socialLinksSchema,
  publishStatusSchema,
  activeStatusSchema,
};
