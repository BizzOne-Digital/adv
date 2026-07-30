import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

import { MediaRefSchema } from "./Page";

const TestimonialSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    role: { type: String, trim: true, maxlength: 160 },
    organization: { type: String, trim: true, maxlength: 160 },
    country: { type: String, trim: true, maxlength: 100 },
    quote: { type: String, required: true, maxlength: 2000 },
    image: MediaRefSchema,
    featured: { type: Boolean, default: false, index: true },
    approved: { type: Boolean, default: false, index: true },
    isSample: { type: Boolean, default: false },
    order: { type: Number, default: 0, index: true },
  },
  { timestamps: true },
);

TestimonialSchema.index({ approved: 1, featured: 1, order: 1 });

export type TestimonialDocument = InferSchemaType<typeof TestimonialSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Testimonial: Model<TestimonialDocument> =
  mongoose.models.Testimonial ||
  mongoose.model<TestimonialDocument>("Testimonial", TestimonialSchema);
