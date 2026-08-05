import express from 'express';
import {
  getPublicPlans,
  getAllPlans,
  createPlan,
  updatePlan,
  deletePlan,
  duplicatePlan,
} from '../controllers/subscriptionPlanController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public endpoint for Landing Page & Company Billing Page
router.get('/public', getPublicPlans);

// Super Admin Restricted Endpoints
router.use('/admin', protect, authorize('Super Admin'));

router
  .route('/admin')
  .get(getAllPlans)
  .post(createPlan);

router
  .route('/admin/:id')
  .put(updatePlan)
  .delete(deletePlan);

router.post('/admin/:id/duplicate', duplicatePlan);

export default router;
