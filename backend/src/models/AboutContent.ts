import mongoose, { Schema, Document } from 'mongoose';

export interface IMilestone {
  year: string;
  description: string;
}

export interface IAboutContent extends Document {
  trainerName: string;
  bio: string;
  milestones: IMilestone[];
  profileImageUrl?: string;
}

const MilestoneSchema = new Schema<IMilestone>(
  {
    year: { type: String },
    description: { type: String },
  },
  { _id: false }
);

const AboutContentSchema = new Schema<IAboutContent>(
  {
    trainerName: { type: String, required: true },
    bio: { type: String, required: true },
    milestones: { type: [MilestoneSchema], default: [] },
    profileImageUrl: { type: String },
  },
  { timestamps: { createdAt: false, updatedAt: true } }
);

export default mongoose.model<IAboutContent>('AboutContent', AboutContentSchema);
