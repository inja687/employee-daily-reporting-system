const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5000',
  'https://employee-daily-reporting-system.vercel.app',
];

if (process.env.CLIENT_URL) {
  const customOrigin = process.env.CLIENT_URL.trim().replace(/\/+$/, '');
  if (!allowedOrigins.includes(customOrigin)) {
    allowedOrigins.push(customOrigin);
  }
}

export const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);

    const cleanOrigin = origin.trim().replace(/\/+$/, '');

    // Match allowed origins, Vercel deployments, or local environments
    if (
      allowedOrigins.includes(cleanOrigin) ||
      cleanOrigin.endsWith('.vercel.app') ||
      cleanOrigin.includes('localhost') ||
      cleanOrigin.includes('127.0.0.1')
    ) {
      callback(null, true);
    } else {
      // Dynamically reflect origin to prevent CORS failure on subdomains/previews
      callback(null, cleanOrigin);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Set-Cookie'],
};
