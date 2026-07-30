import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/utils";
import { DEFAULT_SETTINGS } from "@/lib/data";

type SeoInput = {
  title?: string;
  description?: string;
  path?: string;
  ogImage?: string;
  noIndex?: boolean;
};

export function buildMetadata(input: SeoInput = {}): Metadata {
  const baseTitle = DEFAULT_SETTINGS.defaultSeo.title;
  const title = input.title
    ? `${input.title} | CAFBEX`
    : baseTitle;
  const description =
    input.description ?? DEFAULT_SETTINGS.defaultSeo.description;
  const url = absoluteUrl(input.path ?? "/");
  const ogImage = input.ogImage || DEFAULT_SETTINGS.defaultSeo.ogImage;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "CAFBEX",
      type: "website",
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
    robots: input.noIndex ? { index: false, follow: false } : undefined,
  };
}

export function pageImages(
  folder: string,
  alts: string[] = [
    "Visual 1",
    "Visual 2",
    "Visual 3",
    "Visual 4",
    "Visual 5",
  ],
): [
  { src: string; alt: string; label: string },
  { src: string; alt: string; label: string },
  { src: string; alt: string; label: string },
  { src: string; alt: string; label: string },
  { src: string; alt: string; label: string },
] {
  return [1, 2, 3, 4, 5].map((n, i) => ({
    src: `/images/${folder}/${String(n).padStart(2, "0")}.jpg`,
    alt: alts[i] ?? `Image ${n}`,
    label: `${folder}/${String(n).padStart(2, "0")}.jpg`,
  })) as [
    { src: string; alt: string; label: string },
    { src: string; alt: string; label: string },
    { src: string; alt: string; label: string },
    { src: string; alt: string; label: string },
    { src: string; alt: string; label: string },
  ];
}
