import { Request, Response } from 'express';
import { getStats } from '../services/dashboardService';
import { sendSuccess, sendError } from '../utils/response';

export async function getStatsHandler(req: Request, res: Response): Promise<void> {
  try {
    const data = await getStats();
    sendSuccess(res, data);
  } catch (err: any) {
    sendError(res, err.message || 'Internal server error', 500);
  }
}
