import { Router } from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { enforceTenantIsolation } from '../middleware/tenantMiddleware.js';
import {
  getPlans,
  getSubscriptionStatus,
  createOrder,
  verifyPayment,
  cancelSubscription,
  getBillingHistory,
  downloadInvoice,
} from '../controllers/subscriptionController.js';

const router = Router();

// Public / Unauthenticated endpoint for landing page pricing
router.get('/plans', getPlans);

// Protected endpoints for authenticated users
router.use(protect);
router.use(enforceTenantIsolation);

router.get('/status', getSubscriptionStatus);
router.post('/create-order', createOrder);
router.post('/verify-payment', verifyPayment);
router.post('/cancel', cancelSubscription);
router.get('/history', getBillingHistory);
router.get('/invoice/:id', downloadInvoice);

export default router;
