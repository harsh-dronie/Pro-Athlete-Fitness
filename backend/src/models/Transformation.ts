import mongoose, { Schema, Document } from 'mongoose';

export interface ITransformation extends Document {
  clientName?: string;
  duration: string;
  resultDescription: string;
  beforeImageUrl: string;
  afterImageUrl: string;
}

const TransformationSchema = new Schema<ITransformation>(
  {
    clientName: { type: String },
    duration: { type: String, required: true },
    resultDescription: { type: String, required: true },
    beforeImageUrl: { type: String, required: true },
    afterImageUrl: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<ITransformation>('Transformation', TransformationSchema);
