import express from 'express';
import {
  createDepartment,
  getDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
} from '../controllers/departmentController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { enforceTenantIsolation } from '../middleware/tenantMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(enforceTenantIsolation);

router
  .route('/')
  .post(authorize('Super Admin', 'Company Admin', 'Admin'), createDepartment)
  .get(getDepartments);

router
  .route('/:id')
  .get(getDepartmentById)
  .put(authorize('Super Admin', 'Company Admin', 'Admin'), updateDepartment)
  .delete(authorize('Super Admin', 'Company Admin', 'Admin'), deleteDepartment);

export default router;
