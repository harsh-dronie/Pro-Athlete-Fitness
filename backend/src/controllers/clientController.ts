import { Request, Response } from 'express';
import { createClient, listClients, getClient, updateClient, deleteClient } from '../services/clientService';
import { sendSuccess, sendError } from '../utils/response';

function mapError(res: Response, err: any): void {
  const msg: string = err.message || '';
  if (msg.toLowerCase().includes('not found')) sendError(res, msg, 404);
  else if (msg.toLowerCase().includes('already registered')) sendError(res, msg, 409);
  else sendError(res, msg || 'Internal server error', 500);
}

export async function create(req: Request, res: Response): Promise<void> {
  try {
    const client = await createClient(req.body);
    sendSuccess(res, client, 201);
  } catch (err: any) { mapError(res, err); }
}

export async function list(req: Request, res: Response): Promise<void> {
  try {
    const clients = await listClients({ status: req.query.status as string });
    sendSuccess(res, clients);
  } catch (err: any) { mapError(res, err); }
}

export async function getOne(req: Request, res: Response): Promise<void> {
  try {
    const client = await getClient(req.params.id);
    sendSuccess(res, client);
  } catch (err: any) { mapError(res, err); }
}

export async function update(req: Request, res: Response): Promise<void> {
  try {
    const client = await updateClient(req.params.id, req.body);
    sendSuccess(res, client);
  } catch (err: any) { mapError(res, err); }
}

export async function remove(req: Request, res: Response): Promise<void> {
  try {
    await deleteClient(req.params.id);
    sendSuccess(res, null, 204);
  } catch (err: any) { mapError(res, err); }
}
