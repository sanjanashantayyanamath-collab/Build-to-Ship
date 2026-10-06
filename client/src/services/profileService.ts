import { apiRequest } from './apiClient';
import type { Profile } from '../types';

export async function getProfile(): Promise<Profile> {
  return apiRequest<Profile>('/api/profile');
}

export async function updateProfile(data: {
  name: string;
  defaultLocation?: string | null;
  preferredLanguage: string;
}): Promise<Profile> {
  return apiRequest<Profile>('/api/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}
