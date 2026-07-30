import type { Metadata } from "next";
import { GreenBand } from "@/components/ui/GreenBand";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BookingForm } from "@/components/forms/BookingForm";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Book a Meeting",
  description:
    "Request a meeting or participation inquiry with CAFBEX — farmers, agribusiness, investors, partners, and media.",
  path: "/booking",
});

export default function BookingPage() {
  return (
    <>
      <PageHero
        eyebrow="Booking"
        title="Book a meeting or express interest"
        subtitle="Choose the inquiry type that best matches your goals. We aim to respond with relevant next steps."
        imageSrc="/images/booking/hero.jpg"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Booking" }]}
      />

      <GreenBand variant="soft">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <SectionHeading
              eyebrow="Participation"
              title="How booking works"
              description="Submit the form and our team will review your request. Confirmation emails are sent when email delivery is configured."
            />
            <ul className="mt-8 space-y-3 text-sm text-muted">
              <li className="border-l-2 border-lime pl-3">
                General meetings and partnership discussions
              </li>
              <li className="border-l-2 border-lime pl-3">
                Farmer, agribusiness, and investor inquiries
              </li>
              <li className="border-l-2 border-lime pl-3">
                Event, exhibition, training, and trade requests
              </li>
              <li className="border-l-2 border-lime pl-3">Media inquiries</li>
            </ul>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="border border-border bg-white p-6 sm:p-8">
              <BookingForm />
            </div>
          </Reveal>
        </div>
      </GreenBand>
    </>
  );
}
