import AppError from '../lib/AppError.js';

export const validate = ({ body, params, query }) => (req, res, next) => {
  try {
    if (body) {
      const parsed = body.parse(req.body ?? {});
      req.body = parsed;
    }
    if (params) {
      const parsed = params.parse(req.params ?? {});
      req.params = parsed;
    }
    if (query) {
      const parsed = query.parse(req.query ?? {});
      req.query = parsed;
    }
    next();
  } catch (error) {
    const details = [];
    if (error?.issues) {
      for (const issue of error.issues) {
        details.push({
          path: issue.path.join('.') || 'root',
          message: issue.message,
        });
      }
    }
    next(new AppError({ statusCode: 400, code: 'VALIDATION_ERROR', message: 'Invalid request', details }));
  }
};
