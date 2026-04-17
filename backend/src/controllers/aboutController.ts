import { Request, Response } from 'express';
import { getAbout, updateAbout } from '../services/aboutService';
import { sendSuccess, sendError } from '../utils/response';

export async function get(req: Request, res: Response): Promise<void> {
  try {
    const data = await getAbout();
    if (!data) {
      sendError(res, 'About content not configured', 404);
      return;
    }
    sendSuccess(res, data);
  } catch (err: any) {
    sendError(res, err.message || 'Internal server error', 500);
  }
}

export async function update(req: Request, res: Response): Promise<void> {
  try {
    const profileImagePath = (req.file as Express.Multer.File | undefined)?.path;
    const body = { ...req.body };
    // milestones comes as JSON string from FormData
    if (typeof body.milestones === 'string') {
      try { body.milestones = JSON.parse(body.milestones); } catch { body.milestones = []; }
    }
    const result = await updateAbout(body, profileImagePath);
    sendSuccess(res, result);
  } catch (err: any) {
    sendError(res, err.message || 'Internal server error', 500);
  }
}
