import { SERVICE_LINKS } from "@/lib/navigation";
import type { Service } from "@/types";

export type ServiceContent = {
  slug: string;
  name: string;
  summary: string;
  description: string;
  heroHeading: string;
  heroSubheading: string;
  purpose: string;
  intendedParticipants: string[];
  potentialActivities: string[];
  valueAreas: string[];
  faqs: { question: string; answer: string }[];
  relatedServiceSlugs: string[];
  imageFolder: string;
  /** CMS override for detail hero */
  heroImageUrl?: string;
  /** CMS gallery overrides (falls back to static slots) */
  galleryUrls?: string[];
};

const CONTENT: Record<string, Omit<ServiceContent, "slug" | "name" | "summary">> = {
  "farmer-connections": {
    description:
      "Farmer Connections aims to create meaningful links between Canadian and African farming communities. The programme is designed to encourage peer learning, practical exchange, and longer-term relationships that may strengthen food systems on both sides of the Atlantic.",
    heroHeading: "Farmer Connections",
    heroSubheading:
      "Building bridges between Canadian and African farming communities through dialogue, visits, and shared practice.",
    purpose:
      "This service aims to help farmers, cooperatives, and producer groups discover counterparts, share field experience, and explore collaboration pathways that respect local contexts and priorities.",
    intendedParticipants: [
      "Smallholder and commercial farmers",
      "Producer cooperatives and associations",
      "Extension and advisory practitioners",
      "Community agricultural leaders",
    ],
    potentialActivities: [
      "Facilitated introductions between farming communities",
      "Farm visits and peer-learning exchanges",
      "Virtual dialogue sessions on production practices",
      "Cooperative storytelling and knowledge sharing",
    ],
    valueAreas: [
      "Practical peer learning across regions",
      "Stronger producer networks",
      "Exposure to diverse farming systems",
      "Foundation for future trade or partnership discussions",
    ],
    faqs: [
      {
        question: "Is this a guaranteed placement or exchange programme?",
        answer:
          "No. Farmer Connections is designed as a facilitation and networking pathway. Specific visits or exchanges may be arranged when partners, logistics, and funding align.",
      },
      {
        question: "Who can express interest?",
        answer:
          "Farmers, cooperatives, associations, and organisations that support farming communities in Canada or Africa may inquire through booking or contact forms.",
      },
    ],
    relatedServiceSlugs: [
      "business-networking",
      "youth-and-women-in-agribusiness",
      "sustainable-agriculture",
    ],
    imageFolder: "services/farmer-connections",
  },
  "trade-and-investment": {
    description:
      "Agricultural Trade and Investment aims to open structured dialogue around market access, investment interest, and partnership models between Canadian and African agribusiness stakeholders.",
    heroHeading: "Trade & Investment",
    heroSubheading:
      "Exploring pathways for agricultural trade dialogue and responsible investment conversations.",
    purpose:
      "This service is designed to help participants understand opportunities, constraints, and relationship-building steps that may support trade and investment discussions — without presenting unverified deals or returns.",
    intendedParticipants: [
      "Agribusiness owners and managers",
      "Investors exploring agriculture",
      "Trade support organisations",
      "Policymakers and economic development partners",
    ],
    potentialActivities: [
      "Trade roundtables and briefing sessions",
      "Investment forum participation (when scheduled)",
      "Introductions to relevant counterpart organisations",
      "Market-access learning workshops",
    ],
    valueAreas: [
      "Clearer understanding of cross-border agribusiness pathways",
      "Access to curated networking environments",
      "Exposure to investment dialogue formats",
      "Support navigating early partnership conversations",
    ],
    faqs: [
      {
        question: "Does CAFBEX provide investment capital?",
        answer:
          "CAFBEX aims to facilitate dialogue and introductions. It does not act as an investment fund or guarantee capital deployment.",
      },
      {
        question: "Are trade deals listed on this site?",
        answer:
          "Published opportunities appear only when verified and approved. We do not invent listings or prices.",
      },
    ],
    relatedServiceSlugs: [
      "export-import-opportunities",
      "business-networking",
      "value-addition",
    ],
    imageFolder: "services/trade-and-investment",
  },
  "agricultural-technology": {
    description:
      "Agricultural Technology aims to showcase tools, practices, and demonstrations that may improve productivity, efficiency, and climate resilience for farming communities.",
    heroHeading: "Agricultural Technology",
    heroSubheading:
      "Highlighting modern tools and demonstrations that support productive, resilient agriculture.",
    purpose:
      "This service is designed to connect practitioners with technology demonstrations, learning sessions, and partner introductions that may accelerate adoption of appropriate agri-tech solutions.",
    intendedParticipants: [
      "Farmers exploring mechanisation or digital tools",
      "Agri-tech innovators and startups",
      "Researchers and extension services",
      "Training institutions",
    ],
    potentialActivities: [
      "Technology demonstration days",
      "Innovation showcases at events",
      "Workshops on precision and climate-smart tools",
      "Pilot introduction conversations",
    ],
    valueAreas: [
      "Visibility of relevant technologies",
      "Learning from demonstration contexts",
      "Connections between innovators and practitioners",
      "Support for informed adoption decisions",
    ],
    faqs: [
      {
        question: "Does CAFBEX sell technology products?",
        answer:
          "No. CAFBEX may host or facilitate demonstrations and introductions. Product inquiries should go through Request Information pathways.",
      },
      {
        question: "Are technologies endorsed by CAFBEX?",
        answer:
          "Inclusion in a showcase aims to inform — it is not an endorsement of performance, pricing, or fitness for every context.",
      },
    ],
    relatedServiceSlugs: [
      "sustainable-agriculture",
      "value-addition",
      "farmer-connections",
    ],
    imageFolder: "services/agricultural-technology",
  },
  "business-networking": {
    description:
      "Business Networking aims to create professional spaces where agribusiness leaders, partners, and institutions can meet, exchange ideas, and explore lasting collaborations.",
    heroHeading: "Business Networking",
    heroSubheading:
      "Creating rooms for relationship-building across the Canada–Africa agribusiness corridor.",
    purpose:
      "This service is designed to foster trusted introductions and structured networking that may lead to partnerships, knowledge sharing, and joint initiatives.",
    intendedParticipants: [
      "Agribusiness executives and founders",
      "Industry associations",
      "Development and trade partners",
      "Professional service providers in agriculture",
    ],
    potentialActivities: [
      "B2B networking sessions",
      "Partner matchmaking at events",
      "Sector-focused roundtables",
      "Follow-up facilitation after introductions",
    ],
    valueAreas: [
      "Expanded professional networks",
      "Higher-quality introductions",
      "Shared understanding of partnership goals",
      "Momentum toward collaborative projects",
    ],
    faqs: [
      {
        question: "How do I join a networking session?",
        answer:
          "Express interest via the booking form. When sessions are scheduled and published, registration details will be shared.",
      },
      {
        question: "Is participation invitation-only?",
        answer:
          "Some sessions may be open; others may be invitation-only depending on format and capacity.",
      },
    ],
    relatedServiceSlugs: [
      "trade-and-investment",
      "farmer-connections",
      "export-import-opportunities",
    ],
    imageFolder: "services/business-networking",
  },
  "value-addition": {
    description:
      "Value Addition aims to support learning and dialogue around processing, packaging, and market-ready product development across agricultural value chains.",
    heroHeading: "Value Addition",
    heroSubheading:
      "Strengthening processing and value-chain capabilities for competitive agricultural products.",
    purpose:
      "This service is designed to help producers and processors explore value-addition pathways that may improve margins, reduce post-harvest loss, and expand market access.",
    intendedParticipants: [
      "Processors and agrifood entrepreneurs",
      "Cooperatives exploring packaging or processing",
      "Quality and certification advisors",
      "Buyers interested in value-added goods",
    ],
    potentialActivities: [
      "Processing and packaging workshops",
      "Value-chain mapping sessions",
      "Quality and standards briefings",
      "Showcases of value-added products (when published)",
    ],
    valueAreas: [
      "Better understanding of processing options",
      "Reduced post-harvest loss awareness",
      "Pathways toward market-ready products",
      "Connections along the value chain",
    ],
    faqs: [
      {
        question: "Does CAFBEX operate processing facilities?",
        answer:
          "CAFBEX aims to facilitate learning and introductions. Facility ownership or operation is not assumed unless separately announced.",
      },
      {
        question: "Can I list a product here?",
        answer:
          "Product catalogue entries are managed through the admin portal and published only when approved.",
      },
    ],
    relatedServiceSlugs: [
      "export-import-opportunities",
      "agricultural-technology",
      "trade-and-investment",
    ],
    imageFolder: "services/value-addition",
  },
  "youth-and-women-in-agribusiness": {
    description:
      "Youth and Women in Agribusiness aims to expand inclusive participation by creating learning, mentoring, and networking pathways for young people and women across agricultural value chains.",
    heroHeading: "Youth & Women in Agribusiness",
    heroSubheading:
      "Opening inclusive pathways for leadership, skills, and enterprise in agriculture.",
    purpose:
      "This service is designed to amplify opportunity for youth and women through training, visibility, and connections that may support entrepreneurship and leadership in agribusiness.",
    intendedParticipants: [
      "Young farmers and agripreneurs",
      "Women-led agricultural enterprises",
      "Training and mentoring organisations",
      "Partners focused on inclusive economic growth",
    ],
    potentialActivities: [
      "Skills and leadership workshops",
      "Mentorship introductions",
      "Showcase sessions for emerging enterprises",
      "Inclusive networking forums",
    ],
    valueAreas: [
      "Greater visibility for underrepresented voices",
      "Skills development opportunities",
      "Peer and mentor networks",
      "Pathways into broader CAFBEX programmes",
    ],
    faqs: [
      {
        question: "Are programmes free?",
        answer:
          "Costs depend on format and partners. Contact CAFBEX for details on specific activities when they are announced.",
      },
      {
        question: "Do I need an existing business?",
        answer:
          "Not necessarily. Aspiring agripreneurs and early-stage founders may also express interest, depending on the activity.",
      },
    ],
    relatedServiceSlugs: [
      "farmer-connections",
      "business-networking",
      "agricultural-technology",
    ],
    imageFolder: "services/youth-and-women-in-agribusiness",
  },
  "export-import-opportunities": {
    description:
      "Export and Import Opportunities aims to help participants learn about agricultural trade corridors, documentation awareness, and partnership routes that may support cross-border exchange.",
    heroHeading: "Export & Import Opportunities",
    heroSubheading:
      "Illuminating corridors for responsible agricultural exchange between Canada and Africa.",
    purpose:
      "This service is designed to improve literacy around export-import pathways and connect participants with learning and networking that may support future trade activity.",
    intendedParticipants: [
      "Exporters and importers of agricultural goods",
      "Cooperatives preparing for market access",
      "Logistics and compliance advisors",
      "Trade associations",
    ],
    potentialActivities: [
      "Export-procedure training sessions",
      "Market-entry briefings",
      "Buyer–seller introductions (when appropriate)",
      "Trade fair participation support discussions",
    ],
    valueAreas: [
      "Clearer view of export-import steps",
      "Reduced uncertainty around documentation topics",
      "Access to trade-focused networks",
      "Alignment with catalogue and exhibition pathways",
    ],
    faqs: [
      {
        question: "Does CAFBEX handle customs clearance?",
        answer:
          "No. CAFBEX may provide learning and introductions. Licensed brokers and authorities handle formal clearance.",
      },
      {
        question: "Are specific export deals advertised?",
        answer:
          "Only verified, approved opportunities are published. We do not invent trade listings.",
      },
    ],
    relatedServiceSlugs: [
      "trade-and-investment",
      "value-addition",
      "business-networking",
    ],
    imageFolder: "services/export-import-opportunities",
  },
  "sustainable-agriculture": {
    description:
      "Sustainable and Climate-Smart Agriculture aims to share practices and partnerships that may strengthen resilience, stewardship, and long-term productivity in food systems.",
    heroHeading: "Sustainable Agriculture",
    heroSubheading:
      "Sharing climate-smart practices for resilient farms and food systems.",
    purpose:
      "This service is designed to promote awareness and collaboration around sustainable production, soil health, water stewardship, and climate adaptation approaches relevant to Canadian and African contexts.",
    intendedParticipants: [
      "Farmers adopting climate-smart methods",
      "Researchers and extension specialists",
      "Environmental and sustainability partners",
      "Policy and development stakeholders",
    ],
    potentialActivities: [
      "Climate-smart agriculture workshops",
      "Field demonstrations of regenerative practices",
      "Knowledge exchanges on water and soil management",
      "Partnership dialogues on sustainability programmes",
    ],
    valueAreas: [
      "Practical sustainability learning",
      "Cross-regional knowledge exchange",
      "Stronger resilience narratives",
      "Alignment with technology and farmer connection programmes",
    ],
    faqs: [
      {
        question: "Is this a certification programme?",
        answer:
          "Not by default. CAFBEX aims to facilitate learning and collaboration. Formal certification would involve recognised standards bodies.",
      },
      {
        question: "Can organisations co-host a workshop?",
        answer:
          "Yes — partnership discussions are welcome via the booking or contact forms.",
      },
    ],
    relatedServiceSlugs: [
      "agricultural-technology",
      "farmer-connections",
      "youth-and-women-in-agribusiness",
    ],
    imageFolder: "services/sustainable-agriculture",
  },
};

