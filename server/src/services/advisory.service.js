import { generateAdvisory } from './ai.service.js';
import { mapAdvisoryRow } from '../lib/mappers.js';
import { AppError } from '../lib/AppError.js';
import { logger } from '../config/logger.js';

export async function createAdvisory(sb, userId, input) {
  // 1. Generate AI advisory using Gemini
  const { aiResponse, model } = await generateAdvisory(input);

  // If request is out of agricultural scope, do not persist to database (Section 15)
  if (aiResponse.inScope === false) {
    return {
      inScope: false,
      message: aiResponse.summary || 'This request is outside the scope of agricultural crop advisory.',
      aiResponse,
    };
  }

  // Determine crop label to store
  const effectiveCrop = input.crop === 'Other' && input.cropOther ? input.cropOther.trim() : input.crop;

  // 2. Insert into PostgreSQL via user-scoped Supabase client (enforcing RLS)
  const insertPayload = {
    user_id: userId,
    crop: effectiveCrop,
    location: input.location.trim(),
    soil_type: input.soilType,
    season: input.season,
    growth_stage: input.growthStage || null,
    irrigation: input.irrigation,
    irrigation_method: input.irrigation !== 'Rain-fed only' ? input.irrigationMethod || null : null,
    temperature_c: input.temperatureC !== undefined ? input.temperatureC : null,
    rainfall_mm: input.rainfallMm !== undefined ? input.rainfallMm : null,
    farm_size_acres: input.farmSizeAcres !== undefined ? input.farmSizeAcres : null,
    problem: input.problem.trim(),
    language: input.language || 'English',
    primary_category: aiResponse.primaryCategory,
    risk_level: aiResponse.riskLevel,
    expert_consultation_recommended: aiResponse.expertConsultationRecommended,
    ai_response: aiResponse,
    model,
  };

  const { data, error } = await sb
    .from('advisories')
    .insert(insertPayload)
    .select()
    .single();

  if (error) {
    logger.error('Failed to insert advisory into database', { error, userId });
    throw new AppError(`Database error creating advisory: ${error.message}`, 500, 'DATABASE_ERROR');
  }

  return {
    inScope: true,
    advisory: mapAdvisoryRow(data),
  };
}

export async function listAdvisories(sb, userId, { page = 1, pageSize = 10, crop, risk, q } = {}) {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = sb
    .from('advisories')
    .select('*', { count: 'exact' })
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(from, to);

  if (crop && crop.trim().length > 0) {
    query = query.ilike('crop', `%${crop.trim()}%`);
  }

  if (risk && ['low', 'medium', 'high'].includes(risk)) {
    query = query.eq('risk_level', risk);
  }

  if (q && q.trim().length > 0) {
    // Search across problem or crop
    query = query.or(`problem.ilike.%${q.trim()}%,crop.ilike.%${q.trim()}%,location.ilike.%${q.trim()}%`);
  }

  const { data, error, count } = await query;

  if (error) {
    logger.error('Failed to list advisories from database', { error, userId });
    throw new AppError(`Database error listing advisories: ${error.message}`, 500, 'DATABASE_ERROR');
  }

  return {
    items: (data || []).map(mapAdvisoryRow),
    page,
    pageSize,
    total: count || 0,
  };
}

export async function getAdvisoryById(sb, userId, id) {
  const { data, error } = await sb
    .from('advisories')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    logger.error('Failed to fetch advisory by ID', { error, id, userId });
    throw new AppError(`Database error: ${error.message}`, 500, 'DATABASE_ERROR');
  }

  if (!data) {
    throw new AppError('Advisory not found or you do not have permission to view it.', 404, 'NOT_FOUND');
  }

  return mapAdvisoryRow(data);
}

export async function deleteAdvisoryById(sb, userId, id) {
  const { data, error } = await sb
    .from('advisories')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)
    .select();

  if (error) {
    logger.error('Failed to delete advisory', { error, id, userId });
    throw new AppError(`Database error deleting advisory: ${error.message}`, 500, 'DATABASE_ERROR');
  }

  if (!data || data.length === 0) {
    throw new AppError('Advisory not found or you do not have permission to delete it.', 404, 'NOT_FOUND');
  }

  return { success: true };
}

export async function getAdvisoryStats(sb, userId) {
  const { data, error } = await sb
    .from('advisories')
    .select('id, crop, risk_level, created_at, primary_category, location, expert_consultation_recommended')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    logger.error('Failed to calculate stats', { error, userId });
    throw new AppError(`Database error fetching stats: ${error.message}`, 500, 'DATABASE_ERROR');
  }

  const items = data || [];
  const total = items.length;

  // Calculate risk level distribution
  const riskDistribution = {
    low: 0,
    medium: 0,
    high: 0,
  };

  const cropCounts = {};

  items.forEach((item) => {
    if (riskDistribution[item.risk_level] !== undefined) {
      riskDistribution[item.risk_level]++;
    }
    const c = item.crop || 'Unknown';
    cropCounts[c] = (cropCounts[c] || 0) + 1;
  });

  // Most queried crop
  let topCrop = 'None';
  let maxCount = 0;
  for (const [cropName, count] of Object.entries(cropCounts)) {
    if (count > maxCount) {
      maxCount = count;
      topCrop = cropName;
    }
  }

  // Last 5 advisories
  const recent = items.slice(0, 5).map((row) => ({
    id: row.id,
    crop: row.crop,
    location: row.location,
    riskLevel: row.risk_level,
    primaryCategory: row.primary_category,
    expertConsultationRecommended: row.expert_consultation_recommended,
    createdAt: row.created_at,
  }));

  return {
    total,
    riskDistribution,
    topCrop,
    recent,
  };
}
