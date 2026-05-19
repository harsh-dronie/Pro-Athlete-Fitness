import { Request, Response } from 'express';
import { createLead, listLeads, updateLeadStatus } from '../services/leadService';
import { sendSuccess, sendError } from '../utils/response';

function mapError(res: Response, err: any): void {
  const msg: string = err.message || '';
  if (msg.toLowerCase().includes('not found')) sendError(res, msg, 404);
  else if (msg.toLowerCase().includes('invalid status')) sendError(res, msg, 400);
  else sendError(res, msg || 'Internal server error', 500);
}

export async function create(req: Request, res: Response): Promise<void> {
  const { name, phone } = req.body;
  if (!name || !phone) {
    sendError(res, 'Name and phone are required', 400);
    return;
  }
  try {
    const lead = await createLead(req.body);
    sendSuccess(res, lead, 201);
  } catch (err: any) { mapError(res, err); }
}

export async function list(req: Request, res: Response): Promise<void> {
  try {
    const leads = await listLeads(req.query.status as string);
    sendSuccess(res, leads);
  } catch (err: any) { mapError(res, err); }
}

export async function updateStatus(req: Request, res: Response): Promise<void> {
  try {
    const lead = await updateLeadStatus(req.params.id, req.body.status);
    sendSuccess(res, lead);
  } catch (err: any) { mapError(res, err); }
}
