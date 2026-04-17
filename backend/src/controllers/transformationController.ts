import { Request, Response } from 'express';
import { addTransformation, listTransformations, deleteTransformation } from '../services/transformationService';
import { sendSuccess, sendError } from '../utils/response';

function mapError(res: Response, err: any): void {
  const msg: string = err.message || '';
  if (msg.toLowerCase().includes('not found')) sendError(res, msg, 404);
  else sendError(res, msg || 'Internal server error', 500);
}

export async function add(req: Request, res: Response): Promise<void> {
  try {
    const result = await addTransformation(req.body, req.files as any);
    sendSuccess(res, result, 201);
  } catch (err: any) { mapError(res, err); }
}

export async function list(req: Request, res: Response): Promise<void> {
  try {
    const transformations = await listTransformations();
    sendSuccess(res, transformations);
  } catch (err: any) { mapError(res, err); }
}

export async function remove(req: Request, res: Response): Promise<void> {
  try {
    await deleteTransformation(req.params.id);
    sendSuccess(res, null, 204);
  } catch (err: any) { mapError(res, err); }
}
