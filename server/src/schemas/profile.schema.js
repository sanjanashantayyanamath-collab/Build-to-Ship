import { z } from 'zod';
import { LANGUAGES } from './advisory.schema.js';

export const profileUpdateSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100, 'Name cannot exceed 100 characters'),
  defaultLocation: z.string().trim().max(100, 'Location cannot exceed 100 characters').nullable().optional(),
  preferredLanguage: z.enum(LANGUAGES).default('English'),
});
