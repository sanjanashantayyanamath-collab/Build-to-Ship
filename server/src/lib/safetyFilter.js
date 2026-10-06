export const STANDARD_DISCLAIMER =
  'This AI-generated advice is informational and does not replace guidance from a qualified agricultural expert.';

// Regex pattern to detect chemical dosage instructions
// e.g. "apply 2 ml/l of pesticide", "mix 500g per acre of fungicide"
const DOSAGE_PATTERN = /(\d+(?:\.\d+)?\s*(?:ml|g|kg|l|litres?|grams?|millilitres?)\s*(?:per|\/)\s*(?:l|litre|acre|hectare|ha|plant|tree|pump))/i;
const CHEMICAL_KEYWORDS = /(?:pesticide|fungicide|insecticide|herbicide|chemical|spray|chlorpyrifos|monocrotophos|imidacloprid|mancozeb|carbendazim|glyphosate)/i;

/**
 * Checks if a string contains prohibited pesticide/chemical dosage patterns.
 * @param {string} text
 * @returns {boolean}
 */
export function containsChemicalDosage(text) {
  if (!text || typeof text !== 'string') return false;
  return DOSAGE_PATTERN.test(text) && CHEMICAL_KEYWORDS.test(text);
}

/**
 * Sanitizes an advisory object:
 * 1. Enforces standard disclaimer
 * 2. Scans actions, causes, and notes for banned chemical dosages, stripping or sanitizing offending sentences
 * 3. Enforces expert consultation if risk is high
 *
 * @param {object} advisory
 * @returns {{ sanitized: object, hadViolations: boolean }}
 */
export function sanitizeAdvisoryOutput(advisory) {
  let hadViolations = false;
  const result = JSON.parse(JSON.stringify(advisory));

  // 1. Enforce disclaimer
  if (!result.disclaimer || !result.disclaimer.includes('agricultural expert')) {
    result.disclaimer = STANDARD_DISCLAIMER;
  }

  // Helper to sanitize a sentence-based text field
  const sanitizeText = (text) => {
    if (!text || typeof text !== 'string') return text;
    if (containsChemicalDosage(text)) {
      hadViolations = true;
      // Strip sentences containing dosage
      const sentences = text.split(/(?<=[.!?])\s+/);
      const cleanSentences = sentences.filter((s) => !containsChemicalDosage(s));
      return cleanSentences.length > 0
        ? cleanSentences.join(' ')
        : 'Consult a local certified agronomist for approved treatments and label-specified application guidelines.';
    }
    return text;
  };

  // 2. Sanitize recommended actions
  if (Array.isArray(result.recommendedActions)) {
    result.recommendedActions = result.recommendedActions.map((item) => ({
      ...item,
      action: sanitizeText(item.action),
      reason: sanitizeText(item.reason),
    }));
  }

  // 3. Sanitize irrigation, nutrient, weather
  if (result.irrigationAdvice) result.irrigationAdvice = sanitizeText(result.irrigationAdvice);
  if (result.nutrientAdvice) result.nutrientAdvice = sanitizeText(result.nutrientAdvice);
  if (result.weatherConsiderations) result.weatherConsiderations = sanitizeText(result.weatherConsiderations);

  // 4. If high risk, expert consultation MUST be recommended
  if (result.riskLevel === 'high') {
    result.expertConsultationRecommended = true;
    if (!result.expertConsultationReason) {
      result.expertConsultationReason = 'High crop risk detected. Immediate on-site field verification by an agricultural specialist is recommended.';
    }
  }

  return {
    sanitized: result,
    hadViolations,
  };
}
