import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

import { MediaRefSchema, SeoSchema } from "./Page";

const BlogPostSchema = new Schema(
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
    excerpt: { type: String, required: true, maxlength: 500 },
    content: { type: String, required: true },
    coverImage: MediaRefSchema,
    images: [MediaRefSchema],
    categoryIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "BlogCategory",
      },
    ],
    tags: [{ type: String, trim: true, maxlength: 60 }],
    authorName: { type: String, maxlength: 120 },
    authorId: { type: Schema.Types.ObjectId, ref: "AdminUser" },
    readingTimeMinutes: { type: Number, min: 1, default: 1 },
    featured: { type: Boolean, default: false, index: true },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
      index: true,
    },
    publishedAt: { type: Date, index: true },
    seo: SeoSchema,
  },
  { timestamps: true },
);

BlogPostSchema.index({ status: 1, publishedAt: -1 });
BlogPostSchema.index({ status: 1, featured: 1 });
BlogPostSchema.index({ tags: 1 });

export type BlogPostDocument = InferSchemaType<typeof BlogPostSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const BlogPost: Model<BlogPostDocument> =
  mongoose.models.BlogPost ||
  mongoose.model<BlogPostDocument>("BlogPost", BlogPostSchema);
