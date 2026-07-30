import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

import { MediaRefSchema } from "./Page";

const GalleryItemSchema = new Schema(
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
    caption: { type: String, maxlength: 500 },
    category: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
      index: true,
    },
    mediaType: {
      type: String,
      enum: ["image", "video"],
      default: "image",
    },
    media: { type: MediaRefSchema, required: true },
    location: { type: String, maxlength: 200 },
    date: { type: Date },
    activitySlug: { type: String, maxlength: 200, index: true },
    eventSlug: { type: String, maxlength: 200, index: true },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
      index: true,
    },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0, index: true },
  },
  { timestamps: true },
);

GalleryItemSchema.index({ status: 1, category: 1, order: 1 });

export type GalleryItemDocument = InferSchemaType<typeof GalleryItemSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const GalleryItem: Model<GalleryItemDocument> =
  mongoose.models.GalleryItem ||
  mongoose.model<GalleryItemDocument>("GalleryItem", GalleryItemSchema);
