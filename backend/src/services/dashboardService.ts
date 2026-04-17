import Client from '../models/Client';
import Payment from '../models/Payment';
import { addDays, startOfMonth, endOfMonth } from '../utils/dateHelpers';

export async function getStats(): Promise<{
  totalClients: number;
  activeClients: number;
  expiringSoon: number;
  monthlyRevenue: number;
}> {
  const now = new Date();
  const sevenDaysLater = addDays(now, 7);
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  const [totalClients, activeClients, expiringSoon, revenueAgg] = await Promise.all([
    Client.countDocuments(),
    Client.countDocuments({ expiryDate: { $gt: sevenDaysLater } }),
    Client.countDocuments({ expiryDate: { $gte: now, $lte: sevenDaysLater } }),
    Payment.aggregate([
      { $match: { paidAt: { $gte: monthStart, $lte: monthEnd } } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]),
  ]);

  const monthlyRevenue = revenueAgg[0]?.total ?? 0;

  return { totalClients, activeClients, expiringSoon, monthlyRevenue };
}
