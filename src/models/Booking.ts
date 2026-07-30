import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const BookingSchema = new Schema(
  {
    fullName: { type: String, required: true, trim: true, maxlength: 120 },
    organization: { type: String, trim: true, maxlength: 160 },
    role: { type: String, trim: true, maxlength: 120 },
    country: { type: String, required: true, trim: true, maxlength: 100 },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      maxlength: 200,
      index: true,
    },
    phone: { type: String, trim: true, maxlength: 40 },
    bookingType: {
      type: String,
      required: true,
      enum: [
        "general-meeting",
        "farmer-participation",
        "agribusiness",
        "investor-meeting",
        "partnership",
        "event-participation",
        "exhibition",
        "training",
        "trade",
        "media",
      ],
      index: true,
    },
    preferredDate: { type: Date },
    preferredTime: { type: String, maxlength: 40 },
    timezone: { type: String, maxlength: 80 },
    areasOfInterest: [{ type: String, maxlength: 100 }],
    message: { type: String, required: true, maxlength: 5000 },
    consent: { type: Boolean, required: true },
    status: {
      type: String,
      enum: ["new", "reviewed", "scheduled", "completed", "cancelled"],
      default: "new",
      index: true,
    },
    adminNotes: { type: String, maxlength: 5000 },
  },
  { timestamps: true },
);

BookingSchema.index({ status: 1, createdAt: -1 });
BookingSchema.index({ bookingType: 1, createdAt: -1 });

export type BookingDocument = InferSchemaType<typeof BookingSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Booking: Model<BookingDocument> =
  mongoose.models.Booking ||
  mongoose.model<BookingDocument>("Booking", BookingSchema);
