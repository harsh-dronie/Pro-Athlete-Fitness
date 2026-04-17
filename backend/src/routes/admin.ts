import { Router } from 'express';
import auth from '../middleware/auth';
import { uploadTransformation, uploadAbout } from '../middleware/upload';
import * as clientController from '../controllers/clientController';
import * as paymentController from '../controllers/paymentController';
import * as reminderController from '../controllers/reminderController';
import * as dashboardController from '../controllers/dashboardController';
import * as transformationController from '../controllers/transformationController';
import * as aboutController from '../controllers/aboutController';
import * as leadController from '../controllers/leadController';
import * as smsController from '../controllers/smsController';
import * as planController from '../controllers/planController';

const router = Router();

router.use(auth);

router.get('/clients', clientController.list);
router.post('/clients', clientController.create);
router.get('/clients/:id', clientController.getOne);
router.put('/clients/:id', clientController.update);
router.delete('/clients/:id', clientController.remove);

router.post('/clients/:id/payments', paymentController.record);
router.get('/clients/:id/payments', paymentController.history);
router.get('/payments/summary', paymentController.summary);

router.get('/reminders', reminderController.getRemindersHandler);
router.get('/dashboard', dashboardController.getStatsHandler);

router.post(
  '/transformations',
  uploadTransformation.fields([{ name: 'beforeImage', maxCount: 1 }, { name: 'afterImage', maxCount: 1 }]),
  transformationController.add
);
router.delete('/transformations/:id', transformationController.remove);

router.put('/about', uploadAbout.single('profileImage'), aboutController.update);

router.get('/leads', leadController.list);
router.put('/leads/:id/status', leadController.updateStatus);

// SMS
router.post('/clients/:id/send-reminder', smsController.sendClientReminder);
router.post('/sms/trigger-reminders', smsController.triggerDailyReminders);

// Plans
router.get('/plans', planController.listAll);
router.post('/plans', planController.create);
router.put('/plans/:id', planController.update);
router.delete('/plans/:id', planController.remove);

export default router;
