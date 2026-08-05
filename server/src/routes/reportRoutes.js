import express from 'express';
import {
  createReport,
  getMyReports,
  getAllReports,
  getReportById,
  updateReport,
  submitReport,
  deleteReport,
} from '../controllers/reportController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { enforceTenantIsolation } from '../middleware/tenantMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(enforceTenantIsolation);

router
  .route('/')
  .post(createReport)
  .get(authorize('Super Admin', 'Company Admin', 'Admin'), getAllReports);

router.get('/my', getMyReports);
router.patch('/:id/submit', submitReport);

router
  .route('/:id')
  .get(getReportById)
  .put(updateReport)
  .delete(deleteReport);

export default router;
