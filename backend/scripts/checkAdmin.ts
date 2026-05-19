import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
import mongoose from 'mongoose';
import Admin from '../src/models/Admin';
import bcrypt from 'bcryptjs';

const run = async () => {
  await mongoose.connect(process.env.MONGODB_URI!);
  const admins = await Admin.find({});
  console.log('Total admins:', admins.length);
  for (const a of admins) {
    console.log('Username:', a.username);
    const match = await bcrypt.compare('yourpassword123', a.passwordHash);
    console.log('Password match:', match);
  }

  // If no admin, create one fresh
  if (admins.length === 0) {
    console.log('No admin found, creating...');
    const hash = await bcrypt.hash('yourpassword123', 12);
    await Admin.create({ username: 'trainer', passwordHash: hash });
    console.log('Admin created!');
  }

  await mongoose.disconnect();
};

run().catch(console.error);
