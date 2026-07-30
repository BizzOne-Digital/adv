import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const InquirySchema = new Schema(
  {
    fullName: { type: String, required: true, trim: true, maxlength: 120 },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      maxlength: 200,
      index: true,
    },
    phone: { type: String, trim: true, maxlength: 40 },
    organization: { type: String, trim: true, maxlength: 160 },
    country: { type: String, trim: true, maxlength: 100 },
    inquiryType: {
      type: String,
      required: true,
      enum: [
        "general",
        "farmer",
        "agribusiness",
        "investment",
        "partnership",
        "media",
      ],
      index: true,
    },
    subject: { type: String, trim: true, maxlength: 200 },
    message: { type: String, required: true, maxlength: 5000 },
    consent: { type: Boolean, required: true },
    status: {
      type: String,
      enum: ["new", "in-progress", "resolved", "archived"],
      default: "new",
      index: true,
    },
    adminNotes: { type: String, maxlength: 5000 },
  },
  { timestamps: true },
);

InquirySchema.index({ status: 1, createdAt: -1 });
InquirySchema.index({ inquiryType: 1, createdAt: -1 });

export type InquiryDocument = InferSchemaType<typeof InquirySchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Inquiry: Model<InquiryDocument> =
  mongoose.models.Inquiry ||
  mongoose.model<InquiryDocument>("Inquiry", InquirySchema);
