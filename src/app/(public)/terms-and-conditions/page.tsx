import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { CONTACT } from "@/lib/contact";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Terms and Conditions",
  description: "Terms governing use of the CAFBEX website and related inquiry services.",
  path: "/terms-and-conditions",
});

export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Terms and Conditions"
        subtitle="Please read these terms before using the CAFBEX website or submitting forms."
        showImage={false}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Terms and Conditions" }]}
        tone="light"
      />

      <section className="bg-white py-16 sm:py-20">
        <Container className="prose prose-forest max-w-3xl">
          <Reveal>
            <p className="text-sm text-muted">Last updated: July 30, 2026</p>
            <h2>Acceptance</h2>
            <p>
              By accessing this website, you agree to these Terms and Conditions and our Privacy
              Policy. If you do not agree, please do not use the site.
            </p>
            <h2>Informational purpose</h2>
            <p>
              Content on this website is provided for general information about CAFBEX activities
              and potential programmes. Descriptions may use careful language such as “aims to” or
              “may include.” Nothing on this site constitutes a binding offer, investment advice,
              or guarantee of outcomes, pricing, or participation unless separately confirmed in
              writing.
            </p>
            <h2>No fabricated claims</h2>
            <p>
              Published events, products, testimonials, and team profiles appear only when approved.
              Absence of listings means content has not been published — not that unpublished items
              should be assumed.
            </p>
            <h2>Inquiries and bookings</h2>
            <p>
              Submitting a form creates a request for communication, not a confirmed booking,
              contract, or reservation, until CAFBEX expressly confirms otherwise.
            </p>
            <h2>Intellectual property</h2>
            <p>
              Site design, text, logos, and media are owned by CAFBEX or its licensors. You may not
              copy or reuse materials for commercial purposes without prior written permission.
            </p>
            <h2>User conduct</h2>
            <p>
              You agree not to misuse forms, attempt to disrupt the site, submit malicious content,
              or provide false information.
            </p>
            <h2>Third-party links</h2>
            <p>
              Links to external sites are provided for convenience. CAFBEX is not responsible for
              third-party content or practices.
            </p>
            <h2>Disclaimer</h2>
            <p>
              The website is provided “as is.” To the fullest extent permitted by law, CAFBEX
              disclaims warranties of accuracy, completeness, or fitness for a particular purpose.
            </p>
            <h2>Limitation of liability</h2>
            <p>
              To the fullest extent permitted by applicable law, CAFBEX shall not be liable for
              indirect, incidental, or consequential damages arising from use of this website.
            </p>
            <h2>Governing law</h2>
            <p>
              These terms are governed by the laws of the Province of Ontario and the applicable
              laws of Canada, without regard to conflict-of-law principles.
            </p>
            <h2>Contact</h2>
            <p>
              Questions about these terms:{" "}
              <a href={`mailto:${CONTACT.primaryEmail}`}>{CONTACT.primaryEmail}</a> · {CONTACT.phone}
            </p>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
