/**
 * Static homepage fallbacks when MongoDB has no published CMS items
 * (e.g. empty Atlas on Vercel, or seed drafts only).
 */
export const FALLBACK_GALLERY = [
  {
    id: "fallback-gallery-1",
    src: "/images/gallery/preview-1.jpg",
    alt: "Agricultural conference and exchange",
    caption: "Conference moments",
    category: "Events",
  },
  {
    id: "fallback-gallery-2",
    src: "/images/gallery/preview-2.jpg",
    alt: "Farm visit in the field",
    caption: "Farm visits",
    category: "Field",
  },
  {
    id: "fallback-gallery-3",
    src: "/images/gallery/preview-3.jpg",
    alt: "Technology demonstration",
    caption: "Agri-tech demos",
    category: "Technology",
  },
  {
    id: "fallback-gallery-4",
    src: "/images/gallery/preview-4.jpg",
    alt: "Exhibition booths with produce",
    caption: "Exhibition floor",
    category: "Trade",
  },
  {
    id: "fallback-gallery-5",
    src: "/images/gallery/preview-5.jpg",
    alt: "Networking handshake",
    caption: "Partnership conversations",
    category: "Networking",
  },
  {
    id: "fallback-gallery-6",
    src: "/images/gallery/06.jpg",
    alt: "Training session",
    caption: "Learning together",
    category: "Training",
  },
] as const;

export const FALLBACK_PRODUCTS = [
  {
    id: "fallback-product-1",
    name: "Specialty grains opportunity",
    slug: "specialty-grains-opportunity",
    summary:
      "Explore specialty grain exchange conversations between Canadian and African partners. Request information — not a checkout listing.",
    category: "Grains",
    countryOfOrigin: "Canada–Africa corridor",
    imageSrc: "/images/products/01.jpg",
    featured: true,
    href: "/products",
  },
  {
    id: "fallback-product-2",
    name: "Value-added foods inquiry",
    slug: "processed-foods-inquiry",
    summary:
      "Dialogue pathway for processed and value-added foods seeking partnership or buyer introductions.",
    category: "Processed foods",
    countryOfOrigin: "Multiple",
    imageSrc: "/images/products/02.jpg",
    featured: true,
    href: "/products",
  },
  {
    id: "fallback-product-3",
    name: "Agri-inputs dialogue",
    slug: "agri-inputs-dialogue",
    summary:
      "Informational card for agricultural inputs discussion. Contact CAFBEX for verified opportunities.",
    category: "Inputs",
    countryOfOrigin: "Multiple",
    imageSrc: "/images/products/03.jpg",
    featured: true,
    href: "/contact",
  },
] as const;

export const FALLBACK_TESTIMONIALS = [
  {
    id: "fallback-t-1",
    quote:
      "CAFBEX creates a respectful space where farmers and agribusinesses from Canada and Africa can learn from each other and explore real partnership pathways.",
    authorName: "Programme participant",
    authorRole: "Agribusiness lead",
    organization: "Sample reflection",
    isSample: true,
  },
  {
    id: "fallback-t-2",
    quote:
      "The exchange format helped us understand climate-smart practices in different contexts — not as a one-size solution, but as adaptable ideas for our own farms.",
    authorName: "Farmer cooperative representative",
    authorRole: "Producer",
    organization: "Sample reflection",
    isSample: true,
  },
  {
    id: "fallback-t-3",
    quote:
      "Clear conversations about trade readiness and networking made it easier to know what questions to ask before pursuing cross-border opportunities.",
    authorName: "Trade dialogue attendee",
    authorRole: "Exporter",
    organization: "Sample reflection",
    isSample: true,
  },
] as const;

export const FALLBACK_ARTICLES = [
  {
    id: "fallback-blog-1",
    title: "Why Canada–Africa agricultural exchange matters now",
    slug: "why-canada-africa-agricultural-exchange-matters",
    excerpt:
      "A framing essay on trade, knowledge, and partnership opportunities between Canadian and African farming communities.",
    publishedAt: new Date("2026-03-01"),
    coverImage: "/images/blog/01.jpg",
    category: "Insights",
    href: "/blog",
  },
  {
    id: "fallback-blog-2",
    title: "Designing respectful farmer-to-farmer learning",
    slug: "designing-respectful-farmer-to-farmer-learning",
    excerpt:
      "Principles for peer exchange that honor local knowledge while opening space for new practices.",
    publishedAt: new Date("2026-03-15"),
    coverImage: "/images/blog/02.jpg",
    category: "Exchange Notes",
    href: "/blog",
  },
  {
    id: "fallback-blog-3",
    title: "Climate-smart agriculture across different contexts",
    slug: "climate-smart-agriculture-across-contexts",
    excerpt:
      "How climate-smart ideas travel — and why adaptation to place, soil, and markets is essential.",
    publishedAt: new Date("2026-04-01"),
    coverImage: "/images/blog/03.jpg",
    category: "Insights",
    href: "/blog",
  },
] as const;
