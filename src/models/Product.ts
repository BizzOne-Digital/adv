import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

import { MediaRefSchema, SeoSchema } from "./Page";

const ProductSchema = new Schema(
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
    category: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
      index: true,
    },
    countryOfOrigin: { type: String, maxlength: 100 },
    summary: { type: String, required: true, maxlength: 500 },
    description: { type: String, required: true },
    images: [MediaRefSchema],
    availability: { type: String, maxlength: 200 },
    minimumOrder: { type: String, maxlength: 200 },
    certification: { type: String, maxlength: 300 },
    supplierInfo: { type: String, maxlength: 1000 },
    featured: { type: Boolean, default: false, index: true },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
      index: true,
    },
    order: { type: Number, default: 0, index: true },
    seo: SeoSchema,
  },
  { timestamps: true },
);

ProductSchema.index({ status: 1, featured: 1, order: 1 });

export type ProductDocument = InferSchemaType<typeof ProductSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Product: Model<ProductDocument> =
  mongoose.models.Product ||
  mongoose.model<ProductDocument>("Product", ProductSchema);
