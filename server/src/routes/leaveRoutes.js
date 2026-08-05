import express from 'express';
import {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  approveLeave,
  rejectLeave,
  cancelLeave,
} from '../controllers/leaveController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { enforceTenantIsolation } from '../middleware/tenantMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(enforceTenantIsolation);

router
  .route('/')
  .post(applyLeave)
  .get(authorize('Super Admin', 'Company Admin', 'Admin'), getAllLeaves);

router.get('/my', getMyLeaves);
router.patch('/:id/cancel', cancelLeave);
router.patch('/:id/approve', authorize('Super Admin', 'Company Admin', 'Admin'), approveLeave);
router.patch('/:id/reject', authorize('Super Admin', 'Company Admin', 'Admin'), rejectLeave);

export default router;
