import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const MediaAssetSchema = new Schema(
  {
    publicId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    url: { type: String, required: true },
    secureUrl: { type: String, required: true },
    resourceType: {
      type: String,
      enum: ["image", "video", "raw"],
      default: "image",
      index: true,
    },
    format: { type: String, maxlength: 20 },
    width: { type: Number },
    height: { type: Number },
    bytes: { type: Number },
    folder: { type: String, maxlength: 200, index: true },
    alt: { type: String, maxlength: 300 },
    caption: { type: String, maxlength: 500 },
    tags: [{ type: String, trim: true, maxlength: 60 }],
  },
  { timestamps: true },
);

MediaAssetSchema.index({ folder: 1, createdAt: -1 });
MediaAssetSchema.index({ tags: 1 });
MediaAssetSchema.index({ alt: "text", caption: "text", publicId: "text" });

export type MediaAssetDocument = InferSchemaType<typeof MediaAssetSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const MediaAsset: Model<MediaAssetDocument> =
  mongoose.models.MediaAsset ||
  mongoose.model<MediaAssetDocument>("MediaAsset", MediaAssetSchema);
