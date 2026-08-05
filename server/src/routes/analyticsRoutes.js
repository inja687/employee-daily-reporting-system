import express from 'express';
import {
  getMonthlyReportsAnalytics,
  getWeeklyReportsAnalytics,
  getProductivityGraphData,
  getAttendanceTrends,
} from '../controllers/analyticsController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { enforceTenantIsolation } from '../middleware/tenantMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(enforceTenantIsolation);
router.use(authorize('Super Admin', 'Company Admin', 'Admin'));

router.get('/monthly-reports', getMonthlyReportsAnalytics);
router.get('/weekly-reports', getWeeklyReportsAnalytics);
router.get('/productivity', getProductivityGraphData);
router.get('/attendance-trends', getAttendanceTrends);

export default router;
