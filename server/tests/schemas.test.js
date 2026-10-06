import { describe, it, expect } from 'vitest';
import { advisoryCreateSchema } from '../src/schemas/advisory.schema.js';
import { aiAdvisorySchema } from '../src/schemas/aiAdvisory.schema.js';

describe('Zod Validation Schemas', () => {
  describe('advisoryCreateSchema', () => {
    it('validates a correct crop advisory payload', () => {
      const validPayload = {
        crop: 'Tomato',
        location: 'Mysuru, Karnataka',
        soilType: 'Red',
        season: 'Kharif',
        growthStage: 'Flowering',
        irrigation: 'Available',
        irrigationMethod: 'Drip',
        temperatureC: 28.5,
        rainfallMm: 120.0,
        farmSizeAcres: 2.5,
        problem: 'Yellowing leaves with dark brown spots on lower canopy after light rain.',
        language: 'English',
      };

      const result = advisoryCreateSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
    });

    it('fails when problem is too short (< 10 chars)', () => {
      const invalidPayload = {
        crop: 'Tomato',
        location: 'Mysuru',
        soilType: 'Red',
        season: 'Kharif',
        irrigation: 'Available',
        irrigationMethod: 'Drip',
        problem: 'Help',
      };

      const result = advisoryCreateSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
    });

    it('requires cropOther when crop is Other', () => {
      const payloadWithoutOther = {
        crop: 'Other',
        location: 'Mysuru',
        soilType: 'Red',
        season: 'Kharif',
        irrigation: 'Rain-fed only',
        problem: 'Symptom description for custom crop',
      };

      const result = advisoryCreateSchema.safeParse(payloadWithoutOther);
      expect(result.success).toBe(false);
    });
  });

  describe('aiAdvisorySchema', () => {
    it('validates a complete AI advisory JSON response', () => {
      const validAiOutput = {
        inScope: true,
        primaryCategory: 'disease_symptoms',
        summary: 'Early blight symptom patterns observed on tomato leaves following humid conditions.',
        riskLevel: 'medium',
        riskExplanation: 'Early blight can spread quickly across canopy during high humidity.',
        possibleCauses: [
          { cause: 'Alternaria solani (Early Blight)', likelihood: 'high', howToCheck: 'Check lower leaves for concentric rings.' }
        ],
        recommendedActions: [
          { priority: 1, action: 'Prune infected lower foliage and dispose away from field', reason: 'Reduces spore load' }
        ],
        irrigationAdvice: 'Avoid overhead irrigation; use drip irrigation to keep leaf canopy dry.',
        nutrientAdvice: 'Ensure balanced Potassium and Nitrogen application.',
        pestDiseasePossibilities: [
          { name: 'Early Blight', likelihood: 'high', signsToLookFor: 'Target-board pattern ring spots' }
        ],
        preventiveMeasures: ['Remove affected lower leaves', 'Maintain proper plant spacing'],
        weatherConsiderations: 'Warm temperatures with frequent leaf wetness favor fungal spread.',
        followUpQuestions: ['Are spots spreading to upper foliage?'],
        expertConsultationRecommended: true,
        expertConsultationReason: 'Consult local KVK if more than 25% canopy shows lesions.',
        confidence: 'medium',
        limitations: 'Visual inspection by an extension worker recommended.',
        disclaimer: 'This AI-generated advice is informational and does not replace guidance from a qualified agricultural expert.',
      };

      const result = aiAdvisorySchema.safeParse(validAiOutput);
      expect(result.success).toBe(true);
    });
  });
});
