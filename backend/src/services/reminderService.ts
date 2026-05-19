import Client, { IClient } from '../models/Client';
import { startOfDay, endOfDay, addDays } from '../utils/dateHelpers';

type ReminderClient = Pick<IClient, '_id' | 'name' | 'phone' | 'expiryDate'>;

async function getClientsExpiringOn(targetDate: Date): Promise<ReminderClient[]> {
  return Client.find(
    { expiryDate: { $gte: startOfDay(targetDate), $lte: endOfDay(targetDate) } },
    { _id: 1, name: 1, phone: 1, expiryDate: 1 }
  );
}

export async function getReminders(): Promise<{
  today: ReminderClient[];
  in2Days: ReminderClient[];
  in7Days: ReminderClient[];
}> {
  const now = new Date();
  const [today, in2Days, in7Days] = await Promise.all([
    getClientsExpiringOn(now),
    getClientsExpiringOn(addDays(now, 2)),
    getClientsExpiringOn(addDays(now, 7)),
  ]);

  return { today, in2Days, in7Days };
}
