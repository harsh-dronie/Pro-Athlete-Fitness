import Client from '../models/Client';
import Payment, { IPayment } from '../models/Payment';
import { extendExpiry, startOfMonth, endOfMonth } from '../utils/dateHelpers';

export async function recordPayment(
  clientId: string,
  data: { amount: number; planDuration: number; paidAt?: Date; notes?: string }
): Promise<{ payment: IPayment; newExpiryDate: Date }> {
  const client = await Client.findById(clientId);
  if (!client) throw new Error('Client not found');

  const payment = await Payment.create({ clientId, ...data });

  const newExpiryDate = extendExpiry(client.expiryDate, data.planDuration);
  client.expiryDate = newExpiryDate;
  client.lastPaymentDate = payment.paidAt;
  await client.save();

  return { payment, newExpiryDate };
}

export async function getPaymentHistory(clientId: string): Promise<IPayment[]> {
  return Payment.find({ clientId }).sort({ paidAt: -1 });
}

export async function getPaidUnpaidSummary(): Promise<{
  paid: number;
  unpaid: number;
  monthlyRevenue: number;
}> {
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  const [totalClients, paidThisMonth, revenueAgg] = await Promise.all([
    Client.countDocuments(),
    Payment.distinct('clientId', { paidAt: { $gte: monthStart, $lte: monthEnd } }),
    Payment.aggregate([
      { $match: { paidAt: { $gte: monthStart, $lte: monthEnd } } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]),
  ]);

  const paid = paidThisMonth.length;
  const unpaid = totalClients - paid;
  const monthlyRevenue = revenueAgg[0]?.total ?? 0;

  return { paid, unpaid, monthlyRevenue };
}
