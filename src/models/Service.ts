import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

import { CtaSchema, MediaRefSchema, SeoSchema } from "./Page";

const ServiceFaqSchema = new Schema(
  {
    question: { type: String, required: true, maxlength: 400 },
    answer: { type: String, required: true, maxlength: 5000 },
  },
  { _id: false },
);

const ServiceSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 200 },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    icon: { type: String, maxlength: 80 },
    summary: { type: String, required: true, maxlength: 500 },
    description: { type: String, required: true },
    heroHeading: { type: String, maxlength: 200 },
    heroSubheading: { type: String, maxlength: 400 },
    heroImage: MediaRefSchema,
    purpose: { type: String },
    intendedParticipants: [{ type: String, maxlength: 160 }],
    potentialActivities: [{ type: String, maxlength: 300 }],
    valueAreas: [{ type: String, maxlength: 300 }],
    objectives: [{ type: String, maxlength: 300 }],
    activities: [{ type: String, maxlength: 300 }],
    gallery: [MediaRefSchema],
    faqs: [ServiceFaqSchema],
    relatedServiceSlugs: [{ type: String, maxlength: 200 }],
    cta: CtaSchema,
    seo: SeoSchema,
    order: { type: Number, default: 0, index: true },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
      index: true,
    },
  },
  { timestamps: true },
);

ServiceSchema.index({ status: 1, order: 1 });

export type ServiceDocument = InferSchemaType<typeof ServiceSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Service: Model<ServiceDocument> =
  mongoose.models.Service ||
  mongoose.model<ServiceDocument>("Service", ServiceSchema);
