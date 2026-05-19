import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IPayment extends Document {
  clientId: Types.ObjectId;
  amount: number;
  planDuration: number;
  paidAt: Date;
  notes?: string;
}

const PaymentSchema = new Schema<IPayment>(
  {
    clientId: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
    amount: { type: Number, required: true, min: 0.01 },
    planDuration: { type: Number, required: true, min: 1 },
    paidAt: { type: Date, default: Date.now },
    notes: { type: String },
  },
  { timestamps: true }
);

PaymentSchema.index({ clientId: 1 });
PaymentSchema.index({ paidAt: 1 });

export default mongoose.model<IPayment>('Payment', PaymentSchema);