export function getStaticServiceContent(slug: string): ServiceContent | null {
  const nav = SERVICE_LINKS.find((s) => s.href === `/services/${slug}`);
  const body = CONTENT[slug];
  if (!nav || !body) return null;

  return {
    slug,
    name: nav.label,
    summary: nav.description,
    ...body,
  };
}

export function getAllStaticServices(): ServiceContent[] {
  return SERVICE_LINKS.map((s) => getStaticServiceContent(s.href.replace("/services/", ""))!).filter(
    Boolean,
  );
}

/** Merge DB service record with static fallback for missing fields. */
export function resolveServicePage(
  slug: string,
  dbService: Service | null,
): ServiceContent | null {
  const fallback = getStaticServiceContent(slug);
  if (!fallback && !dbService) return null;

  if (!dbService) return fallback;

  return {
    slug: dbService.slug,
    name: dbService.name,
    summary: dbService.summary || fallback?.summary || "",
    description: dbService.description || fallback?.description || "",
    heroHeading: dbService.heroHeading || fallback?.heroHeading || dbService.name,
    heroSubheading:
      dbService.heroSubheading || fallback?.heroSubheading || dbService.summary,
    purpose: dbService.purpose || fallback?.purpose || "",
    intendedParticipants:
      dbService.intendedParticipants?.length
        ? dbService.intendedParticipants
        : fallback?.intendedParticipants || [],
    potentialActivities:
      dbService.potentialActivities?.length
        ? dbService.potentialActivities
        : dbService.activities?.length
          ? dbService.activities
          : fallback?.potentialActivities || [],
    valueAreas:
      dbService.valueAreas?.length
        ? dbService.valueAreas
        : fallback?.valueAreas || [],
    faqs: dbService.faqs?.length ? dbService.faqs : fallback?.faqs || [],
    relatedServiceSlugs:
      dbService.relatedServiceSlugs?.length
        ? dbService.relatedServiceSlugs
        : fallback?.relatedServiceSlugs || [],
    imageFolder: fallback?.imageFolder || `services/${slug}`,
    heroImageUrl: dbService.heroImage?.url || undefined,
    galleryUrls: dbService.gallery?.map((g) => g.url).filter(Boolean) || undefined,
  };
}

export function serviceImageSlots(folder: string): [
  { src: string; alt: string },
  { src: string; alt: string },
  { src: string; alt: string },
  { src: string; alt: string },
  { src: string; alt: string },
] {
  return [
    { src: `/images/${folder}/01.jpg`, alt: "Service visual 1" },
    { src: `/images/${folder}/02.jpg`, alt: "Service visual 2" },
    { src: `/images/${folder}/03.jpg`, alt: "Service visual 3" },
    { src: `/images/${folder}/04.jpg`, alt: "Service visual 4" },
    { src: `/images/${folder}/05.jpg`, alt: "Service visual 5" },
  ];
}
