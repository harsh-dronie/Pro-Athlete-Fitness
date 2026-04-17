import { Request, Response } from 'express';
import { recordPayment, getPaymentHistory, getPaidUnpaidSummary } from '../services/paymentService';
import { sendSuccess, sendError } from '../utils/response';

function mapError(res: Response, err: any): void {
  const msg: string = err.message || '';
  if (msg.toLowerCase().includes('not found')) sendError(res, msg, 404);
  else sendError(res, msg || 'Internal server error', 500);
}

export async function record(req: Request, res: Response): Promise<void> {
  try {
    const result = await recordPayment(req.params.id, req.body);
    sendSuccess(res, result, 201);
  } catch (err: any) { mapError(res, err); }
}

export async function history(req: Request, res: Response): Promise<void> {
  try {
    const payments = await getPaymentHistory(req.params.id);
    sendSuccess(res, payments);
  } catch (err: any) { mapError(res, err); }
}

export async function summary(req: Request, res: Response): Promise<void> {
  try {
    const data = await getPaidUnpaidSummary();
    sendSuccess(res, data);
  } catch (err: any) { mapError(res, err); }
}
