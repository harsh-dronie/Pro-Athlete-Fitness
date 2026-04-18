import mongoose, { Schema, Document } from 'mongoose';

export interface IHeroContent extends Document {
  backgroundImageUrl: string;
  trainerImageUrl: string;
  updatedAt: Date;
}

const HeroContentSchema = new Schema<IHeroContent>(
  {
    backgroundImageUrl: { type: String, default: '' },
    trainerImageUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model<IHeroContent>('HeroContent', HeroContentSchema);
