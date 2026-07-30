export type PublishStatus = "draft" | "published";
export type ActiveStatus = "active" | "inactive";
export type ContentStatus = PublishStatus | ActiveStatus;

export type BookingType =
  | "general-meeting"
  | "farmer-participation"
  | "agribusiness"
  | "investor-meeting"
  | "partnership"
  | "event-participation"
  | "exhibition"
  | "training"
  | "trade"
  | "media";

export type BookingStatus =
  | "new"
  | "reviewed"
  | "scheduled"
  | "completed"
  | "cancelled";

export type InquiryType =
  | "general"
  | "farmer"
  | "agribusiness"
  | "investment"
  | "partnership"
  | "media";

export type InquiryStatus = "new" | "in-progress" | "resolved" | "archived";

export type MediaResourceType = "image" | "video" | "raw";

export type GalleryMediaType = "image" | "video";

export type PriceVisibility = "contact" | "amount" | "hidden";

export type RegistrationStatus =
  | "open"
  | "closed"
  | "waitlist"
  | "invitation-only"
  | "not-applicable";

export type AdminRole = "admin" | "editor";

export interface SeoFields {
  title?: string;
  description?: string;
  ogImage?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
}

export interface MediaRef {
  url: string;
  publicId?: string;
  alt?: string;
  width?: number;
  height?: number;
  caption?: string;
}

export interface CtaFields {
  label?: string;
  href?: string;
  variant?: "primary" | "secondary" | "outline" | "ghost";
}

export interface SocialLinks {
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
  website?: string;
}

export interface DataVerificationWarnings {
  postalCodePending: boolean;
  secondaryEmailPending: boolean;
}

export interface AnalyticsIds {
  googleAnalytics?: string;
  googleTagManager?: string;
  metaPixel?: string;
}

export interface DefaultSeo {
  title: string;
  description: string;
  ogImage?: string;
  keywords?: string[];
}

