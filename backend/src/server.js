import dotenv from 'dotenv';
dotenv.config();

if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET is required. Copy .env.example to .env and configure it.');
  process.exit(1);
}

const { default: app } = await import('./app.js');
const { default: pool, ensureDatabase } = await import('./config/db.js');
const port = Number(process.env.PORT || 5000);
const host = process.env.HOST || '0.0.0.0';
let shuttingDown = false;

async function connectDatabase() {
  while (!shuttingDown) {
    try {
      await ensureDatabase();
      console.log(`MySQL ready: ${process.env.DB_NAME || 'employee_reporting_system'}`);
      return;
    } catch (error) {
      console.error(`MySQL unavailable (${error.message}). Retrying in 3 seconds...`);
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }
}

const server = app.listen(port, host, () => {
  console.log(`API running at http://localhost:${port}`);
});

connectDatabase();

async function shutdown() {
  shuttingDown = true;
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
