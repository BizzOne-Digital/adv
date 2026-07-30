import { config as loadEnv } from "dotenv";
import { hash } from "bcryptjs";
import mongoose from "mongoose";

loadEnv({ path: ".env.local" });
loadEnv();

import { AdminUser } from "../src/models/AdminUser";
import { Page } from "../src/models/Page";
import { Service } from "../src/models/Service";
import { Activity } from "../src/models/Activity";
import { FAQ } from "../src/models/FAQ";
import { BlogPost } from "../src/models/BlogPost";
import { BlogCategory } from "../src/models/BlogCategory";
import { Product } from "../src/models/Product";
import { TeamMember } from "../src/models/TeamMember";
import { PricingItem } from "../src/models/PricingItem";
import { SiteSettings } from "../src/models/SiteSettings";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/cafbex";

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "admin@cafbex.org").toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "ChangeMeNow123!";
const ADMIN_NAME = process.env.ADMIN_NAME || "CAFBEX Admin";

const MISSION =
  "To build lasting partnerships between Canada and Africa through agricultural knowledge exchange, trade, investment, and technology that improve food security and create economic opportunities for farming communities.";

const VISION =
  "To become the leading platform connecting Canadian and African farmers for sustainable agriculture, innovation, and economic prosperity.";

function section(
  key: string,
  heading: string,
  body: string,
  order: number,
  extras: Record<string, unknown> = {},
) {
  return {
    key,
    heading,
    body,
    visible: true,
    order,
    bulletPoints: [],
    ctas: [],
    images: [],
    ...extras,
  };
}

