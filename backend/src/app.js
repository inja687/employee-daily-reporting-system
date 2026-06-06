import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import authRoutes from './routes/auth.routes.js';
import reportRoutes from './routes/report.routes.js';
import adminRoutes from './routes/admin.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import { errorHandler, notFound } from './middleware/errors.js';
import { getDatabaseStatus } from './config/db.js';

const app = express();
const configuredOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const isAllowedOrigin = (origin) => {
  if (!origin || configuredOrigins.includes(origin)) return true;
  if (process.env.NODE_ENV === 'production') return false;

  try {
    const url = new URL(origin);
    return ['localhost', '127.0.0.1', '::1'].includes(url.hostname);
  } catch {
    return false;
  }
};

app.use(helmet());
app.use(cors({
  origin(origin, callback) {
    const allowed = isAllowedOrigin(origin);
    callback(allowed ? null : new Error(`Origin ${origin} is not allowed by CORS`), allowed);
  },
}));
app.use(express.json({ limit: '1mb' }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

app.get('/', (req, res) => res.json({ name: 'Employee Reporting API', status: 'ok' }));
app.get('/api/health', (req, res) => {
  const database = getDatabaseStatus();
  res.status(database.ready ? 200 : 503).json({
    status: database.ready ? 'ok' : 'starting',
    database: { ready: database.ready, name: database.database },
  });
});
app.use('/api', (req, res, next) => {
  if (getDatabaseStatus().ready) return next();
  return res.status(503).json({ message: 'Database is starting. Please retry shortly.' });
});
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use(notFound);
app.use(errorHandler);

export default app;
