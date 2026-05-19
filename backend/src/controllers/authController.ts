import { Request, Response } from 'express';
import { verifyCredentials } from '../services/authService';
import { sendSuccess, sendError } from '../utils/response';

export async function login(req: Request, res: Response): Promise<void> {
  const { username, password } = req.body;
  if (!username || !password) {
    sendError(res, 'Username and password are required', 400);
    return;
  }
  try {
    const token = await verifyCredentials(username, password);
    sendSuccess(res, { token });
  } catch (err: any) {
    const msg: string = err.message || '';
    if (msg === 'Invalid credentials') sendError(res, msg, 401);
    else sendError(res, msg || 'Internal server error', 500);
  }
}
