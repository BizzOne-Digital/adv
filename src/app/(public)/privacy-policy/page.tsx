import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { CONTACT } from "@/lib/contact";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description: "How CAFBEX collects, uses, and protects personal information.",
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        subtitle="How we handle personal information submitted through the CAFBEX website."
        showImage={false}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]}
        tone="light"
      />

      <section className="bg-white py-16 sm:py-20">
        <Container className="prose prose-forest max-w-3xl">
          <Reveal>
            <p className="text-sm text-muted">Last updated: July 30, 2026</p>
            <h2>Who we are</h2>
            <p>
              Canada–Africa Farmers Business Exchange (“CAFBEX”, “we”, “us”) operates this website
              to share information about agricultural exchange, programmes, and opportunities, and
              to receive inquiries and booking requests.
            </p>
            <h2>Information we collect</h2>
            <p>When you submit a form, we may collect:</p>
            <ul>
              <li>Name, organisation, role, and country</li>
              <li>Email address and phone number</li>
              <li>Inquiry or booking type, message content, and preferences you provide</li>
              <li>Technical data such as IP address for rate-limiting and security</li>
            </ul>
            <h2>How we use information</h2>
            <p>We use submitted information to:</p>
            <ul>
              <li>Respond to inquiries and booking requests</li>
              <li>Send confirmation or follow-up messages when email is configured</li>
              <li>Administer our programmes and improve our services</li>
              <li>Protect the website against abuse</li>
            </ul>
            <h2>Legal basis and consent</h2>
            <p>
              Where required, we rely on your consent (via the form checkbox) and/or our legitimate
              interest in responding to business inquiries. You may withdraw consent by contacting
              us; we may retain records as needed for legal or operational purposes.
            </p>
            <h2>Sharing</h2>
            <p>
              We do not sell personal information. We may share data with service providers who help
              us operate email delivery, hosting, or databases, under appropriate safeguards, or when
              required by law.
            </p>
            <h2>Retention</h2>
            <p>
              Inquiry and booking records are retained as long as reasonably necessary to manage
              correspondence and organisational records, unless a longer period is required by law.
            </p>
            <h2>Your rights</h2>
            <p>
              Depending on applicable law (including Canadian privacy legislation), you may request
              access to, correction of, or deletion of personal information we hold about you,
              subject to legal exceptions.
            </p>
            <h2>Contact</h2>
            <p>
              Privacy requests:{" "}
              <a href={`mailto:${CONTACT.primaryEmail}`}>{CONTACT.primaryEmail}</a>
              <br />
              Phone: {CONTACT.phone}
              <br />
              Address: {CONTACT.fullAddress}
            </p>
            <h2>Changes</h2>
            <p>
              We may update this policy from time to time. The “Last updated” date reflects the
              latest revision published on this site.
            </p>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
