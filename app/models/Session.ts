import mongoose, { Schema, Model } from "mongoose";

export interface ISession {
  sessionId: string;
  userId: string;
  expiresAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}


const SessionSchema: Schema = new Schema(
  {
    sessionId: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

export const SessionModel: Model<ISession> =
  mongoose.models.Session || mongoose.model<ISession>("Session", SessionSchema);
