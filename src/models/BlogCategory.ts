import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const BlogCategorySchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    description: { type: String, maxlength: 500 },
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

export type BlogCategoryDocument = InferSchemaType<
  typeof BlogCategorySchema
> & {
  _id: mongoose.Types.ObjectId;
};

export const BlogCategory: Model<BlogCategoryDocument> =
  mongoose.models.BlogCategory ||
  mongoose.model<BlogCategoryDocument>("BlogCategory", BlogCategorySchema);
