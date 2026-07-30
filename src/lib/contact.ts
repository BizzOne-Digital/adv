/**
 * Canonical public contact details for CAFBEX.
 * Settings from MongoDB override these when available.
 */
export const CONTACT = {
  organizationName: "Canada–Africa Farmers Business Exchange",
  shortName: "CAFBEX",
  primaryEmail: "mwanjaraa@gmail.com",
  /** Pending verification — possible typo in domain (gamil vs gmail). */
  secondaryEmail: "shambacanada@gamil.com",
  phone: "+1 437-873-7675",
  phoneTel: "+14378737675",
  addressLine: "163 Queen Street East",
  city: "Toronto",
  province: "Ontario",
  /** Pending verification — may be M5A 1S1. */
  postalCode: "M5A 151",
  country: "Canada",
  fullAddress: "163 Queen Street East, Toronto, Ontario",
  mapEmbedQuery: "163+Queen+Street+East,+Toronto,+Ontario",
  verification: {
    postalCodePending: true,
    secondaryEmailPending: true,
  },
} as const;

export function formatFullAddress(parts?: {
  address?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  country?: string;
}): string {
  const address = parts?.address ?? CONTACT.addressLine;
  const city = parts?.city ?? CONTACT.city;
  const province = parts?.province ?? CONTACT.province;
  const postal = parts?.postalCode ?? CONTACT.postalCode;
  const country = parts?.country ?? CONTACT.country;
  return `${address}, ${city}, ${province} ${postal}, ${country}`;
}
