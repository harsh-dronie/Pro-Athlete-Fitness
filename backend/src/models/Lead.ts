import mongoose, { Schema, Document } from 'mongoose';

export type LeadStatus = 'new' | 'contacted' | 'converted' | 'not_interested';

export interface ILead extends Document {
  name: string;
  phone: string;
  goal?: string;
  status: LeadStatus;
}

const LeadSchema = new Schema<ILead>(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    goal: { type: String },
    status: {
      type: String,
      enum: ['new', 'contacted', 'converted', 'not_interested'],
      default: 'new',
    },
  },
  { timestamps: true }
);

LeadSchema.index({ status: 1 });

export default mongoose.model<ILead>('Lead', LeadSchema);
