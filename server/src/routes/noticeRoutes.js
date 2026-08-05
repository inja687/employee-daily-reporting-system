import express from 'express';
import {
  createNotice,
  getNotices,
  getNoticeById,
  updateNotice,
  deleteNotice,
} from '../controllers/noticeController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .post(authorize('Super Admin', 'Admin'), createNotice)
  .get(getNotices);

router
  .route('/:id')
  .get(getNoticeById)
  .put(authorize('Super Admin', 'Admin'), updateNotice)
  .delete(authorize('Super Admin', 'Admin'), deleteNotice);

export default router;
