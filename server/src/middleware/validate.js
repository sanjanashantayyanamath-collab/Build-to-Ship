import { AppError } from '../lib/AppError.js';

/**
 * Higher-order middleware to validate body, params, and/or query with Zod schemas.
 * Replaces req.body / req.params / req.query with parsed and coerced values.
 *
 * @param {{ body?: import('zod').ZodTypeAny, params?: import('zod').ZodTypeAny, query?: import('zod').ZodTypeAny }} schemas
 */
export function validate(schemas = {}) {
  return (req, res, next) => {
    try {
      const details = [];

      if (schemas.params) {
        const result = schemas.params.safeParse(req.params);
        if (!result.success) {
          result.error.issues.forEach((issue) => {
            details.push({
              path: issue.path.join('.') || 'param',
              message: issue.message,
            });
          });
        } else {
          req.params = result.data;
        }
      }

      if (schemas.query) {
        const result = schemas.query.safeParse(req.query);
        if (!result.success) {
          result.error.issues.forEach((issue) => {
            details.push({
              path: issue.path.join('.') || 'query',
              message: issue.message,
            });
          });
        } else {
          req.query = result.data;
        }
      }

      if (schemas.body) {
        const result = schemas.body.safeParse(req.body);
        if (!result.success) {
          result.error.issues.forEach((issue) => {
            details.push({
              path: issue.path.join('.') || 'body',
              message: issue.message,
            });
          });
        } else {
          req.body = result.data;
        }
      }

      if (details.length > 0) {
        throw new AppError('Validation failed. Please verify your inputs.', 400, 'VALIDATION_ERROR', details);
      }

      next();
    } catch (err) {
      next(err);
    }
  };
}
