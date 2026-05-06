import cron from 'node-cron';
import Client from '../models/Client';
import { sendSms, getReminderMessage } from './smsService';
import { startOfDay, endOfDay, addDays } from '../utils/dateHelpers';

async function sendRemindersForDay(targetDate: Date, daysLeft: number): Promise<void> {
  const clients = await Client.find({
    expiryDate: { $gte: startOfDay(targetDate), $lte: endOfDay(targetDate) },
    phone: { $exists: true, $ne: '' },
  });

  console.log(`[Scheduler] ${daysLeft === 0 ? 'Expiry day' : `${daysLeft}-day reminder`}: ${clients.length} client(s)`);

  for (const client of clients) {
    const message = getReminderMessage(client.name, client.expiryDate, daysLeft);
    await sendSms(client.phone, message);
  }
}

export async function runDailyReminders(): Promise<void> {
  console.log(`[Scheduler] Running daily reminders at ${new Date().toISOString()}`);
  const now = new Date();
  await Promise.allSettled([
    sendRemindersForDay(now, 0),
    sendRemindersForDay(addDays(now, 2), 2),
    sendRemindersForDay(addDays(now, 7), 7),
  ]);
  console.log(`[Scheduler] Daily reminders complete`);
}

// Runs every day at 9:00 AM
export function startScheduler(): void {
  cron.schedule('0 9 * * *', async () => {
    await runDailyReminders();
  }, { timezone: 'Asia/Kolkata' });
  console.log('[Scheduler] Daily SMS reminder job scheduled at 9:00 AM IST');

  // Keep-alive ping every 10 minutes (only in production)
  if (process.env.NODE_ENV === 'production') {
    cron.schedule('*/10 * * * *', async () => {
      try {
        const url = process.env.APP_URL || 'https://pro-athlete-fitness-1.onrender.com';
        const response = await fetch(`${url}/api/plans`);
        console.log(`[Scheduler] Keep-alive ping sent - Status: ${response.status}`);
      } catch (err: any) {
        console.error('[Scheduler] Keep-alive ping failed:', err.message);
      }
    });
    console.log('[Scheduler] Keep-alive ping scheduled every 10 minutes');
  }
}
