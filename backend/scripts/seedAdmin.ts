import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import connectDB from '../src/config/db';
import Admin from '../src/models/Admin';

dotenv.config({ path: '.env' });

const seed = async (): Promise<void> => {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;

  if (!username || !password) {
    console.error('Error: ADMIN_USERNAME and ADMIN_PASSWORD must be set in environment variables');
    process.exit(1);
  }

  await connectDB();

  const existing = await Admin.findOne({ username });
  if (existing) {
    console.log('Admin already exists, skipping');
    await mongoose.disconnect();
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await Admin.create({ username, passwordHash });
  console.log('Admin created successfully');

  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
