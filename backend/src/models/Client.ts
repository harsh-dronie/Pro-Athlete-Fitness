import mongoose, { Schema, Document } from 'mongoose';

export interface IClient extends Document {
  name: string;
  phone: string;
  email?: string;
  joinDate: Date;
  planDuration: number;
  expiryDate: Date;
  personalTraining: boolean;
  notes?: string;
  lastPaymentDate?: Date;
}

const ClientSchema = new Schema<IClient>(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String },
    joinDate: { type: Date, required: true, default: Date.now },
    planDuration: { type: Number, required: true, min: 1 },
    expiryDate: { type: Date, required: true },
    personalTraining: { type: Boolean, default: false },
    notes: { type: String },
    lastPaymentDate: { type: Date },
  },
  { timestamps: true }
);

ClientSchema.index({ phone: 1 }, { unique: true });
ClientSchema.index({ expiryDate: 1 });

export default mongoose.model<IClient>('Client', ClientSchema);
