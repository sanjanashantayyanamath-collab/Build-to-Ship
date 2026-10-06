import { createClient } from '@supabase/supabase-js';
import { env } from '../config/env.js';

// Base anon client (used for auth verification: getUser)
export const supabaseAnonClient = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

/**
 * Creates a scoped Supabase client authenticated as the calling user.
 * Database Row Level Security (RLS) is automatically enforced using the caller's JWT.
 *
 * @param {string} token - The caller's Supabase JWT access token
 * @returns {import('@supabase/supabase-js').SupabaseClient}
 */
export function createUserClient(token) {
  return createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });
}
