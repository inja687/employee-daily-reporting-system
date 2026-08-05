import express from 'express';
import {
  register,
  login,
  logout,
  refresh,
  getMe,
  getUsers,
} from '../controllers/authController.js';
import {
  registerValidationRules,
  loginValidationRules,
  validate,
} from '../validators/authValidator.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerValidationRules, validate, register);
router.post('/login', loginValidationRules, validate, login);
router.post('/logout', protect, logout);
router.post('/refresh-token', refresh);
router.get('/me', protect, getMe);
router.get('/users', protect, authorize('Admin', 'Company Admin', 'Super Admin'), getUsers);

export default router;
