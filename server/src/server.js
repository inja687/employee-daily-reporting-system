import 'dotenv/config';
import app from './app.js';
import connectDB from './database/db.js';

import { seedDefaultPlans } from './services/subscriptionPlanService.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    if (process.env.MONGODB_URI) {
      await connectDB();
      await seedDefaultPlans();
    } else {
      console.log('MONGODB_URI not provided. Skipping database connection placeholder.');
    }

    const server = app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use by another running server instance.`);
      } else {
        console.error('Server startup error:', err);
      }
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

