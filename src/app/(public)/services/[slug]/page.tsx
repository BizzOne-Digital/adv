import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServiceDetail } from "@/components/services/ServiceDetail";
import { getKnownServiceSlugs, getServiceBySlug } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import { resolveServicePage } from "@/lib/services-content";

type Props = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = true;

export async function generateStaticParams() {
  return getKnownServiceSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const db = await getServiceBySlug(slug);
    const service = resolveServicePage(slug, db);
    if (!service) {
      return buildMetadata({
        title: "Service",
        path: `/services/${slug}`,
        noIndex: true,
      });
    }
    return buildMetadata({
      title: service.name,
      description: service.summary,
      path: `/services/${slug}`,
    });
  } catch {
    return buildMetadata({ title: "Service", path: `/services/${slug}` });
  }
}

export default async function ServiceSlugPage({ params }: Props) {
  const { slug } = await params;
  const known = getKnownServiceSlugs();

  let db = null;
  try {
    db = await getServiceBySlug(slug);
  } catch {
    db = null;
  }

  const service = resolveServicePage(slug, db);

  if (!service) {
    if (!known.includes(slug)) notFound();
    // Known slug should always resolve via static content — defensive fallback
    notFound();
  }

  return <ServiceDetail service={service} />;
}
