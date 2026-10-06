import { mapProfileRow } from '../lib/mappers.js';
import { AppError } from '../lib/AppError.js';
import { logger } from '../config/logger.js';

export async function getProfile(sb, userId) {
  const { data, error } = await sb
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    logger.error('Failed to fetch profile', { error, userId });
    throw new AppError(`Database error fetching profile: ${error.message}`, 500, 'DATABASE_ERROR');
  }

  // If profile doesn't exist yet, create a default profile row
  if (!data) {
    const { data: newProfile, error: insertError } = await sb
      .from('profiles')
      .insert({ user_id: userId, name: '' })
      .select()
      .single();

    if (insertError) {
      logger.error('Failed to create default profile', { error: insertError, userId });
      throw new AppError(`Failed to initialize profile: ${insertError.message}`, 500, 'DATABASE_ERROR');
    }

    return mapProfileRow(newProfile);
  }

  return mapProfileRow(data);
}

export async function updateProfile(sb, userId, { name, defaultLocation, preferredLanguage }) {
  const updates = {};
  if (name !== undefined) updates.name = name.trim();
  if (defaultLocation !== undefined) updates.default_location = defaultLocation ? defaultLocation.trim() : null;
  if (preferredLanguage !== undefined) updates.preferred_language = preferredLanguage;

  const { data, error } = await sb
    .from('profiles')
    .update(updates)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    logger.error('Failed to update profile', { error, userId });
    throw new AppError(`Database error updating profile: ${error.message}`, 500, 'DATABASE_ERROR');
  }

  return mapProfileRow(data);
}
