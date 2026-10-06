import { AppError } from '../lib/AppError.js';

export function notFound(req, res, next) {
  next(new AppError(`Endpoint not found: ${req.method} ${req.originalUrl}`, 404, 'NOT_FOUND'));
}
