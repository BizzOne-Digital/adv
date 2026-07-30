import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

import { CtaSchema } from "./Page";

const PricingItemSchema = new Schema(
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
    category: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
      index: true,
    },
    description: { type: String, required: true, maxlength: 5000 },
    inclusions: [{ type: String, maxlength: 300 }],
    priceVisibility: {
      type: String,
      enum: ["contact", "amount", "hidden"],
      default: "contact",
    },
    amount: { type: Number, min: 0 },
    currency: { type: String, maxlength: 10, default: "CAD" },
    cta: CtaSchema,
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
      index: true,
    },
    order: { type: Number, default: 0, index: true },
  },
  { timestamps: true },
);

PricingItemSchema.index({ status: 1, order: 1 });

export type PricingItemDocument = InferSchemaType<typeof PricingItemSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const PricingItem: Model<PricingItemDocument> =
  mongoose.models.PricingItem ||
  mongoose.model<PricingItemDocument>("PricingItem", PricingItemSchema);
