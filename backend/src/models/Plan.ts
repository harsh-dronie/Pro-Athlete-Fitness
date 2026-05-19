import mongoose, { Schema, Document } from 'mongoose';

export interface IPlan extends Document {
  name: string;
  description: string;
  price: number;
  discountedPrice?: number;
  duration: string; // e.g. "1 Month", "3 Months"
  features: string[];
  badge?: string; // e.g. "Most Popular"
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const PlanSchema = new Schema<IPlan>(
  {
    name: { type: String, required: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true },
    discountedPrice: { type: Number },
    duration: { type: String, required: true },
    features: { type: [String], default: [] },
    badge: { type: String },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<IPlan>('Plan', PlanSchema);
