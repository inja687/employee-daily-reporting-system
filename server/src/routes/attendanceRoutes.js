import express from 'express';
import {
  checkIn,
  checkOut,
  getMyAttendance,
  getAllAttendance,
} from '../controllers/attendanceController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { enforceTenantIsolation } from '../middleware/tenantMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(enforceTenantIsolation);

router.post('/check-in', checkIn);
router.post('/check-out', checkOut);
router.get('/my', getMyAttendance);
router.get('/all', authorize('Super Admin', 'Company Admin', 'Admin'), getAllAttendance);

export default router;
