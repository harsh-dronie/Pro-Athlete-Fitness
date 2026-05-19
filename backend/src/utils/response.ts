import { Response } from 'express';

export function sendSuccess(res: Response, data: unknown, status = 200): void {
  res.status(status).json(data);
}

export function sendError(res: Response, message: string, status = 500, details?: unknown): void {
  res.status(status).json({ error: message, ...(details ? { details } : {}) });
}
