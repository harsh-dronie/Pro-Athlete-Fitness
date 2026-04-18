import { Router } from 'express';
import * as transformationController from '../controllers/transformationController';
import * as aboutController from '../controllers/aboutController';
import * as leadController from '../controllers/leadController';
import * as planController from '../controllers/planController';
import * as heroController from '../controllers/heroController';

const router = Router();

router.get('/transformations', transformationController.list);
router.get('/about', aboutController.get);
router.post('/leads', leadController.create);
router.get('/plans', planController.list);
router.get('/hero', heroController.get);

export default router;