async function seedAdmin() {
  const passwordHash = await hash(ADMIN_PASSWORD, 12);
  await AdminUser.findOneAndUpdate(
    { email: ADMIN_EMAIL },
    {
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      passwordHash,
      role: "admin",
      isActive: true,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );
  console.log(`✓ Admin user: ${ADMIN_EMAIL}`);
}

async function seedSettings() {
  await SiteSettings.deleteMany({});
  await SiteSettings.create({
    organizationName: "Canada–Africa Farmers Business Exchange",
    shortName: "CAFBEX",
    primaryEmail: "mwanjaraa@gmail.com",
    secondaryEmail: "shambacanada@gamil.com",
    phone: "+1 437-873-7675",
    address: "163 Queen Street East",
    city: "Toronto",
    province: "Ontario",
    postalCode: "M5A 151",
    country: "Canada",
    mission: MISSION,
    vision: VISION,
    introEnabled: true,
    introText: "Connecting Agriculture. Growing Opportunity.",
    copyright: "© CAFBEX. All rights reserved.",
    contactRecipient: "mwanjaraa@gmail.com",
    bookingRecipient: "mwanjaraa@gmail.com",
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
    dataVerificationWarnings: {
      postalCodePending: true,
      secondaryEmailPending: true,
    },
  });
  console.log("✓ Site settings (verification warnings enabled)");
}

async function seedPages() {
  await Page.deleteMany({});

  const pages = [
    {
      title: "Home",
      slug: "home",
      summary: "CAFBEX connects Canadian and African agricultural communities.",
      status: "published" as const,
      publishedAt: new Date(),
      sections: [
        section(
          "hero",
          "Connecting Agriculture. Growing Opportunity.",
          "CAFBEX builds bridges between Canadian and African farmers, agribusinesses, investors, and policymakers.",
          0,
          { eyebrow: "Canada–Africa", layout: "hero" },
        ),
        section(
          "mission-vision",
          "Mission & Vision",
          `${MISSION}\n\n${VISION}`,
          1,
          { layout: "split" },
        ),
        section(
          "objectives",
          "What CAFBEX aims to advance",
          "Eight interconnected priorities guide programs, partnerships, and exchange opportunities.",
          2,
          {
            bulletPoints: [
              "Connect Canadian and African farmers",
              "Promote agricultural trade and investment",
              "Showcase modern farming technologies",
              "Facilitate business networking and partnerships",
              "Encourage value addition and food processing",
              "Support youth and women in agribusiness",
              "Create export and import opportunities",
              "Share best practices in sustainable and climate-smart agriculture",
            ],
          },
        ),
        section(
          "services-preview",
          "Eight pathways for agricultural exchange",
          "Each service area outlines purpose, participants, and how to express interest.",
          3,
        ),
        section(
          "cta",
          "Ready to connect?",
          "Whether you are a farmer, agribusiness, investor, researcher, or policymaker — CAFBEX welcomes dialogue.",
          4,
          {
            ctas: [
              { label: "Book a meeting", href: "/booking", variant: "primary" },
              { label: "Contact CAFBEX", href: "/contact", variant: "secondary" },
            ],
          },
        ),
      ],
      seo: {
        title: "CAFBEX — Canada–Africa Farmers Business Exchange",
        description:
          "Connecting farmers, agribusinesses, investors, and policymakers across Canada and Africa.",
      },
    },
    {
      title: "About",
      slug: "about",
      summary: "Who we are and why Canada–Africa agricultural exchange matters.",
      status: "published" as const,
      publishedAt: new Date(),
      sections: [
        section(
          "hero",
          "About CAFBEX",
          "Canada–Africa Farmers Business Exchange is a platform for knowledge, trade, investment, and partnership.",
          0,
          { eyebrow: "About", layout: "hero" },
        ),
        section("mission", "Our mission", MISSION, 1),
        section("vision", "Our vision", VISION, 2),
        section(
          "who-we-connect",
          "Who we connect",
          "Farmers, cooperatives, agribusinesses, investors, researchers, youth and women entrepreneurs, and policymakers.",
          3,
          {
            bulletPoints: [
              "Canadian and African farmers",
              "Agribusinesses and processors",
              "Investors and development partners",
              "Researchers and institutions",
              "Youth and women in agribusiness",
              "Policymakers and trade facilitators",
            ],
          },
        ),
      ],
    },
    {
      title: "Services",
      slug: "services",
      summary: "Eight service pathways for agricultural exchange.",
      status: "published" as const,
      publishedAt: new Date(),
      sections: [
        section(
          "hero",
          "Services",
          "Explore dedicated pathways spanning farmer connections, trade, technology, and climate-smart agriculture.",
          0,
          { layout: "hero" },
        ),
      ],
    },
    {
      title: "Activities",
      slug: "activities",
      summary: "Formats designed for exchange and learning.",
      status: "published" as const,
      publishedAt: new Date(),
      sections: [
        section(
          "hero",
          "Activities",
          "CAFBEX activities may include conferences, field learning, trade platforms, and training.",
          0,
        ),
      ],
    },
    {
      title: "Events",
      slug: "events",
      summary: "Confirmed events will appear when published.",
      status: "published" as const,
      publishedAt: new Date(),
      sections: [
        section(
          "hero",
          "Events",
          "When CAFBEX publishes confirmed events, they will appear here. Inquire about participation or propose a gathering.",
          0,
        ),
      ],
    },
    {
      title: "Gallery",
      slug: "gallery",
      summary: "Visual stories from CAFBEX activities.",
      status: "published" as const,
      publishedAt: new Date(),
      sections: [
        section(
          "hero",
          "Gallery",
          "Images will appear here as CAFBEX publishes gallery content from the admin portal.",
          0,
        ),
      ],
    },
    {
      title: "Team",
      slug: "team",
      summary: "People behind CAFBEX.",
      status: "published" as const,
      publishedAt: new Date(),
      sections: [
        section(
          "hero",
          "Team",
          "Published team profiles will appear here. Placeholders remain draft until verified.",
          0,
        ),
      ],
    },
    {
      title: "Products",
      slug: "products",
      summary: "Featured agricultural products and opportunities.",
      status: "published" as const,
      publishedAt: new Date(),
      sections: [
        section(
          "hero",
          "Products",
          "Featured products published by CAFBEX. Request information — this is not a checkout storefront.",
          0,
        ),
      ],
    },
    {
      title: "Blog",
      slug: "blog",
      summary: "News and insights from the exchange.",
      status: "published" as const,
      publishedAt: new Date(),
      sections: [
        section(
          "hero",
          "Blog",
          "Published articles will appear here. Draft topics are prepared in the admin portal.",
          0,
        ),
      ],
    },
    {
      title: "Contact",
      slug: "contact",
      summary: "Get in touch with CAFBEX.",
      status: "published" as const,
      publishedAt: new Date(),
      sections: [
        section(
          "hero",
          "Contact",
          "Reach CAFBEX for partnerships, participation, media, and general inquiries.",
          0,
        ),
        section(
          "details",
          "Office",
          "163 Queen Street East, Toronto, Ontario, Canada. Phone +1 437-873-7675.",
          1,
        ),
      ],
    },
    {
      title: "Booking",
      slug: "booking",
      summary: "Request a meeting with CAFBEX.",
      status: "published" as const,
      publishedAt: new Date(),
      sections: [
        section(
          "hero",
          "Book a meeting",
          "Tell us about your interest in farmer participation, trade, investment, partnership, or events.",
          0,
        ),
      ],
    },
    {
      title: "Pricing",
      slug: "pricing",
      summary: "Inquiry categories — contact for details.",
      status: "published" as const,
      publishedAt: new Date(),
      sections: [
        section(
          "hero",
          "Pricing & participation",
          "CAFBEX uses a contact-for-details model. Explore categories and inquire for tailored information.",
          0,
        ),
      ],
    },
  ];

  await Page.insertMany(pages);
  console.log(`✓ Pages: ${pages.length}`);
}

async function seedServices() {
  await Service.deleteMany({});

  const services = [
    {
      name: "Farmer Connections",
      slug: "farmer-connections",
      icon: "handshake",
      summary: "Link Canadian and African farming communities for mutual learning and opportunity.",
      description:
        "CAFBEX facilitates introductions and dialogue between Canadian and African farmers, cooperatives, and producer groups. Engagements may include knowledge exchange, peer learning, and exploration of collaboration pathways. Participation is interest-based and arranged through CAFBEX coordination.",
      purpose:
        "Strengthen relationships between farming communities across Canada and Africa.",
      intendedParticipants: [
        "Individual farmers",
        "Cooperatives and producer associations",
        "Extension and advisory partners",
      ],
      potentialActivities: [
        "Structured introductions",
        "Peer learning conversations",
        "Farm visit dialogue (when arranged)",
      ],
      valueAreas: ["Knowledge exchange", "Community relationships", "Opportunity scouting"],
      objectives: [
        "Connect farmers across geographies",
        "Share practical farming insights",
        "Open doors to further collaboration",
      ],
      activities: ["Introductions", "Dialogue sessions", "Follow-up coordination"],
      order: 1,
      status: "active" as const,
      cta: { label: "Express interest", href: "/booking", variant: "primary" as const },
    },
    {
      name: "Agricultural Trade & Investment",
      slug: "trade-and-investment",
      icon: "trending-up",
      summary: "Explore trade pathways and investment dialogue between Canada and Africa.",
      description:
        "This service supports exploratory conversations around agricultural trade corridors, investment interest, and partnership models. CAFBEX does not act as a broker of securities; it facilitates introductions and structured dialogue so stakeholders can assess opportunities carefully.",
      purpose: "Advance informed trade and investment conversations.",
      intendedParticipants: ["Agribusinesses", "Investors", "Trade facilitators", "Exporters/importers"],
      potentialActivities: ["Trade roundtables", "Investment forums", "B2B matchmaking dialogues"],
      valueAreas: ["Market insight", "Relationship building", "Opportunity framing"],
      objectives: ["Surface credible opportunities", "Connect interested parties", "Encourage responsible engagement"],
      activities: ["Forums", "Introductions", "Briefing conversations"],
      order: 2,
      status: "active" as const,
      cta: { label: "Request a meeting", href: "/booking", variant: "primary" as const },
    },
    {
      name: "Modern Agricultural Technology",
      slug: "agricultural-technology",
      icon: "sprout",
      summary: "Showcase tools and practices that can improve productivity and resilience.",
      description:
        "CAFBEX highlights modern agricultural technologies and approaches that may be relevant to Canadian and African contexts. Demonstrations and discussions are educational and exploratory — not product endorsements unless explicitly stated.",
      purpose: "Share technology awareness that supports productive, sustainable farming.",
      intendedParticipants: ["Farmers", "Agri-tech providers", "Researchers", "Extension agents"],
      potentialActivities: ["Technology showcases", "Demo days", "Expert panels"],
      valueAreas: ["Productivity", "Efficiency", "Learning"],
      objectives: ["Increase awareness of useful tools", "Encourage informed adoption decisions"],
      activities: ["Showcases", "Workshops", "Q&A sessions"],
      order: 3,
      status: "active" as const,
      cta: { label: "Learn more", href: "/contact", variant: "primary" as const },
    },
    {
      name: "Business Networking & Partnerships",
      slug: "business-networking",
      icon: "network",
      summary: "Build lasting agribusiness relationships across the Canada–Africa corridor.",
      description:
        "Networking sessions and partnership dialogues help organizations find complementary strengths. CAFBEX focuses on relationship quality, clarity of intent, and follow-through rather than one-off introductions.",
      purpose: "Enable durable agribusiness partnerships.",
      intendedParticipants: ["SMEs", "Cooperatives", "Institutions", "Diaspora entrepreneurs"],
      potentialActivities: ["Networking mixers", "Partnership clinics", "Follow-up facilitation"],
      valueAreas: ["Trust", "Collaboration", "Pipeline development"],
      objectives: ["Create meaningful connections", "Support partnership exploration"],
      activities: ["Networking events", "1:1 introductions", "Coordination support"],
      order: 4,
      status: "active" as const,
      cta: { label: "Connect with us", href: "/booking", variant: "primary" as const },
    },
    {
      name: "Value Addition & Food Processing",
      slug: "value-addition",
      icon: "package",
      summary: "Support processing and value-chain growth for agricultural products.",
      description:
        "Value addition and food processing conversations explore how producers can capture more value while meeting quality and market expectations. CAFBEX facilitates learning and introductions — commercial decisions remain with participants.",
      purpose: "Encourage stronger value chains through knowledge and connections.",
      intendedParticipants: ["Processors", "Farmers", "Aggregators", "Buyers"],
      potentialActivities: ["Value-chain workshops", "Facility learning visits", "Buyer dialogues"],
      valueAreas: ["Quality", "Processing know-how", "Market readiness"],
      objectives: ["Share processing insights", "Connect value-chain actors"],
      activities: ["Workshops", "Site dialogues", "Expert sessions"],
      order: 5,
      status: "active" as const,
      cta: { label: "Inquire", href: "/contact", variant: "primary" as const },
    },
    {
      name: "Youth & Women in Agribusiness",
      slug: "youth-and-women-in-agribusiness",
      icon: "users",
      summary: "Expand inclusive opportunity in agriculture for youth and women.",
      description:
        "Inclusive agribusiness engagement supports youth and women entrepreneurs with visibility, mentoring dialogues, and access to networks. Programs are designed carefully and communicated transparently as they launch.",
      purpose: "Widen participation and leadership in agribusiness.",
      intendedParticipants: ["Youth entrepreneurs", "Women-led enterprises", "Mentors", "Support organizations"],
      potentialActivities: ["Mentorship dialogues", "Pitch conversations", "Skill workshops"],
      valueAreas: ["Inclusion", "Skills", "Networks"],
      objectives: ["Amplify inclusive opportunity", "Connect emerging leaders to partners"],
      activities: ["Workshops", "Mentoring sessions", "Showcases"],
      order: 6,
      status: "active" as const,
      cta: { label: "Get involved", href: "/booking", variant: "primary" as const },
    },
    {
      name: "Export & Import Opportunities",
      slug: "export-import-opportunities",
      icon: "ship",
      summary: "Open corridors for agricultural exchange between Canada and Africa.",
      description:
        "Export and import discussions focus on understanding requirements, market expectations, and relationship pathways. CAFBEX helps participants prepare questions and find relevant contacts; regulatory compliance remains each party’s responsibility.",
      purpose: "Support informed cross-border agricultural exchange.",
      intendedParticipants: ["Exporters", "Importers", "Logistics partners", "Trade advisors"],
      potentialActivities: ["Trade briefings", "Buyer–seller dialogues", "Compliance overview sessions"],
      valueAreas: ["Market access awareness", "Relationships", "Readiness"],
      objectives: ["Clarify pathways", "Connect serious participants"],
      activities: ["Briefings", "Matchmaking dialogues", "Follow-ups"],
      order: 7,
      status: "active" as const,
      cta: { label: "Explore opportunities", href: "/contact", variant: "primary" as const },
    },
    {
      name: "Sustainable & Climate-Smart Agriculture",
      slug: "sustainable-agriculture",
      icon: "leaf",
      summary: "Share practices for resilient food systems under changing climates.",
      description:
        "Climate-smart agriculture conversations highlight practices that can improve resilience, soil health, and resource efficiency. Content is educational and context-sensitive — local applicability varies.",
      purpose: "Promote resilient, sustainable agricultural practices.",
      intendedParticipants: ["Farmers", "Researchers", "NGOs", "Policymakers"],
      potentialActivities: ["Practice-sharing workshops", "Field learning", "Policy dialogues"],
      valueAreas: ["Resilience", "Sustainability", "Knowledge"],
      objectives: ["Share adaptable practices", "Encourage peer learning"],
      activities: ["Workshops", "Panels", "Resource sharing"],
      order: 8,
      status: "active" as const,
      cta: { label: "Join the conversation", href: "/booking", variant: "primary" as const },
    },
  ];

  await Service.insertMany(services);
  console.log(`✓ Services: ${services.length}`);
}

async function seedActivities() {
  await Activity.deleteMany({});

  const items = [
    {
      name: "International conferences",
      slug: "international-conferences",
      summary: "Multi-stakeholder conferences exploring Canada–Africa agricultural partnership.",
      description:
        "Conference formats may bring farmers, agribusinesses, investors, researchers, and policymakers together for structured dialogue. Specific events are announced when confirmed.",
      intendedAudience: ["Farmers", "Agribusiness", "Investors", "Researchers", "Policymakers"],
      registrationStatus: "not-applicable" as const,
      status: "active" as const,
      order: 1,
      cta: { label: "Inquire about participation", href: "/booking" },
    },
    {
      name: "Workshops",
      slug: "workshops",
      summary: "Focused learning sessions on trade, technology, processing, and climate-smart practices.",
      description:
        "Workshops are designed for practical exchange. Topics and schedules are published when ready; language remains careful about what is confirmed versus planned.",
      intendedAudience: ["Farmers", "Entrepreneurs", "Extension partners"],
      registrationStatus: "not-applicable" as const,
      status: "active" as const,
      order: 2,
      cta: { label: "Express interest", href: "/contact" },
    },
    {
      name: "Farm visits",
      slug: "farm-visits",
      summary: "Field learning opportunities when logistics and hosts are arranged.",
      description:
        "Farm visits may be organized as part of exchange programs. They depend on host availability, travel arrangements, and clear objectives. Inquire to learn about upcoming possibilities.",
      intendedAudience: ["Farmers", "Students", "Agribusiness visitors"],
      registrationStatus: "invitation-only" as const,
      status: "active" as const,
      order: 3,
    },
    {
      name: "Technology demonstrations",
      slug: "technology-demonstrations",
      summary: "Demonstrations of tools and approaches relevant to productive agriculture.",
      description:
        "Technology demonstrations are educational showcases. They help participants ask better questions about fit, cost, and context — not automatic recommendations.",
      intendedAudience: ["Farmers", "Agri-tech providers", "Advisors"],
      registrationStatus: "not-applicable" as const,
      status: "active" as const,
      order: 4,
    },
    {
      name: "Agricultural exhibitions",
      slug: "agricultural-exhibitions",
      summary: "Exhibition participation that highlights products, practices, and partnerships.",
      description:
        "Exhibition formats can raise visibility for agricultural offerings and partnerships. CAFBEX may coordinate shared presence when opportunities are confirmed.",
      intendedAudience: ["Producers", "Processors", "Buyers"],
      registrationStatus: "not-applicable" as const,
      status: "active" as const,
      order: 5,
    },
    {
      name: "Trade fairs",
      slug: "trade-fairs",
      summary: "Trade fair engagement for market discovery and relationship building.",
      description:
        "Trade fair participation supports discovery of buyers, suppliers, and partners. Details are shared when CAFBEX confirms involvement.",
      intendedAudience: ["Exporters", "Importers", "Agribusiness"],
      registrationStatus: "not-applicable" as const,
      status: "active" as const,
      order: 6,
    },
    {
      name: "B2B networking",
      slug: "b2b-networking",
      summary: "Business-to-business networking for agribusiness collaboration.",
      description:
        "B2B networking sessions emphasize quality introductions and clear follow-up. Participants should come prepared with intent and capacity.",
      intendedAudience: ["SMEs", "Cooperatives", "Investors"],
      registrationStatus: "not-applicable" as const,
      status: "active" as const,
      order: 7,
    },
    {
      name: "Investment forums",
      slug: "investment-forums",
      summary: "Forums for responsible investment dialogue in agriculture.",
      description:
        "Investment forums create space for careful conversation about capital, risk, and impact. CAFBEX facilitates dialogue; it does not provide investment advice.",
      intendedAudience: ["Investors", "Project sponsors", "Advisors"],
      registrationStatus: "not-applicable" as const,
      status: "active" as const,
      order: 8,
    },
    {
      name: "Innovation, marketing, and export training",
      slug: "innovation-marketing-export-training",
      summary: "Training that strengthens innovation, marketing, and export readiness.",
      description:
        "Training modules may cover innovation approaches, market storytelling, and export readiness considerations. Offerings are announced as curricula are finalized.",
      intendedAudience: ["Entrepreneurs", "Cooperatives", "Export-ready producers"],
      registrationStatus: "not-applicable" as const,
      status: "active" as const,
      order: 9,
    },
  ];

  await Activity.insertMany(items);
  console.log(`✓ Activities: ${items.length}`);
}

async function seedFaqs() {
  await FAQ.deleteMany({});
  const faqs = [
    {
      question: "What is CAFBEX?",
      answer:
        "CAFBEX — Canada–Africa Farmers Business Exchange — connects farmers, agribusinesses, investors, researchers, and policymakers to advance agricultural partnership between Canada and Africa.",
      category: "General",
      order: 1,
    },
    {
      question: "How can I participate?",
      answer:
        "You can submit a booking request or contact form describing your interest. CAFBEX will follow up based on capacity and fit.",
      category: "Participation",
      order: 1,
    },
    {
      question: "Do you publish confirmed event dates here?",
      answer:
        "Yes. Confirmed events appear on the Events page once published from the admin portal. Until then, you can inquire about upcoming opportunities.",
      category: "Events",
      order: 1,
    },
    {
      question: "Is CAFBEX an e-commerce store?",
      answer:
        "No. Product listings, when published, are informational. Interested parties should contact CAFBEX for details.",
      category: "Products",
      order: 1,
    },
    {
      question: "How are prices handled?",
      answer:
        "Most participation categories use a contact-for-details model so offerings can be tailored to context.",
      category: "Pricing",
      order: 1,
    },
    {
      question: "Where is CAFBEX based?",
      answer:
        "CAFBEX lists an office address in Toronto, Ontario, Canada. Some contact details remain under verification and are flagged on the site.",
      category: "Contact",
      order: 1,
    },
  ].map((f) => ({ ...f, status: "active" as const }));

  await FAQ.insertMany(faqs);
  console.log(`✓ FAQs: ${faqs.length}`);
}

async function seedBlogs() {
  await BlogCategory.deleteMany({});
  await BlogPost.deleteMany({});

  const categories = await BlogCategory.insertMany([
    {
      name: "Insights",
      slug: "insights",
      description: "Thought leadership and analysis",
      status: "active",
      order: 1,
    },
    {
      name: "Exchange Notes",
      slug: "exchange-notes",
      description: "Updates from CAFBEX programs",
      status: "active",
      order: 2,
    },
  ]);

  const topics = [
    {
      title: "Why Canada–Africa agricultural exchange matters now",
      slug: "why-canada-africa-agricultural-exchange-matters",
      excerpt:
        "A framing essay on trade, knowledge, and partnership opportunities between Canadian and African farming communities.",
    },
    {
      title: "Designing respectful farmer-to-farmer learning",
      slug: "designing-respectful-farmer-to-farmer-learning",
      excerpt:
        "Principles for peer exchange that honor local knowledge while opening space for new practices.",
    },
    {
      title: "Climate-smart agriculture across different contexts",
      slug: "climate-smart-agriculture-across-contexts",
      excerpt:
        "How climate-smart ideas travel — and why adaptation to place, soil, and markets is essential.",
    },
    {
      title: "Opening doors for youth and women in agribusiness",
      slug: "youth-and-women-in-agribusiness",
      excerpt:
        "Inclusive networks and practical pathways that help emerging leaders gain visibility and partners.",
    },
    {
      title: "From conversation to corridor: trade readiness basics",
      slug: "trade-readiness-basics",
      excerpt:
        "A practical overview of questions exporters and importers should ask before pursuing cross-border deals.",
    },
  ];

  await BlogPost.insertMany(
    topics.map((t, i) => ({
      ...t,
      content: `<p>${t.excerpt}</p><p>CAFBEX will continue expanding this article with programme updates and verified insights.</p>`,
      categoryIds: [categories[i % categories.length]._id],
      tags: ["cafbex", "agriculture"],
      authorName: "CAFBEX",
      featured: i < 3,
      status: i < 3 ? "published" : "draft",
      publishedAt: i < 3 ? new Date(Date.UTC(2026, 2 + i, 1 + i * 5)) : undefined,
      coverImage: {
        url: `/images/blog/0${(i % 5) + 1}.jpg`,
        alt: t.title,
      },
      readingTimeMinutes: 3,
    })),
  );

  console.log(`✓ Blog posts: 3 published, ${topics.length - 3} draft`);
}

async function seedProducts() {
  await Product.deleteMany({});
  await Product.insertMany([
    {
      name: "Specialty grains opportunity",
      slug: "specialty-grains-opportunity",
      category: "Grains",
      countryOfOrigin: "Canada–Africa corridor",
      summary:
        "Informational listing for specialty grain exchange conversations between Canadian and African partners.",
      description:
        "This catalogue card supports Request Information inquiries only. CAFBEX does not operate a checkout storefront. Contact the team for verified details.",
      images: [{ url: "/images/products/01.jpg", alt: "Specialty grains" }],
      status: "active",
      featured: true,
      order: 1,
    },
    {
      name: "Value-added foods inquiry",
      slug: "processed-foods-inquiry",
      category: "Processed foods",
      countryOfOrigin: "Multiple",
      summary:
        "Pathway for processed and value-added food products seeking partnership or buyer dialogue.",
      description:
        "Informational only. Activate further detail via Admin when supplier and certification information is verified.",
      images: [{ url: "/images/products/02.jpg", alt: "Value-added foods" }],
      status: "active",
      featured: true,
      order: 2,
    },
    {
      name: "Agri-inputs dialogue",
      slug: "agri-inputs-dialogue",
      category: "Inputs",
      countryOfOrigin: "Multiple",
      summary:
        "Informational card for agricultural inputs discussion — contact CAFBEX for opportunities.",
      description:
        "CAFBEX facilitates dialogue. This is not a live e-commerce listing.",
      images: [{ url: "/images/products/03.jpg", alt: "Agricultural inputs" }],
      status: "active",
      featured: true,
      order: 3,
    },
  ]);
  console.log("✓ Products: 3 active featured");
}

async function seedTestimonials() {
  const { Testimonial } = await import("../src/models/Testimonial");
  await Testimonial.deleteMany({});
  await Testimonial.insertMany([
    {
      name: "Programme participant",
      role: "Agribusiness lead",
      organization: "Sample reflection",
      quote:
        "CAFBEX creates a respectful space where farmers and agribusinesses from Canada and Africa can learn from each other and explore real partnership pathways.",
      featured: true,
      approved: true,
      isSample: true,
      order: 1,
    },
    {
      name: "Farmer cooperative representative",
      role: "Producer",
      organization: "Sample reflection",
      quote:
        "The exchange format helped us understand climate-smart practices in different contexts — not as a one-size solution, but as adaptable ideas for our own farms.",
      featured: true,
      approved: true,
      isSample: true,
      order: 2,
    },
    {
      name: "Trade dialogue attendee",
      role: "Exporter",
      organization: "Sample reflection",
      quote:
        "Clear conversations about trade readiness and networking made it easier to know what questions to ask before pursuing cross-border opportunities.",
      featured: true,
      approved: true,
      isSample: true,
      order: 3,
    },
  ]);
  console.log("✓ Testimonials: 3 sample (labelled)");
}

async function seedGallery() {
  const { GalleryItem } = await import("../src/models/GalleryItem");
  await GalleryItem.deleteMany({});
  const items = [
    { title: "Conference exchange", slug: "conference-exchange", category: "Events", file: "01.jpg", caption: "Agricultural conference moments" },
    { title: "Farm visit", slug: "farm-visit", category: "Field", file: "02.jpg", caption: "Guided farm visits" },
    { title: "Technology demo", slug: "technology-demo", category: "Technology", file: "03.jpg", caption: "Agri-tech demonstrations" },
    { title: "Exhibition floor", slug: "exhibition-floor", category: "Trade", file: "04.jpg", caption: "Exhibition booths and produce" },
    { title: "Networking", slug: "networking-moment", category: "Networking", file: "05.jpg", caption: "Partnership conversations" },
    { title: "Training session", slug: "training-session", category: "Training", file: "06.jpg", caption: "Learning together" },
    { title: "Trade fair aisle", slug: "trade-fair", category: "Trade", file: "07.jpg", caption: "Trade fair atmosphere" },
    { title: "Community gathering", slug: "community-gathering", category: "Community", file: "08.jpg", caption: "Community celebration" },
  ];
  await GalleryItem.insertMany(
    items.map((item, i) => ({
      title: item.title,
      slug: item.slug,
      caption: item.caption,
      category: item.category,
      mediaType: "image",
      media: {
        url: `/images/gallery/${item.file}`,
        alt: item.title,
      },
      status: "published",
      featured: i < 6,
      order: i + 1,
    })),
  );
  console.log(`✓ Gallery: ${items.length} published`);
}

async function seedTeam() {
  await TeamMember.deleteMany({});
  await TeamMember.insertMany([
    {
      name: "Leadership placeholder",
      slug: "leadership-placeholder",
      role: "To be confirmed",
      bio: "Draft team profile. Publish only after name, role, and photo are verified.",
      isLeadership: true,
      status: "draft",
      order: 1,
    },
    {
      name: "Programs placeholder",
      slug: "programs-placeholder",
      role: "Programs coordination (draft)",
      bio: "Placeholder for programs coordination profile.",
      isLeadership: false,
      status: "draft",
      order: 2,
    },
    {
      name: "Partnerships placeholder",
      slug: "partnerships-placeholder",
      role: "Partnerships (draft)",
      bio: "Placeholder for partnerships profile.",
      isLeadership: false,
      status: "draft",
      order: 3,
    },
  ]);
  console.log("✓ Team placeholders: 3 (draft, not published)");
}

async function seedPricing() {
  await PricingItem.deleteMany({});
  await PricingItem.insertMany([
    {
      title: "Conference / forum participation",
      slug: "conference-forum-participation",
      category: "Events",
      description:
        "Inquiry category for conference or forum participation. Contact CAFBEX for current options and requirements.",
      inclusions: ["Program access (when confirmed)", "Networking opportunities", "Follow-up coordination"],
      priceVisibility: "contact",
      status: "active",
      order: 1,
      cta: { label: "Contact for details", href: "/contact" },
    },
    {
      title: "Workshop / training seat",
      slug: "workshop-training-seat",
      category: "Training",
      description:
        "Inquiry category for workshop or training participation. Details vary by topic and format.",
      inclusions: ["Session access", "Materials (when provided)", "Certificate of attendance (if offered)"],
      priceVisibility: "contact",
      status: "active",
      order: 2,
      cta: { label: "Contact for details", href: "/contact" },
    },
    {
      title: "Partnership exploration meeting",
      slug: "partnership-exploration-meeting",
      category: "Partnerships",
      description:
        "Structured conversation to explore partnership fit. Contact to schedule.",
      inclusions: ["Introductory meeting", "Needs alignment discussion", "Next-step recommendations"],
      priceVisibility: "contact",
      status: "active",
      order: 3,
      cta: { label: "Book a meeting", href: "/booking" },
    },
    {
      title: "Exhibition / trade presence inquiry",
      slug: "exhibition-trade-presence",
      category: "Trade",
      description:
        "Inquire about shared or coordinated presence at exhibitions and trade platforms.",
      inclusions: ["Opportunity briefing", "Coordination discussion"],
      priceVisibility: "contact",
      status: "active",
      order: 4,
      cta: { label: "Contact for details", href: "/contact" },
    },
  ]);
  console.log("✓ Pricing inquiry categories: 4 (contact-for-details)");
}

async function main() {
  console.log(`Connecting to ${MONGODB_URI} …`);
  await mongoose.connect(MONGODB_URI);
  console.log("Connected.\n");

  await seedAdmin();
  await seedSettings();
  await seedPages();
  await seedServices();
  await seedActivities();
  await seedFaqs();
  await seedBlogs();
  await seedProducts();
  await seedGallery();
  await seedTestimonials();
  await seedTeam();
  await seedPricing();

  console.log("\nSeed complete.");
  console.log("Sample testimonials are labelled as sample content.");
  console.log(`\nLogin: ${ADMIN_EMAIL}`);
  console.log("Password: (ADMIN_PASSWORD from env, or default ChangeMeNow123!)");

  await mongoose.disconnect();
}

main().catch(async (error) => {
  console.error("Seed failed:", error);
  try {
    await mongoose.disconnect();
  } catch {
    // ignore
  }
  process.exit(1);
});
