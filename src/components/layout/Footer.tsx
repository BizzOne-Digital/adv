import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { CafbexLogo } from "@/components/brand/CafbexLogo";
import { Container } from "@/components/ui/Container";
import { CONTACT } from "@/lib/contact";
import { FOOTER_NAV, SERVICE_LINKS } from "@/lib/navigation";
import { cn } from "@/lib/utils";

export type FooterSettings = {
  organizationName?: string;
  shortName?: string;
  missionSnippet?: string;
  email?: string;
  phone?: string;
  address?: string;
};

export type FooterProps = {
  settings?: FooterSettings;
  className?: string;
};

const DEFAULTS: Required<
  Pick<
    FooterSettings,
    "organizationName" | "shortName" | "missionSnippet" | "email" | "phone" | "address"
  >
> = {
  organizationName: "Canada–Africa Farmers Business Exchange",
  shortName: "CAFBEX",
  missionSnippet:
    "Building lasting partnerships between Canada and Africa through agricultural knowledge exchange, trade, investment, and technology.",
  email: CONTACT.primaryEmail,
  phone: "+1 437-873-7675",
  address: "163 Queen Street East, Toronto",
};

export function Footer({ settings, className }: FooterProps) {
  const organizationName = settings?.organizationName ?? DEFAULTS.organizationName;
  const shortName = settings?.shortName ?? DEFAULTS.shortName;
  const missionSnippet = settings?.missionSnippet ?? DEFAULTS.missionSnippet;
  const email = settings?.email ?? DEFAULTS.email;
  const phone = settings?.phone ?? DEFAULTS.phone;
  const address = settings?.address ?? DEFAULTS.address;
  const year = new Date().getFullYear();

  const mainLinks = FOOTER_NAV.filter((l) => l.href !== "/services");

  return (
    <footer className={cn("relative mt-auto border-t border-border bg-forest text-white", className)}>
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(ellipse at 10% 0%, rgba(198,255,78,0.18), transparent 40%), radial-gradient(ellipse at 90% 100%, rgba(30,107,159,0.25), transparent 45%)",
        }}
      />

      <Container className="relative py-14 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr_1fr_1.1fr]">
          <div>
            <CafbexLogo variant="full" size="md" inverted />
            <p className="mt-4 text-sm font-medium text-lime/90">{organizationName}</p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/70">
              {missionSnippet}
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-lime">Explore</h3>
            <ul className="mt-4 space-y-1">
              {mainLinks.slice(0, 6).map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex min-h-11 items-center text-sm text-white/75 transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-lime">Services</h3>
            <ul className="mt-4 space-y-1">
              <li>
                <Link
                  href="/services"
                  className="inline-flex min-h-11 items-center text-sm text-white/75 transition hover:text-white"
                >
                  All services
                </Link>
              </li>
              {SERVICE_LINKS.slice(0, 5).map((s) => (
                <li key={s.href}>
                  <Link
                    href={s.href}
                    className="inline-flex min-h-11 items-center text-sm text-white/75 transition hover:text-white"
                  >
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-lime">Contact</h3>
            <ul className="mt-4 space-y-3 text-sm text-white/80">
              <li>
                <a
                  href={`mailto:${email}`}
                  className="inline-flex items-start gap-2 transition hover:text-lime"
                >
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-lime" />
                  {email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${phone.replace(/\s+/g, "")}`}
                  className="inline-flex items-start gap-2 transition hover:text-lime"
                >
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-lime" />
                  {phone}
                </a>
              </li>
              <li className="inline-flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-lime" />
                <span>{address}</span>
              </li>
            </ul>

            <Link
              href="/booking"
              className="mt-6 inline-flex min-h-11 items-center rounded-full bg-lime px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-forest transition hover:bg-white"
            >
              Book a Meeting
            </Link>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/15 pt-6 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {shortName}. All rights reserved.
          </p>
          <p className="max-w-md sm:text-right">
            Connecting Agriculture. Growing Opportunity.
          </p>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
