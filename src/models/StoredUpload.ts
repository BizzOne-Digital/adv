import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

export const UPLOAD_FOLDERS = ["pages", "products", "gallery", "misc"] as const;
export type UploadFolder = (typeof UPLOAD_FOLDERS)[number];

const StoredUploadSchema = new Schema(
  {
    folder: {
      type: String,
      required: true,
      enum: UPLOAD_FOLDERS,
      index: true,
    },
    filename: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    mimeType: {
      type: String,
      required: true,
      maxlength: 100,
    },
    size: {
      type: Number,
      required: true,
      min: 0,
    },
    data: {
      type: Buffer,
      required: true,
    },
  },
  { timestamps: true },
);

StoredUploadSchema.index({ folder: 1, filename: 1 }, { unique: true });

export type StoredUploadDocument = InferSchemaType<typeof StoredUploadSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const StoredUpload: Model<StoredUploadDocument> =
  mongoose.models.StoredUpload ||
  mongoose.model<StoredUploadDocument>("StoredUpload", StoredUploadSchema);
