import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body } from 'express-validator';
import pool from '../config/db.js';
import { authenticate } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validate } from '../utils/validation.js';

const router = Router();

router.post('/login',
  body('email').isEmail().normalizeEmail(),
  body('password').isString().notEmpty(),
  validate,
  asyncHandler(async (req, res) => {
    const [rows] = await pool.query(
      'SELECT id, name, email, password_hash, role, manager_id, is_active FROM users WHERE email = ? LIMIT 1',
      [req.body.email]
    );
    const user = rows[0];
    if (!user || !user.is_active || !(await bcrypt.compare(req.body.password, user.password_hash))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const token = jwt.sign(
      { id: user.id, role: user.role, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
    );
    delete user.password_hash;
    res.json({ token, user });
  })
);

router.get('/me', authenticate, asyncHandler(async (req, res) => {
  const [rows] = await pool.query(
    'SELECT id, name, email, role, manager_id, is_active, created_at FROM users WHERE id = ?',
    [req.user.id]
  );
  if (!rows[0]?.is_active) return res.status(401).json({ message: 'Account is inactive' });
  res.json(rows[0]);
}));

export default router;
