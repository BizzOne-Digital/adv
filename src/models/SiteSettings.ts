import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

import { MediaRefSchema, SocialLinksSchema } from "./Page";

const DefaultSeoSchema = new Schema(
  {
    title: { type: String, required: true, maxlength: 120 },
    description: { type: String, required: true, maxlength: 320 },
    ogImage: { type: String },
    keywords: [{ type: String, maxlength: 60 }],
  },
  { _id: false },
);

const AnalyticsIdsSchema = new Schema(
  {
    googleAnalytics: { type: String, maxlength: 40 },
    googleTagManager: { type: String, maxlength: 40 },
    metaPixel: { type: String, maxlength: 40 },
  },
  { _id: false },
);

const DataVerificationWarningsSchema = new Schema(
  {
    postalCodePending: { type: Boolean, default: true },
    secondaryEmailPending: { type: Boolean, default: true },
  },
  { _id: false },
);

const SiteSettingsSchema = new Schema(
  {
    organizationName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
      default: "Canada–Africa Farmers Business Exchange",
    },
    shortName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 40,
      default: "CAFBEX",
    },
    logo: MediaRefSchema,
    favicon: MediaRefSchema,
    primaryEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      default: "farm@cafbex.ca",
    },
    secondaryEmail: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      default: "+1 437-873-7675",
    },
    address: {
      type: String,
      required: true,
      trim: true,
      default: "163 Queen Street East",
    },
    city: {
      type: String,
      required: true,
      trim: true,
      default: "Toronto",
    },
    province: {
      type: String,
      required: true,
      trim: true,
      default: "Ontario",
    },
    postalCode: {
      type: String,
      required: true,
      trim: true,
      default: "M5A 151",
    },
    country: {
      type: String,
      required: true,
      trim: true,
      default: "Canada",
    },
    mapEmbed: { type: String },
    mission: {
      type: String,
      required: true,
      default:
        "To build lasting partnerships between Canada and Africa through agricultural knowledge exchange, trade, investment, and technology that improve food security and create economic opportunities for farming communities.",
    },
    vision: {
      type: String,
      required: true,
      default:
        "To become the leading platform connecting Canadian and African farmers for sustainable agriculture, innovation, and economic prosperity.",
    },
    socialLinks: SocialLinksSchema,
    footerContent: { type: String },
    introEnabled: { type: Boolean, default: true },
    introText: {
      type: String,
      default: "Connecting Agriculture. Growing Opportunity.",
    },
    copyright: {
      type: String,
      required: true,
      default: "© CAFBEX. All rights reserved.",
    },
    defaultSeo: {
      type: DefaultSeoSchema,
      required: true,
      default: () => ({
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
      }),
    },
    analyticsIds: AnalyticsIdsSchema,
    contactRecipient: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      default: "farm@cafbex.ca",
    },
    bookingRecipient: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      default: "farm@cafbex.ca",
    },
    dataVerificationWarnings: {
      type: DataVerificationWarningsSchema,
      required: true,
      default: () => ({
        postalCodePending: true,
        secondaryEmailPending: false,
      }),
    },
  },
  { timestamps: true },
);

export type SiteSettingsDocument = InferSchemaType<
  typeof SiteSettingsSchema
> & {
  _id: mongoose.Types.ObjectId;
};

export const SiteSettings: Model<SiteSettingsDocument> =
  mongoose.models.SiteSettings ||
  mongoose.model<SiteSettingsDocument>("SiteSettings", SiteSettingsSchema);
