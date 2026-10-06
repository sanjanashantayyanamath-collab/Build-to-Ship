import { z } from 'zod';

const likelihood = z.enum(['low', 'medium', 'high']);

export const PRIMARY_CATEGORIES = [
  'crop_selection',
  'soil_conditions',
  'irrigation',
  'nutrient_management',
  'pest_concerns',
  'disease_symptoms',
  'weather_risk',
  'crop_growth_issues',
  'harvest_guidance',
  'general_crop_management',
];

export const aiAdvisorySchema = z.object({
  inScope: z.boolean(),
  primaryCategory: z.enum(PRIMARY_CATEGORIES),
  summary: z.string().min(1).max(1200),
  riskLevel: likelihood,
  riskExplanation: z.string().max(800),
  possibleCauses: z
    .array(
      z.object({
        cause: z.string().min(1).max(300),
        likelihood,
        howToCheck: z.string().max(500),
      })
    )
    .max(6),
  recommendedActions: z
    .array(
      z.object({
        priority: z.number().int().min(1).max(10),
        action: z.string().min(1).max(500),
        reason: z.string().max(500),
      })
    )
    .max(10),
  irrigationAdvice: z.string().max(1000),
  nutrientAdvice: z.string().max(1000),
  pestDiseasePossibilities: z
    .array(
      z.object({
        name: z.string().min(1).max(150),
        likelihood,
        signsToLookFor: z.string().max(500),
      })
    )
    .max(6),
  preventiveMeasures: z.array(z.string().max(400)).max(10),
  weatherConsiderations: z.string().max(800),
  followUpQuestions: z.array(z.string().max(300)).max(5),
  expertConsultationRecommended: z.boolean(),
  expertConsultationReason: z.string().max(500),
  confidence: likelihood,
  limitations: z.string().max(800),
  disclaimer: z.string().min(1).max(500),
});
