import { Request, Response } from 'express';
import Client from '../models/Client';
import { sendSms, getReminderMessage } from '../services/smsService';
import { runDailyReminders } from '../services/schedulerService';
import { sendSuccess, sendError } from '../utils/response';
import { classifyExpiry } from '../utils/dateHelpers';

// Manually send reminder to a specific client
export async function sendClientReminder(req: Request, res: Response): Promise<void> {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) { sendError(res, 'Client not found', 404); return; }
    if (!client.phone) { sendError(res, 'Client has no phone number', 400); return; }

    const status = classifyExpiry(client.expiryDate);
    const daysLeft = status === 'expired' ? 0 : status === 'expiring_soon' ? 2 : 7;
    const message = getReminderMessage(client.name, client.expiryDate, daysLeft);
    const result = await sendSms(client.phone, message);

    if (result.success) sendSuccess(res, { message: 'SMS sent', ...result });
    else sendError(res, result.error || 'Failed to send SMS', 500);
  } catch (err: any) {
    sendError(res, err.message || 'Internal server error', 500);
  }
}

// Manually trigger all daily reminders
export async function triggerDailyReminders(req: Request, res: Response): Promise<void> {
  try {
    await runDailyReminders();
    sendSuccess(res, { message: 'Daily reminders triggered successfully' });
  } catch (err: any) {
    sendError(res, err.message || 'Internal server error', 500);
  }
}
