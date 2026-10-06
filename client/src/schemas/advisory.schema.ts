import { z } from 'zod';

export const CROP_LIST = [
  'Tomato',
  'Rice',
  'Wheat',
  'Maize',
  'Ragi (Finger Millet)',
  'Sugarcane',
  'Cotton',
  'Groundnut',
  'Chilli',
  'Onion',
  'Potato',
  'Banana',
  'Coconut',
  'Arecanut',
  'Coffee',
  'Other',
] as const;

export const SOIL_TYPES = [
  'Red',
  'Black',
  'Alluvial',
  'Laterite',
  'Sandy',
  'Loamy',
  'Clay',
  'Not sure',
] as const;

export const SEASONS = [
  'Kharif',
  'Rabi',
  'Zaid',
  'Perennial / Year-round',
] as const;

export const GROWTH_STAGES = [
  'Not planted yet',
  'Germination',
  'Vegetative',
  'Flowering',
  'Fruiting',
  'Maturity / Harvest',
] as const;

export const IRRIGATION_TYPES = [
  'Available',
  'Limited',
  'Rain-fed only',
] as const;

export const IRRIGATION_METHODS = [
  'Drip',
  'Sprinkler',
  'Flood',
  'Furrow',
  'Manual',
  'Other',
] as const;

export const LANGUAGES = ['English', 'Kannada', 'Hindi'] as const;

export const advisoryCreateSchema = z
  .object({
    crop: z.enum(CROP_LIST, {
      errorMap: () => ({ message: 'Please select a valid crop from the list' }),
    }),
    cropOther: z.string().trim().min(2, 'Must be at least 2 characters').max(60, 'Must not exceed 60 characters').optional(),
    location: z.string().trim().min(2, 'Location must be at least 2 characters').max(100, 'Location cannot exceed 100 characters'),
    soilType: z.enum(SOIL_TYPES, {
      errorMap: () => ({ message: 'Please select a soil type' }),
    }),
    season: z.enum(SEASONS, {
      errorMap: () => ({ message: 'Please select a season' }),
    }),
    growthStage: z.enum(GROWTH_STAGES).optional(),
    irrigation: z.enum(IRRIGATION_TYPES, {
      errorMap: () => ({ message: 'Please select irrigation availability' }),
    }),
    irrigationMethod: z.enum(IRRIGATION_METHODS).optional(),
    temperatureC: z
      .union([z.coerce.number().min(-5, 'Temperature must be >= -5°C').max(55, 'Temperature must be <= 55°C'), z.nan()])
      .optional()
      .transform((val) => (val === undefined || Number.isNaN(val) ? undefined : val)),
    rainfallMm: z
      .union([z.coerce.number().min(0, 'Rainfall must be >= 0 mm').max(3000, 'Rainfall must be <= 3000 mm'), z.nan()])
      .optional()
      .transform((val) => (val === undefined || Number.isNaN(val) ? undefined : val)),
    farmSizeAcres: z
      .union([z.coerce.number().min(0.01, 'Farm size must be >= 0.01 acres').max(10000, 'Farm size cannot exceed 10000 acres'), z.nan()])
      .optional()
      .transform((val) => (val === undefined || Number.isNaN(val) ? undefined : val)),
    problem: z
      .string()
      .trim()
      .min(10, 'Problem description must contain at least 10 characters')
      .max(1000, 'Problem description cannot exceed 1000 characters'),
    language: z.enum(LANGUAGES).default('English'),
  })
  .superRefine((v, ctx) => {
    if (v.crop === 'Other' && (!v.cropOther || v.cropOther.trim().length === 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['cropOther'],
        message: 'Please specify the crop',
      });
    }
    if (v.irrigation !== 'Rain-fed only' && !v.irrigationMethod) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['irrigationMethod'],
        message: 'Select an irrigation method',
      });
    }
  });

export type AdvisoryFormData = z.infer<typeof advisoryCreateSchema>;
