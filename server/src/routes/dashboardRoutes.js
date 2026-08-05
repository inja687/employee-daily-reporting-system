import express from 'express';
import {
  getAdminDashboard,
  getEmployeeDashboard,
} from '../controllers/dashboardController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { enforceTenantIsolation } from '../middleware/tenantMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(enforceTenantIsolation);

router.get('/admin', authorize('Super Admin', 'Admin', 'Company Admin'), getAdminDashboard);
router.get('/employee', getEmployeeDashboard);

export default router;
