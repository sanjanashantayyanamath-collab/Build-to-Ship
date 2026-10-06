import AppError from '../lib/AppError.js';

export const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err?.statusCode || err?.status || 500;
  const code = err?.code || 'INTERNAL_ERROR';
  const message = err?.message || 'Unexpected server error';

  if (process.env.NODE_ENV !== 'test') {
    console.error('Unhandled error:', { code, statusCode, message, path: req.originalUrl });
  }

  const payload = {
    error: {
      code,
      message,
      ...(err?.details?.length ? { details: err.details } : {}),
    },
  };

  res.status(statusCode).json(payload);
};
