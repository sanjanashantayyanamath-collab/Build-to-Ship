import { Type } from '@google/genai';
import { PRIMARY_CATEGORIES } from '../schemas/aiAdvisory.schema.js';

export const advisoryResponseSchema = {
  type: Type.OBJECT,
  properties: {
    inScope: {
      type: Type.BOOLEAN,
      description: 'True if request is related to crops, soil, pests, irrigation, or harvest; false otherwise.',
    },
    primaryCategory: {
      type: Type.STRING,
      enum: PRIMARY_CATEGORIES,
      description: 'Primary category classification for this advisory.',
    },
    summary: {
      type: Type.STRING,
      description: 'Concise summary of findings and immediate context for the farmer.',
    },
    riskLevel: {
      type: Type.STRING,
      enum: ['low', 'medium', 'high'],
      description: 'Overall threat level to crop health, yield, or survival.',
    },
    riskExplanation: {
      type: Type.STRING,
      description: 'Clear reasoning explaining why this risk level was assigned.',
    },
    possibleCauses: {
      type: Type.ARRAY,
      description: 'Up to 6 plausible causes ranked by likelihood.',
      items: {
        type: Type.OBJECT,
        properties: {
          cause: { type: Type.STRING },
          likelihood: { type: Type.STRING, enum: ['low', 'medium', 'high'] },
          howToCheck: { type: Type.STRING },
        },
        required: ['cause', 'likelihood', 'howToCheck'],
      },
    },
    recommendedActions: {
      type: Type.ARRAY,
      description: 'Prioritized, actionable steps (1 is highest priority). Low-risk cultural practices first.',
      items: {
        type: Type.OBJECT,
        properties: {
          priority: { type: Type.INTEGER },
          action: { type: Type.STRING },
          reason: { type: Type.STRING },
        },
        required: ['priority', 'action', 'reason'],
      },
    },
    irrigationAdvice: {
      type: Type.STRING,
      description: 'Specific water scheduling, drainage, or moisture management guidance.',
    },
    nutrientAdvice: {
      type: Type.STRING,
      description: 'General soil fertility and organic/mineral nutrient management directions.',
    },
    pestDiseasePossibilities: {
      type: Type.ARRAY,
      description: 'Potential insect pests or pathogens matching the symptoms.',
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          likelihood: { type: Type.STRING, enum: ['low', 'medium', 'high'] },
          signsToLookFor: { type: Type.STRING },
        },
        required: ['name', 'likelihood', 'signsToLookFor'],
      },
    },
    preventiveMeasures: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Long-term preventive strategies (crop rotation, clean seed, field sanitation).',
    },
    weatherConsiderations: {
      type: Type.STRING,
      description: 'How current season, temperature, and recent rainfall affect the condition.',
    },
    followUpQuestions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Questions to ask the farmer if critical information is missing.',
    },
    expertConsultationRecommended: {
      type: Type.BOOLEAN,
      description: 'True if high risk, rapid spreading, or complex diagnosis warrants visiting an expert.',
    },
    expertConsultationReason: {
      type: Type.STRING,
      description: 'Detailed explanation for why consulting an expert or lab is necessary.',
    },
    confidence: {
      type: Type.STRING,
      enum: ['low', 'medium', 'high'],
      description: 'Level of confidence based on the clarity of the farmer input.',
    },
    limitations: {
      type: Type.STRING,
      description: 'Explicit statement acknowledging this is an AI advisory without visual field inspection.',
    },
    disclaimer: {
      type: Type.STRING,
      description: 'Standard agricultural disclaimer string.',
    },
  },
  required: [
    'inScope',
    'primaryCategory',
    'summary',
    'riskLevel',
    'riskExplanation',
    'possibleCauses',
    'recommendedActions',
    'irrigationAdvice',
    'nutrientAdvice',
    'pestDiseasePossibilities',
    'preventiveMeasures',
    'weatherConsiderations',
    'followUpQuestions',
    'expertConsultationRecommended',
    'expertConsultationReason',
    'confidence',
    'limitations',
    'disclaimer',
  ],
};
