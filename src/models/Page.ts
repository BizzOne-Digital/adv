import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

export const MediaRefSchema = new Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String },
    alt: { type: String, maxlength: 300 },
    width: { type: Number },
    height: { type: Number },
    caption: { type: String, maxlength: 500 },
  },
  { _id: false },
);

export const CtaSchema = new Schema(
  {
    label: { type: String, maxlength: 120 },
    href: { type: String, maxlength: 500 },
    variant: {
      type: String,
      enum: ["primary", "secondary", "outline", "ghost"],
    },
  },
  { _id: false },
);

export const SeoSchema = new Schema(
  {
    title: { type: String, maxlength: 120 },
    description: { type: String, maxlength: 320 },
    ogImage: { type: String },
    canonicalUrl: { type: String },
    noIndex: { type: Boolean, default: false },
  },
  { _id: false },
);

export const SocialLinksSchema = new Schema(
  {
    linkedin: { type: String },
    twitter: { type: String },
    facebook: { type: String },
    instagram: { type: String },
    youtube: { type: String },
    website: { type: String },
  },
  { _id: false },
);

const PageSectionSchema = new Schema(
  {
    key: { type: String, required: true, trim: true, maxlength: 80 },
    eyebrow: { type: String, maxlength: 120 },
    heading: { type: String, maxlength: 200 },
    subheading: { type: String, maxlength: 400 },
    body: { type: String },
    bulletPoints: [{ type: String, maxlength: 500 }],
    images: [MediaRefSchema],
    background: { type: String, maxlength: 200 },
    layout: { type: String, maxlength: 80 },
    ctas: [CtaSchema],
    visible: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    customFields: { type: Map, of: Schema.Types.Mixed },
  },
  { _id: true },
);

const PageSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    summary: { type: String, maxlength: 500 },
    sections: { type: [PageSectionSchema], default: [] },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
      index: true,
    },
    seo: SeoSchema,
    publishedAt: { type: Date },
  },
  { timestamps: true },
);

PageSchema.index({ status: 1, slug: 1 });

export type PageSectionDocument = InferSchemaType<typeof PageSectionSchema>;
export type PageDocument = InferSchemaType<typeof PageSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Page: Model<PageDocument> =
  mongoose.models.Page || mongoose.model<PageDocument>("Page", PageSchema);

export { PageSectionSchema };
