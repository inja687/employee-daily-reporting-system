import { Router } from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import {
  getDashboard,
  getAnalytics,
  getCompanies,
  updateCompanyStatus,
  extendTrial,
  resetAdminPassword,
  manualActivation,
  sendBroadcast,
  getAuditLogs,
} from '../controllers/superAdminController.js';

const router = Router();

// Protect and Restrict all routes to Super Admin role
router.use(protect);
router.use(authorize('Super Admin'));

router.get('/dashboard', getDashboard);
router.get('/analytics', getAnalytics);
router.get('/companies', getCompanies);
router.patch('/companies/:id/status', updateCompanyStatus);
router.patch('/companies/:id/extend-trial', extendTrial);
router.post('/companies/:id/reset-password', resetAdminPassword);
router.post('/companies/:id/manual-activate', manualActivation);
router.post('/broadcast', sendBroadcast);
router.get('/audit-logs', getAuditLogs);

export default router;