export interface PageSection {
  _id?: string;
  key: string;
  eyebrow?: string;
  heading?: string;
  subheading?: string;
  body?: string;
  bulletPoints?: string[];
  images?: MediaRef[];
  background?: string;
  layout?: string;
  ctas?: CtaFields[];
  visible: boolean;
  order: number;
  customFields?: Record<string, string | number | boolean | null>;
}

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: AdminRole;
  isActive: boolean;
  lastLoginAt?: string | Date;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface Page {
  _id: string;
  title: string;
  slug: string;
  summary?: string;
  sections: PageSection[];
  status: PublishStatus;
  seo?: SeoFields;
  publishedAt?: string | Date;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface ServiceFaq {
  question: string;
  answer: string;
}

export interface Service {
  _id: string;
  name: string;
  slug: string;
  icon?: string;
  summary: string;
  description: string;
  heroHeading?: string;
  heroSubheading?: string;
  heroImage?: MediaRef;
  purpose?: string;
  intendedParticipants?: string[];
  potentialActivities?: string[];
  valueAreas?: string[];
  objectives?: string[];
  activities?: string[];
  gallery?: MediaRef[];
  faqs?: ServiceFaq[];
  relatedServiceSlugs?: string[];
  cta?: CtaFields;
  seo?: SeoFields;
  order: number;
  status: ActiveStatus;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface Activity {
  _id: string;
  name: string;
  slug: string;
  summary: string;
  description: string;
  images?: MediaRef[];
  intendedAudience?: string[];
  location?: string;
  date?: string | Date;
  registrationStatus: RegistrationStatus;
  cta?: CtaFields;
  status: ActiveStatus;
  order: number;
  seo?: SeoFields;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface EventAgendaItem {
  time?: string;
  title: string;
  description?: string;
  speaker?: string;
}

export interface EventSpeaker {
  name: string;
  role?: string;
  organization?: string;
  bio?: string;
  image?: MediaRef;
}

export interface Event {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  category?: string;
  location?: string;
  venue?: string;
  startDate: string | Date;
  endDate?: string | Date;
  timezone?: string;
  images?: MediaRef[];
  agenda?: EventAgendaItem[];
  speakers?: EventSpeaker[];
  capacity?: number;
  registrationDeadline?: string | Date;
  registrationUrl?: string;
  contactEmail?: string;
  contactPhone?: string;
  status: PublishStatus;
  featured: boolean;
  seo?: SeoFields;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface GalleryItem {
  _id: string;
  title: string;
  slug: string;
  caption?: string;
  category: string;
  mediaType: GalleryMediaType;
  media: MediaRef;
  location?: string;
  date?: string | Date;
  activitySlug?: string;
  eventSlug?: string;
  status: PublishStatus;
  featured: boolean;
  order: number;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface TeamMember {
  _id: string;
  name: string;
  slug: string;
  role: string;
  bio?: string;
  image?: MediaRef;
  socialLinks?: SocialLinks;
  department?: string;
  isLeadership: boolean;
  status: PublishStatus;
  order: number;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface Booking {
  _id: string;
  fullName: string;
  organization?: string;
  role?: string;
  country: string;
  email: string;
  phone?: string;
  bookingType: BookingType;
  preferredDate?: string | Date;
  preferredTime?: string;
  timezone?: string;
  areasOfInterest?: string[];
  message: string;
  consent: boolean;
  status: BookingStatus;
  adminNotes?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  category: string;
  countryOfOrigin?: string;
  summary: string;
  description: string;
  images?: MediaRef[];
  availability?: string;
  minimumOrder?: string;
  certification?: string;
  supplierInfo?: string;
  featured: boolean;
  status: ActiveStatus;
  order: number;
  seo?: SeoFields;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface PricingItem {
  _id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  inclusions?: string[];
  priceVisibility: PriceVisibility;
  amount?: number;
  currency?: string;
  cta?: CtaFields;
  status: ActiveStatus;
  order: number;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface Testimonial {
  _id: string;
  name: string;
  role?: string;
  organization?: string;
  country?: string;
  quote: string;
  image?: MediaRef;
  featured: boolean;
  approved: boolean;
  isSample: boolean;
  order: number;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface BlogCategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  status: ActiveStatus;
  order: number;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: MediaRef;
  images?: MediaRef[];
  categoryIds?: string[];
  tags?: string[];
  authorName?: string;
  authorId?: string;
  readingTimeMinutes?: number;
  featured: boolean;
  status: PublishStatus;
  publishedAt?: string | Date;
  seo?: SeoFields;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface FAQ {
  _id: string;
  question: string;
  answer: string;
  category: string;
  status: ActiveStatus;
  order: number;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface Inquiry {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  organization?: string;
  country?: string;
  inquiryType: InquiryType;
  subject?: string;
  message: string;
  consent: boolean;
  status: InquiryStatus;
  adminNotes?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface SiteSettings {
  _id: string;
  organizationName: string;
  shortName: string;
  logo?: MediaRef;
  favicon?: MediaRef;
  primaryEmail: string;
  secondaryEmail?: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  mapEmbed?: string;
  mission: string;
  vision: string;
  socialLinks?: SocialLinks;
  footerContent?: string;
  introEnabled: boolean;
  introText: string;
  copyright: string;
  defaultSeo: DefaultSeo;
  analyticsIds?: AnalyticsIds;
  contactRecipient: string;
  bookingRecipient: string;
  dataVerificationWarnings: DataVerificationWarnings;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface MediaAsset {
  _id: string;
  publicId: string;
  url: string;
  secureUrl: string;
  resourceType: MediaResourceType;
  format?: string;
  width?: number;
  height?: number;
  bytes?: number;
  folder?: string;
  alt?: string;
  caption?: string;
  tags?: string[];
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface ActivityLog {
  _id: string;
  actorId?: string;
  actorEmail?: string;
  action: string;
  entityType: string;
  entityId?: string;
  summary: string;
  metadata?: Record<string, string | number | boolean | null>;
  ipAddress?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  details?: unknown;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
