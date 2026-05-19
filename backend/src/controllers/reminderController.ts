import { Request, Response } from 'express';
import { getReminders } from '../services/reminderService';
import { sendSuccess, sendError } from '../utils/response';

export async function getRemindersHandler(req: Request, res: Response): Promise<void> {
  try {
    const data = await getReminders();
    sendSuccess(res, data);
  } catch (err: any) {
    sendError(res, err.message || 'Internal server error', 500);
  }
}
