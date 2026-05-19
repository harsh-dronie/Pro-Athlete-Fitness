import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
import mongoose from 'mongoose';
import Admin from '../src/models/Admin';
import bcrypt from 'bcryptjs';

const run = async () => {
  await mongoose.connect(process.env.MONGODB_URI!);
  const hash = await bcrypt.hash('yourpassword123', 12);
  await Admin.findOneAndUpdate(
    { username: 'trainer' },
    { passwordHash: hash },
    { upsert: true, new: true }
  );
  console.log('Admin password reset to: yourpassword123');
  await mongoose.disconnect();
};

run().catch(console.error);
