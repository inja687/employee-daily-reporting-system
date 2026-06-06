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

/*
|--------------------------------------------------------------------------
| Security & Middleware
|--------------------------------------------------------------------------
*/

app.use(helmet());

app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'https://employee-daily-reporting-system.vercel.app',
      'https://employee-daily-reporting-system-hwdgwuu58-inja687s-projects.vercel.app',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '1mb' }));

app.use(
  morgan(
    process.env.NODE_ENV === 'production'
      ? 'combined'
      : 'dev'
  )
);

/*
|--------------------------------------------------------------------------
| Root Routes
|--------------------------------------------------------------------------
*/

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Employee Daily Reporting API',
  });
});

app.get('/api/health', (req, res) => {
  const database = getDatabaseStatus();

  res.status(database.ready ? 200 : 503).json({
    status: database.ready ? 'ok' : 'starting',
    database: {
      ready: database.ready,
      name: database.database,
    },
  });
});

/*
|--------------------------------------------------------------------------
| Database Readiness Check
|--------------------------------------------------------------------------
*/

app.use('/api', (req, res, next) => {
  const database = getDatabaseStatus();

  if (database.ready) {
    return next();
  }

  return res.status(503).json({
    message: 'Database is starting. Please retry shortly.',
  });
});

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/dashboard', dashboardRoutes);

/*
|--------------------------------------------------------------------------
| Error Handlers
|--------------------------------------------------------------------------
*/

app.use(notFound);
app.use(errorHandler);

export default app;