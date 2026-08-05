import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import compression from 'compression';
import swaggerUi from 'swagger-ui-express';

import { corsOptions } from './config/cors.js';
import swaggerSpec from './config/swagger.js';
import logger from './utils/logger.js';
import { globalLimiter, authLimiter } from './middleware/rateLimiter.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import departmentRoutes from './routes/departmentRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import leaveRoutes from './routes/leaveRoutes.js';
import holidayRoutes from './routes/holidayRoutes.js';
import noticeRoutes from './routes/noticeRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import saasAuthRoutes from './routes/saasAuthRoutes.js';
import subscriptionRoutes from './routes/subscriptionRoutes.js';
import superAdminRoutes from './routes/superAdminRoutes.js';

import subscriptionPlanRoutes from './routes/subscriptionPlanRoutes.js';
import supportTicketRoutes from './routes/supportTicketRoutes.js';

import errorHandler from './middleware/errorMiddleware.js';

const app = express();

// Security Middlewares
app.use(helmet());
app.use(mongoSanitize());
app.use(cors(corsOptions));

// Performance & Parsing Middlewares
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Logger Stream
const morganStream = {
  write: (message) => logger.info(message.trim()),
};
app.use(morgan('combined', { stream: morganStream }));

// Rate Limiting
app.use('/api', globalLimiter);
app.use('/api/auth', authLimiter);

// Swagger Documentation Route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health Check Route
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Employee Daily Reporting System API is running',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/holidays', holidayRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/saas', saasAuthRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/subscription-plans', subscriptionPlanRoutes);
app.use('/api/support', supportTicketRoutes);
app.use('/api/super-admin', superAdminRoutes);

// Global Error Handler Middleware
app.use(errorHandler);

export default app;
