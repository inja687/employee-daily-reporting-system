import { Router } from 'express';
import { body, param } from 'express-validator';
import pool from '../config/db.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validate } from '../utils/validation.js';

const router = Router();
router.use(authenticate);

const reportSelect = `
  SELECT r.id, r.employee_id, u.name employee_name, u.email employee_email,
    r.report_date, r.tasks_completed, r.hours_worked, r.blockers, r.next_day_plan,
    r.status, r.reviewed_at, r.created_at, r.updated_at,
    reviewer.name reviewer_name
  FROM reports r
  JOIN users u ON u.id = r.employee_id
  LEFT JOIN users reviewer ON reviewer.id = r.reviewed_by`;

router.post('/', authorize('employee'),
  body('report_date').isISO8601().toDate(),
  body('tasks_completed').trim().isLength({ min: 5, max: 5000 }),
  body('hours_worked').isFloat({ min: 0, max: 24 }),
  body('blockers').optional({ nullable: true }).trim().isLength({ max: 2000 }),
  body('next_day_plan').optional({ nullable: true }).trim().isLength({ max: 2000 }),
  validate,
  asyncHandler(async (req, res) => {
    const { report_date, tasks_completed, hours_worked, blockers, next_day_plan } = req.body;
    const [result] = await pool.query(
      `INSERT INTO reports (employee_id, report_date, tasks_completed, hours_worked, blockers, next_day_plan)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [req.user.id, new Date(report_date).toISOString().slice(0, 10), tasks_completed, hours_worked, blockers || null, next_day_plan || null]
    );
    const [rows] = await pool.query(`${reportSelect} WHERE r.id = ?`, [result.insertId]);
    res.status(201).json(rows[0]);
  })
);

router.get('/mine', authorize('employee'), asyncHandler(async (req, res) => {
  const [rows] = await pool.query(`${reportSelect} WHERE r.employee_id = ? ORDER BY r.report_date DESC`, [req.user.id]);
  res.json(rows);
}));

router.get('/team', authorize('manager'), asyncHandler(async (req, res) => {
  const { status, employeeId, from, to } = req.query;
  const conditions = ['u.manager_id = ?'];
  const values = [req.user.id];
  if (status) { conditions.push('r.status = ?'); values.push(status); }
  if (employeeId) { conditions.push('r.employee_id = ?'); values.push(employeeId); }
  if (from) { conditions.push('r.report_date >= ?'); values.push(from); }
  if (to) { conditions.push('r.report_date <= ?'); values.push(to); }
  const [rows] = await pool.query(`${reportSelect} WHERE ${conditions.join(' AND ')} ORDER BY r.report_date DESC`, values);
  res.json(rows);
}));

router.patch('/:id/status', authorize('manager'),
  param('id').isInt({ min: 1 }),
  body('status').isIn(['approved', 'rejected']),
  validate,
  asyncHandler(async (req, res) => {
    const [result] = await pool.query(
      `UPDATE reports r JOIN users u ON u.id = r.employee_id
       SET r.status = ?, r.reviewed_by = ?, r.reviewed_at = CURRENT_TIMESTAMP
       WHERE r.id = ? AND u.manager_id = ?`,
      [req.body.status, req.user.id, req.params.id, req.user.id]
    );
    if (!result.affectedRows) return res.status(404).json({ message: 'Team report not found' });
    const [rows] = await pool.query(`${reportSelect} WHERE r.id = ?`, [req.params.id]);
    res.json(rows[0]);
  })
);

router.get('/:id/comments', param('id').isInt({ min: 1 }), validate, asyncHandler(async (req, res) => {
  const [access] = await pool.query(
    `SELECT r.id FROM reports r JOIN users employee ON employee.id = r.employee_id
     WHERE r.id = ? AND (r.employee_id = ? OR employee.manager_id = ? OR ? = 'admin')`,
    [req.params.id, req.user.id, req.user.id, req.user.role]
  );
  if (!access.length) return res.status(404).json({ message: 'Report not found' });
  const [rows] = await pool.query(
    `SELECT c.id, c.comment, c.created_at, u.id author_id, u.name author_name, u.role author_role
     FROM report_comments c JOIN users u ON u.id = c.author_id
     WHERE c.report_id = ? ORDER BY c.created_at ASC`, [req.params.id]
  );
  res.json(rows);
}));

router.post('/:id/comments', authorize('manager'),
  param('id').isInt({ min: 1 }),
  body('comment').trim().isLength({ min: 1, max: 2000 }),
  validate,
  asyncHandler(async (req, res) => {
    const [reports] = await pool.query(
      `SELECT r.id FROM reports r JOIN users u ON u.id = r.employee_id
       WHERE r.id = ? AND u.manager_id = ?`, [req.params.id, req.user.id]
    );
    if (!reports.length) return res.status(404).json({ message: 'Team report not found' });
    const [result] = await pool.query(
      'INSERT INTO report_comments (report_id, author_id, comment) VALUES (?, ?, ?)',
      [req.params.id, req.user.id, req.body.comment]
    );
    const [rows] = await pool.query(
      `SELECT c.id, c.comment, c.created_at, u.id author_id, u.name author_name, u.role author_role
       FROM report_comments c JOIN users u ON u.id = c.author_id WHERE c.id = ?`, [result.insertId]
    );
    res.status(201).json(rows[0]);
  })
);

export default router;
