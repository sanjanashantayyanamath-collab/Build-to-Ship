import { supabaseAnonClient, createUserClient } from '../lib/supabase.js';
import { AppError } from '../lib/AppError.js';

export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Authentication required. Missing Bearer token.', 401, 'UNAUTHORIZED');
    }

    const token = authHeader.split(' ')[1]?.trim();
    if (!token) {
      throw new AppError('Authentication required. Invalid Bearer token format.', 401, 'UNAUTHORIZED');
    }

    const { data: { user }, error } = await supabaseAnonClient.auth.getUser(token);

    if (error || !user) {
      throw new AppError('Session expired or invalid authentication token.', 401, 'UNAUTHORIZED');
    }

    req.user = user;
    req.token = token;
    req.sb = createUserClient(token);

    next();
  } catch (err) {
    next(err);
  }
}
