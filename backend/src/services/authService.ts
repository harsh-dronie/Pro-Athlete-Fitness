import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin';
import { AdminPayload } from '../middleware/auth';

export async function verifyCredentials(username: string, password: string): Promise<string> {
  const admin = await Admin.findOne({ username });
  if (!admin) throw new Error('Invalid credentials');

  const match = await bcrypt.compare(password, admin.passwordHash);
  if (!match) throw new Error('Invalid credentials');

  const secret = process.env.JWT_SECRET!;
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

  const payload: AdminPayload = { id: (admin._id as unknown as string).toString(), username: admin.username };
  return jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);
}

export function verifyToken(token: string): AdminPayload {
  const secret = process.env.JWT_SECRET!;
  return jwt.verify(token, secret) as AdminPayload;
}
