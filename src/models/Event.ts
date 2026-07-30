import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

import { MediaRefSchema, SeoSchema } from "./Page";

const EventAgendaItemSchema = new Schema(
  {
    time: { type: String, maxlength: 40 },
    title: { type: String, required: true, maxlength: 200 },
    description: { type: String, maxlength: 1000 },
    speaker: { type: String, maxlength: 120 },
  },
  { _id: false },
);

const EventSpeakerSchema = new Schema(
  {
    name: { type: String, required: true, maxlength: 120 },
    role: { type: String, maxlength: 120 },
    organization: { type: String, maxlength: 160 },
    bio: { type: String, maxlength: 2000 },
    image: MediaRefSchema,
  },
  { _id: false },
);

const EventSchema = new Schema(
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
    summary: { type: String, required: true, maxlength: 500 },
    description: { type: String, required: true },
    category: { type: String, maxlength: 100, index: true },
    location: { type: String, maxlength: 200 },
    venue: { type: String, maxlength: 200 },
    startDate: { type: Date, required: true, index: true },
    endDate: { type: Date },
    timezone: { type: String, maxlength: 80 },
    images: [MediaRefSchema],
    agenda: [EventAgendaItemSchema],
    speakers: [EventSpeakerSchema],
    capacity: { type: Number, min: 1 },
    registrationDeadline: { type: Date },
    registrationUrl: { type: String },
    contactEmail: { type: String },
    contactPhone: { type: String, maxlength: 40 },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
      index: true,
    },
    featured: { type: Boolean, default: false, index: true },
    seo: SeoSchema,
  },
  { timestamps: true },
);

EventSchema.index({ status: 1, startDate: 1 });
EventSchema.index({ status: 1, featured: 1 });

export type EventDocument = InferSchemaType<typeof EventSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Event: Model<EventDocument> =
  mongoose.models.Event || mongoose.model<EventDocument>("Event", EventSchema);
