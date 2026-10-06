import { AppError } from '../lib/AppError.js';
import { logger } from '../config/logger.js';

export function errorHandler(err, req, res, next) {
  // If headers already sent, delegate to default Express handler
  if (res.headersSent) {
    return next(err);
  }

  const requestId = req.headers['x-request-id'] || undefined;
  const userId = req.user?.id || undefined;

  if (err instanceof AppError) {
    logger.warn('Operational error handled', {
      requestId,
      userId,
      path: req.originalUrl,
      method: req.method,
      code: err.code,
      message: err.message,
      statusCode: err.statusCode,
    });

    return res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        details: err.details || [],
      },
    });
  }

  // SyntaxError for invalid JSON payload
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      error: {
        code: 'INVALID_JSON',
        message: 'Malformed JSON payload in request body',
        details: [],
      },
    });
  }

  // Unhandled / Unexpected error
  logger.error('Unhandled internal server error', {
    requestId,
    userId,
    path: req.originalUrl,
    method: req.method,
    name: err.name,
    message: err.message,
    stack: err.stack,
  });

  return res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected internal server error occurred',
      details: [],
    },
  });
}
