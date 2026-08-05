import express from 'express';
import {
  createHoliday,
  getHolidays,
  getHolidayById,
  updateHoliday,
  deleteHoliday,
} from '../controllers/holidayController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .post(authorize('Super Admin', 'Admin'), createHoliday)
  .get(getHolidays);

router
  .route('/:id')
  .get(getHolidayById)
  .put(authorize('Super Admin', 'Admin'), updateHoliday)
  .delete(authorize('Super Admin', 'Admin'), deleteHoliday);

export default router;
