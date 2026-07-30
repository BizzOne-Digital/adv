import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

import { MediaRefSchema, SocialLinksSchema } from "./Page";

const TeamMemberSchema = new Schema(
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
    role: { type: String, required: true, trim: true, maxlength: 160 },
    bio: { type: String, maxlength: 5000 },
    image: MediaRefSchema,
    socialLinks: SocialLinksSchema,
    department: { type: String, maxlength: 120 },
    isLeadership: { type: Boolean, default: false, index: true },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
      index: true,
    },
    order: { type: Number, default: 0, index: true },
  },
  { timestamps: true },
);

TeamMemberSchema.index({ status: 1, order: 1 });

export type TeamMemberDocument = InferSchemaType<typeof TeamMemberSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const TeamMember: Model<TeamMemberDocument> =
  mongoose.models.TeamMember ||
  mongoose.model<TeamMemberDocument>("TeamMember", TeamMemberSchema);
