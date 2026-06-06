import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { body, param } from 'express-validator';
import pool from '../config/db.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validate } from '../utils/validation.js';

const router = Router();
router.use(authenticate, authorize('admin'));

router.get('/users', asyncHandler(async (req, res) => {
  const role = req.query.role;
  const values = [];
  let where = '';
  if (role) { where = 'WHERE u.role = ?'; values.push(role); }
  const [rows] = await pool.query(
    `SELECT u.id, u.name, u.email, u.role, u.manager_id, u.is_active, u.created_at,
      m.name manager_name FROM users u LEFT JOIN users m ON m.id = u.manager_id
      ${where} ORDER BY u.name`, values
  );
  res.json(rows);
}));

router.post('/users',
  body('name').trim().isLength({ min: 2, max: 100 }),
  body('email').isEmail().normalizeEmail(),
  body('password').isStrongPassword({ minLength: 8, minUppercase: 1, minNumbers: 1 }),
  body('role').isIn(['manager', 'employee']),
  body('manager_id').optional({ nullable: true }).isInt({ min: 1 }),
  validate,
  asyncHandler(async (req, res) => {
    const { name, email, password, role, manager_id } = req.body;
    if (role === 'employee' && manager_id) {
      const [managers] = await pool.query("SELECT id FROM users WHERE id = ? AND role = 'manager' AND is_active = 1", [manager_id]);
      if (!managers.length) return res.status(422).json({ message: 'Selected manager is invalid' });
    }
    const hash = await bcrypt.hash(password, 12);
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password_hash, role, manager_id) VALUES (?, ?, ?, ?, ?)',
      [name, email, hash, role, role === 'employee' ? manager_id || null : null]
    );
    const [rows] = await pool.query('SELECT id, name, email, role, manager_id, is_active, created_at FROM users WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  })
);

router.patch('/users/:id',
  param('id').isInt({ min: 1 }),
  body('name').optional().trim().isLength({ min: 2, max: 100 }),
  body('email').optional().isEmail().normalizeEmail(),
  body('is_active').optional().isBoolean(),
  validate,
  asyncHandler(async (req, res) => {
    const allowed = ['name', 'email', 'is_active'];
    const entries = Object.entries(req.body).filter(([key]) => allowed.includes(key));
    if (!entries.length) return res.status(422).json({ message: 'No valid fields supplied' });
    const [result] = await pool.query(
      `UPDATE users SET ${entries.map(([key]) => `${key} = ?`).join(', ')} WHERE id = ? AND role != 'admin'`,
      [...entries.map(([, value]) => value), req.params.id]
    );
    if (!result.affectedRows) return res.status(404).json({ message: 'User not found' });
    const [rows] = await pool.query('SELECT id, name, email, role, manager_id, is_active, created_at FROM users WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
  })
);

router.patch('/employees/:id/manager',
  param('id').isInt({ min: 1 }),
  body('manager_id').optional({ nullable: true }).isInt({ min: 1 }),
  validate,
  asyncHandler(async (req, res) => {
    if (req.body.manager_id) {
      const [managers] = await pool.query("SELECT id FROM users WHERE id = ? AND role = 'manager' AND is_active = 1", [req.body.manager_id]);
      if (!managers.length) return res.status(422).json({ message: 'Selected manager is invalid' });
    }
    const [result] = await pool.query(
      "UPDATE users SET manager_id = ? WHERE id = ? AND role = 'employee'",
      [req.body.manager_id || null, req.params.id]
    );
    if (!result.affectedRows) return res.status(404).json({ message: 'Employee not found' });
    res.json({ message: 'Manager assignment updated' });
  })
);

router.delete('/users/:id', param('id').isInt({ min: 1 }), validate, asyncHandler(async (req, res) => {
  const [result] = await pool.query("DELETE FROM users WHERE id = ? AND role != 'admin'", [req.params.id]);
  if (!result.affectedRows) return res.status(404).json({ message: 'User not found' });
  res.status(204).end();
}));

export default router;
