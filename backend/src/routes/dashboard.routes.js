import { Router } from 'express';
import pool from '../config/db.js';
import { authenticate } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();
router.use(authenticate);

router.get('/', asyncHandler(async (req, res) => {
  if (req.user.role === 'admin') {
    const [[users], [reports]] = await Promise.all([
      pool.query(`SELECT
        SUM(role = 'employee') employees, SUM(role = 'manager') managers,
        SUM(role != 'admin' AND is_active = 1) active_users FROM users`),
      pool.query(`SELECT COUNT(*) total_reports, SUM(status = 'pending') pending_reports FROM reports`),
    ]);
    return res.json({ ...users[0], ...reports[0] });
  }
  if (req.user.role === 'manager') {
    const [[team], [reports]] = await Promise.all([
      pool.query("SELECT COUNT(*) team_size FROM users WHERE manager_id = ? AND is_active = 1", [req.user.id]),
      pool.query(`SELECT COUNT(*) total_reports, SUM(r.status = 'pending') pending_reports,
        SUM(r.status = 'approved') approved_reports, SUM(r.status = 'rejected') rejected_reports
        FROM reports r JOIN users u ON u.id = r.employee_id WHERE u.manager_id = ?`, [req.user.id]),
    ]);
    return res.json({ ...team[0], ...reports[0] });
  }
  const [rows] = await pool.query(`SELECT COUNT(*) total_reports,
    SUM(status = 'pending') pending_reports, SUM(status = 'approved') approved_reports,
    SUM(status = 'rejected') rejected_reports FROM reports WHERE employee_id = ?`, [req.user.id]);
  res.json(rows[0]);
}));

export default router;
