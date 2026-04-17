import { Router } from 'express';
import authRouter from './auth';
import adminRouter from './admin';
import publicRouter from './public';

const router = Router();

router.use('/auth', authRouter);
router.use('/admin', adminRouter);
router.use('/', publicRouter);

export default router;
