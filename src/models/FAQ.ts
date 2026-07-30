import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const FAQSchema = new Schema(
  {
    question: { type: String, required: true, trim: true, maxlength: 400 },
    answer: { type: String, required: true, maxlength: 10_000 },
    category: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
      index: true,
    },
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

FAQSchema.index({ status: 1, category: 1, order: 1 });

export type FAQDocument = InferSchemaType<typeof FAQSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const FAQ: Model<FAQDocument> =
  mongoose.models.FAQ || mongoose.model<FAQDocument>("FAQ", FAQSchema);
