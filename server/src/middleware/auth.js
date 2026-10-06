import AppError from '../lib/AppError.js';

export const authMiddleware = (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return next(new AppError({ statusCode: 401, code: 'UNAUTHORIZED', message: 'Authentication required.' }));
  }

  req.user = { id: 'demo-user', email: 'demo@example.com' };
  req.sb = { token };
  next();
};
