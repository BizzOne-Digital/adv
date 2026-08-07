import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SiteMusic } from "@/components/layout/SiteMusic";
import { CONTACT, formatFullAddress } from "@/lib/contact";
import { getSettings } from "@/lib/data";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();

  return (
    <>
      <Header
        settings={{
          organizationName: settings.organizationName,
          shortName: settings.shortName,
        }}
      />
      <main className="min-w-0 flex-1 overflow-x-clip">{children}</main>
      <Footer
        settings={{
          organizationName: settings.organizationName,
          shortName: settings.shortName,
          missionSnippet: settings.mission,
          email: settings.primaryEmail || CONTACT.primaryEmail,
          phone: settings.phone,
          address: formatFullAddress(settings),
          copyright: settings.copyright,
          socialLinks: settings.socialLinks,
        }}
      />
      <SiteMusic />
    </>
  );
}
