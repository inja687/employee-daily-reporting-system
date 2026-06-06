import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { readFile } from 'node:fs/promises';

dotenv.config();

const database = process.env.DB_NAME || 'employee_reporting_system';

if (!/^[a-zA-Z0-9_]+$/.test(database)) {
  throw new Error('DB_NAME may only contain letters, numbers, and underscores');
}

const connectionOptions = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  connectTimeout: 10000,
};

const pool = mysql.createPool({
  ...connectionOptions,
  database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  dateStrings: true,
});

let ready = false;
let lastError = null;

export async function ensureDatabase() {
  const connection = await mysql.createConnection({ ...connectionOptions, multipleStatements: true });
  try {
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS ${mysql.escapeId(database)} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
    await connection.changeUser({ database });
    const schemaUrl = new URL('../../database/schema.sql', import.meta.url);
    const schema = (await readFile(schemaUrl, 'utf8'))
      .replace(/CREATE DATABASE IF NOT EXISTS[\s\S]*?;/i, '')
      .replace(/USE\s+[^;]+;/i, '');
    await connection.query(schema);
    ready = true;
    lastError = null;
  } catch (error) {
    ready = false;
    lastError = error;
    throw error;
  } finally {
    await connection.end();
  }
}

export function getDatabaseStatus() {
  return { ready, error: lastError?.message || null, database };
}

export default pool;
