import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const ActivityLogSchema = new Schema(
  {
    actorId: { type: Schema.Types.ObjectId, ref: "AdminUser", index: true },
    actorEmail: { type: String, lowercase: true, trim: true, index: true },
    action: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
      index: true,
    },
    entityType: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
      index: true,
    },
    entityId: { type: String, index: true },
    summary: { type: String, required: true, maxlength: 500 },
    metadata: { type: Map, of: Schema.Types.Mixed },
    ipAddress: { type: String, maxlength: 80 },
  },
  { timestamps: true },
);

ActivityLogSchema.index({ createdAt: -1 });
ActivityLogSchema.index({ entityType: 1, entityId: 1, createdAt: -1 });

export type ActivityLogDocument = InferSchemaType<typeof ActivityLogSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const ActivityLog: Model<ActivityLogDocument> =
  mongoose.models.ActivityLog ||
  mongoose.model<ActivityLogDocument>("ActivityLog", ActivityLogSchema);
