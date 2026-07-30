import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

import { CtaSchema, MediaRefSchema, SeoSchema } from "./Page";

const ActivitySchema = new Schema(
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
    summary: { type: String, required: true, maxlength: 500 },
    description: { type: String, required: true },
    images: [MediaRefSchema],
    intendedAudience: [{ type: String, maxlength: 120 }],
    location: { type: String, maxlength: 200 },
    date: { type: Date },
    registrationStatus: {
      type: String,
      enum: [
        "open",
        "closed",
        "waitlist",
        "invitation-only",
        "not-applicable",
      ],
      default: "not-applicable",
    },
    cta: CtaSchema,
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
      index: true,
    },
    order: { type: Number, default: 0, index: true },
    seo: SeoSchema,
  },
  { timestamps: true },
);

ActivitySchema.index({ status: 1, order: 1 });

export type ActivityDocument = InferSchemaType<typeof ActivitySchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Activity: Model<ActivityDocument> =
  mongoose.models.Activity ||
  mongoose.model<ActivityDocument>("Activity", ActivitySchema);
