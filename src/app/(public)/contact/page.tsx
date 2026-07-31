import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/forms/ContactForm";
import { Accordion } from "@/components/ui/Accordion";
import { Container } from "@/components/ui/Container";
import { CTASection } from "@/components/ui/CTASection";
import { GreenBand } from "@/components/ui/GreenBand";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { VerificationBanner } from "@/components/ui/VerificationBanner";
import { CONTACT, formatFullAddress } from "@/lib/contact";
import { getFAQs, getSettings } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import type { InquiryInput } from "@/lib/validations";

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description:
    "Contact CAFBEX in Toronto — email, phone, and inquiry forms for farmers, agribusiness, investment, partnership, and media.",
  path: "/contact",
});

type Props = {
  searchParams: Promise<{ type?: string; subject?: string }>;
};

const CONTACT_FAQS = [
  {
    question: "What is the best way to reach CAFBEX?",
    answer:
      "Email shambacanada@gamil.com or use the inquiry form on this page. For meetings, use the booking form.",
  },
  {
    question: "Is the postal code verified?",
    answer:
      "The postal code on file is pending independent verification and may be updated (possible M5A 1S1).",
  },
];

export default async function ContactPage({ searchParams }: Props) {
  const params = await searchParams;
  const settings = await getSettings();
  const faqs = await getFAQs("Contact");

  const inquiryType = (
    ["general", "farmer", "agribusiness", "investment", "partnership", "media"] as const
  ).includes(params.type as InquiryInput["inquiryType"])
    ? (params.type as InquiryInput["inquiryType"])
    : "general";

  const postalPending = settings.dataVerificationWarnings?.postalCodePending ?? true;
  const emailPending = settings.dataVerificationWarnings?.secondaryEmailPending ?? true;
  const mapQuery = encodeURIComponent(
    formatFullAddress({
      address: settings.address,
      city: settings.city,
      province: settings.province,
      postalCode: settings.postalCode,
      country: settings.country,
    }),
  );

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Get in touch"
        subtitle="Reach the CAFBEX team for inquiries, partnerships, and participation."
        imageSrc="/images/contact/hero.jpg"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
      />

      <GreenBand variant="soft">
        <VerificationBanner
          className="mb-10"
          postalUnverified={postalPending}
          emailUnverified={emailPending}
          secondaryEmail={settings.secondaryEmail || CONTACT.secondaryEmail}
        />

        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <SectionHeading
              eyebrow="Details"
              title="Business contact"
              description="Primary contact details for Canada–Africa Farmers Business Exchange."
            />

            <ul className="mt-8 space-y-4 text-sm text-muted">
              <li>
                <a
                  href={`mailto:${settings.primaryEmail}`}
                  className="inline-flex items-start gap-3 transition hover:text-forest"
                >
                  <Mail className="mt-0.5 h-4 w-4 text-agri" />
                  <span>
                    <span className="block font-medium text-forest">Email</span>
                    {settings.primaryEmail}
                  </span>
                </a>
              </li>
              {settings.secondaryEmail || CONTACT.secondaryEmail ? (
                <li className="inline-flex items-start gap-3">
                  <Mail className="mt-0.5 h-4 w-4 text-wheat" />
                  <span>
                    <span className="block font-medium text-forest">Secondary email</span>
                    {settings.secondaryEmail || CONTACT.secondaryEmail}
                    {emailPending ? (
                      <span className="mt-1 block text-xs text-soil">Pending verification</span>
                    ) : null}
                  </span>
                </li>
              ) : null}
              <li>
                <a
                  href={`tel:${CONTACT.phoneTel}`}
                  className="inline-flex items-start gap-3 transition hover:text-forest"
                >
                  <Phone className="mt-0.5 h-4 w-4 text-agri" />
                  <span>
                    <span className="block font-medium text-forest">Phone</span>
                    {settings.phone}
                  </span>
                </a>
              </li>
              <li className="inline-flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-agri" />
                <span>
                  <span className="block font-medium text-forest">Address</span>
                  {formatFullAddress(settings)}
                  {postalPending ? (
                    <span className="mt-1 block text-xs text-soil">
                      Postal code pending verification (may be M5A 1S1)
                    </span>
                  ) : null}
                </span>
              </li>
            </ul>

            <div className="mt-8 overflow-hidden border border-border bg-white">
              {settings.mapEmbed ? (
                <div
                  className="aspect-[16/10] w-full [&_iframe]:h-full [&_iframe]:w-full"
                  dangerouslySetInnerHTML={{ __html: settings.mapEmbed }}
                />
              ) : (
                <iframe
                  title="CAFBEX location map"
                  src={`https://maps.google.com/maps?q=${mapQuery}&output=embed`}
                  className="aspect-[16/10] w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              )}
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="border border-border bg-white p-6 sm:p-8">
              <h2 className="text-xl font-semibold text-forest">Send an inquiry</h2>
              <p className="mt-2 text-sm text-muted">
                General, farmer, agribusiness, investment, partnership, or media inquiries.
              </p>
              <div className="mt-6">
                <ContactForm defaultInquiryType={inquiryType} />
              </div>
            </div>
          </Reveal>
        </div>
      </GreenBand>

      <section className="bg-white py-16 sm:py-20">
        <Container>
          <div className="mx-auto max-w-3xl">
            <SectionHeading title="Contact FAQ" />
            <Reveal className="mt-6">
              <Accordion
                items={
                  faqs.length > 0
                    ? faqs.map((f) => ({ question: f.question, answer: f.answer }))
                    : CONTACT_FAQS
                }
              />
            </Reveal>
          </div>
        </Container>
      </section>

      <CTASection
        title="Prefer a scheduled conversation?"
        description="Use the booking form for meetings and participation requests."
        primaryHref="/booking"
        primaryLabel="Book a meeting"
        secondaryHref="/faq"
        secondaryLabel="Read FAQ"
      />
    </>
  );
}
