import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import pool, { ensureDatabase } from '../config/db.js';

dotenv.config();

const email = process.env.ADMIN_EMAIL || 'admin@example.com';
const password = process.env.ADMIN_PASSWORD || 'Admin@123';
const name = process.env.ADMIN_NAME || 'System Administrator';
await ensureDatabase();
const hash = await bcrypt.hash(password, 12);

await pool.query(
  `INSERT INTO users (name, email, password_hash, role)
   VALUES (?, ?, ?, 'admin')
   ON DUPLICATE KEY UPDATE name = VALUES(name), password_hash = VALUES(password_hash), is_active = 1`,
  [name, email, hash]
);
console.log(`Admin user ready: ${email}`);
await pool.end();
