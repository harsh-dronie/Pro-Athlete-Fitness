import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

import express from 'express';
import cors from 'cors';
import connectDB from './config/db';
import router from './routes/index';
import errorHandler from './middleware/errorHandler';
import { startScheduler } from './services/schedulerService';

const app = express();

app.use(express.json());
app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api', router);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      startScheduler();
    });
  });
}

export default app;
