import { describe, it, expect } from 'vitest';
import { sanitizeAdvisoryOutput } from '../src/lib/safetyFilter.js';

describe('Safety Filter & Post-processing', () => {
  it('enforces standardized agricultural disclaimer on AI response', () => {
    const aiOutput = {
      inScope: true,
      primaryCategory: 'disease_symptoms',
      summary: 'Sample summary',
      riskLevel: 'low',
      riskExplanation: 'Low risk',
      possibleCauses: [],
      recommendedActions: [{ priority: 1, action: 'Prune leaves', reason: 'Ventilation' }],
      irrigationAdvice: 'Normal irrigation',
      nutrientAdvice: 'Balanced nutrients',
      pestDiseasePossibilities: [],
      preventiveMeasures: ['Crop rotation'],
      weatherConsiderations: 'Favorable',
      followUpQuestions: [],
      expertConsultationRecommended: false,
      expertConsultationReason: '',
      confidence: 'high',
      limitations: 'General guidance',
      disclaimer: 'Short custom disclaimer',
    };

    const { sanitized } = sanitizeAdvisoryOutput(aiOutput);
    expect(sanitized.disclaimer).toContain('informational and does not replace guidance from a qualified agricultural expert');
  });

  it('strips unsafe chemical dosage numeric patterns from recommended actions', () => {
    const aiOutputWithDosage = {
      inScope: true,
      primaryCategory: 'pest_concerns',
      summary: 'Pest outbreak',
      riskLevel: 'high',
      riskExplanation: 'High infestation',
      possibleCauses: [],
      recommendedActions: [
        { priority: 1, action: 'Spray 50 ml per litre of pesticide on leaves', reason: 'Kill pests' },
        { priority: 2, action: 'Apply organic neem oil spray', reason: 'Preventive' },
      ],
      irrigationAdvice: 'Drip',
      nutrientAdvice: 'None',
      pestDiseasePossibilities: [],
      preventiveMeasures: [],
      weatherConsiderations: 'Dry',
      followUpQuestions: [],
      expertConsultationRecommended: true,
      expertConsultationReason: 'Chemical advice needed',
      confidence: 'medium',
      limitations: 'Consult extension officer',
      disclaimer: 'Standard disclaimer',
    };

    const { sanitized } = sanitizeAdvisoryOutput(aiOutputWithDosage);
    // The action containing specific dosage pattern should be cleaned or replaced
    expect(sanitized.recommendedActions[0].action).not.toContain('50 ml per litre of pesticide');
  });
});
