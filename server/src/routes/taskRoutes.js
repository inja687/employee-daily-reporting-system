import express from 'express';
import {
  createTask,
  getMyTasks,
  getAllTasks,
  getTaskById,
  updateTaskStatus,
  updateTask,
  deleteTask,
} from '../controllers/taskController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { enforceTenantIsolation } from '../middleware/tenantMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(enforceTenantIsolation);

router
  .route('/')
  .post(authorize('Super Admin', 'Company Admin', 'Admin'), createTask)
  .get(authorize('Super Admin', 'Company Admin', 'Admin'), getAllTasks);

router.get('/my', getMyTasks);
router.patch('/:id/status', updateTaskStatus);

router
  .route('/:id')
  .get(getTaskById)
  .put(authorize('Super Admin', 'Company Admin', 'Admin'), updateTask)
  .delete(authorize('Super Admin', 'Company Admin', 'Admin'), deleteTask);

export default router;
