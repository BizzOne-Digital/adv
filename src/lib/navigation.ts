export type NavLink = {
  label: string;
  href: string;
};

export type ServiceNavItem = NavLink & {
  description: string;
};

export const SERVICE_LINKS: ServiceNavItem[] = [
  {
    label: "Farmer Connections",
    href: "/services/farmer-connections",
    description: "Link Canadian and African farming communities.",
  },
  {
    label: "Trade & Investment",
    href: "/services/trade-and-investment",
    description: "Explore trade pathways and investment dialogue.",
  },
  {
    label: "Agricultural Technology",
    href: "/services/agricultural-technology",
    description: "Showcase tools that improve productivity.",
  },
  {
    label: "Business Networking",
    href: "/services/business-networking",
    description: "Build lasting agribusiness relationships.",
  },
  {
    label: "Value Addition",
    href: "/services/value-addition",
    description: "Support processing and value-chain growth.",
  },
  {
    label: "Youth & Women in Agribusiness",
    href: "/services/youth-and-women-in-agribusiness",
    description: "Expand inclusive opportunity in agriculture.",
  },
  {
    label: "Export & Import Opportunities",
    href: "/services/export-import-opportunities",
    description: "Open corridors for agricultural exchange.",
  },
  {
    label: "Sustainable Agriculture",
    href: "/services/sustainable-agriculture",
    description: "Share practices for resilient food systems.",
  },
];

export const PRIMARY_NAV: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Activities", href: "/activities" },
  { label: "Events", href: "/events" },
  { label: "Gallery", href: "/gallery" },
  { label: "Team", href: "/team" },
  { label: "Products", href: "/products" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export const FOOTER_NAV: NavLink[] = [
  ...PRIMARY_NAV,
  { label: "Book a Meeting", href: "/booking" },
  { label: "Pricing", href: "/pricing" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "FAQ", href: "/faq" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms-and-conditions" },
];
