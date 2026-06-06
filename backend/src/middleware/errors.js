export function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

export function errorHandler(err, req, res, next) {
  console.error(err);
  if (res.headersSent) return next(err);
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({ message: 'A record with that value already exists' });
  }
  if (['ECONNREFUSED', 'PROTOCOL_CONNECTION_LOST', 'ER_BAD_DB_ERROR'].includes(err.code)) {
    return res.status(503).json({ message: 'Database service is unavailable' });
  }
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}
