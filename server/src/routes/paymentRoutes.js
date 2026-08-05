import { Router } from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  createOrder,
  verifyPayment,
  getPaymentHistory,
  getInvoice,
} from '../controllers/paymentController.js';

const router = Router();

// Protect all payment routes with JWT auth
router.use(protect);

router.post('/create-order', createOrder);
router.post('/verify-payment', verifyPayment);
router.get('/history', getPaymentHistory);
router.get('/invoice/:id', getInvoice);

export default router;
