import { ai, MODEL } from '../ai/geminiClient.js';
import { SYSTEM_PROMPT } from '../ai/prompts/systemPrompt.js';
import { buildAdvisoryPrompt } from '../ai/prompts/advisoryPrompt.js';
import { advisoryResponseSchema } from '../ai/responseSchema.js';
import { aiAdvisorySchema } from '../schemas/aiAdvisory.schema.js';
import { sanitizeAdvisoryOutput } from '../lib/safetyFilter.js';
import { AppError } from '../lib/AppError.js';
import { logger } from '../config/logger.js';
import { env } from '../config/env.js';

/**
 * Strips potential markdown code fences (e.g. ```json ... ```) from model output.
 */
function cleanJsonOutput(text) {
  if (!text) return '';
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.slice(7);
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.slice(3);
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.slice(0, -3);
  }
  return cleaned.trim();
}

/**
 * Executes a call to the Gemini API with timeout protection and transient error retry.
 */
async function callGeminiWithTimeout(contents, systemInstruction = SYSTEM_PROMPT) {
  const timeoutMs = env.GEMINI_TIMEOUT_MS || 30000;

  const performCall = async () => {
    const timeoutPromise = new Promise((_, reject) => {
      const timer = setTimeout(() => {
        reject(new AppError('AI service timeout: Gemini generation took longer than 30 seconds', 504, 'AI_TIMEOUT'));
      }, timeoutMs);
      timer.unref?.();
    });

    const generatePromise = (async () => {
      return await ai.models.generateContent({
        model: MODEL,
        contents,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: advisoryResponseSchema,
          temperature: 0.3,
          maxOutputTokens: 2048,
        },
      });
    })();

    return Promise.race([generatePromise, timeoutPromise]);
  };

  try {
    return await performCall();
  } catch (err) {
    // Check if error is transient (429, 500, 503) to retry once
    const status = err.status || err.statusCode || (err.message && err.message.includes('429') ? 429 : null);
    if (status === 429 || status === 500 || status === 503) {
      logger.warn('Transient Gemini API error, retrying in 1.2s...', { status, message: err.message });
      await new Promise((resolve) => setTimeout(resolve, 1200));
      return await performCall();
    }
    throw err;
  }
}

/**
 * Generates and validates structured advisory from farmer inputs.
 * Implements 1-shot repair retry and safety filtering.
 *
 * @param {object} input
 * @returns {Promise<{ aiResponse: object, model: string }>}
 */
export async function generateAdvisory(input) {
  const userPrompt = buildAdvisoryPrompt(input);

  let rawResponse;
  try {
    rawResponse = await callGeminiWithTimeout(userPrompt);
  } catch (err) {
    if (err instanceof AppError) throw err;
    logger.error('Gemini API call failed', { message: err.message, stack: err.stack });
    throw new AppError(`AI Generation service unavailable: ${err.message}`, 502, 'AI_SERVICE_ERROR');
  }

  const responseText = rawResponse?.text;
  if (!responseText) {
    throw new AppError('AI generation returned an empty or blocked response.', 502, 'AI_BLOCKED');
  }

  // 1. JSON parsing
  let parsedJson;
  const cleaned = cleanJsonOutput(responseText);
  try {
    parsedJson = JSON.parse(cleaned);
  } catch (parseErr) {
    logger.warn('Failed to parse Gemini response as JSON. Attempting repair...', { raw: cleaned });
    // Attempt 1-shot repair retry
    const repairPrompt = `${userPrompt}\n\nYour previous response was not valid JSON:\n${cleaned}\nReturn only valid JSON matching the schema.`;
    const repairResponse = await callGeminiWithTimeout(repairPrompt);
    const repairCleaned = cleanJsonOutput(repairResponse?.text);
    try {
      parsedJson = JSON.parse(repairCleaned);
    } catch (secondParseErr) {
      throw new AppError('AI response format was unparseable after repair attempt.', 502, 'AI_BAD_RESPONSE');
    }
  }

  // 2. Zod Schema Validation
  let validated = aiAdvisorySchema.safeParse(parsedJson);
  if (!validated.success) {
    const errorDetails = validated.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join(', ');
    logger.warn('Gemini output failed schema validation. Attempting repair retry...', { errorDetails });

    const repairPrompt = `${userPrompt}\n\nYour previous JSON output was invalid:\n${errorDetails}\n\nFix these errors and return only valid JSON matching the schema.`;
    const repairResponse = await callGeminiWithTimeout(repairPrompt);
    const repairCleaned = cleanJsonOutput(repairResponse?.text);

    try {
      const repairedJson = JSON.parse(repairCleaned);
      validated = aiAdvisorySchema.safeParse(repairedJson);
    } catch {
      throw new AppError('AI output failed schema validation after repair attempt.', 502, 'AI_BAD_RESPONSE');
    }

    if (!validated.success) {
      throw new AppError('AI output failed schema validation after repair attempt.', 502, 'AI_BAD_RESPONSE', validated.error.issues);
    }
  }

  // 3. Safety Post-Check & Sanitization
  const { sanitized, hadViolations } = sanitizeAdvisoryOutput(validated.data);
  if (hadViolations) {
    logger.info('Safety filter removed prohibited chemical dosage recommendations.');
  }

  return {
    aiResponse: sanitized,
    model: MODEL,
  };
}
