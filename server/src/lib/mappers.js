/**
 * Map Postgres advisory row to camelCase response object
 */
export function mapAdvisoryRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    userId: row.user_id,
    crop: row.crop,
    location: row.location,
    soilType: row.soil_type,
    season: row.season,
    growthStage: row.growth_stage,
    irrigation: row.irrigation,
    irrigationMethod: row.irrigation_method,
    temperatureC: row.temperature_c !== null ? Number(row.temperature_c) : null,
    rainfallMm: row.rainfall_mm !== null ? Number(row.rainfall_mm) : null,
    farmSizeAcres: row.farm_size_acres !== null ? Number(row.farm_size_acres) : null,
    problem: row.problem,
    language: row.language,
    primaryCategory: row.primary_category,
    riskLevel: row.risk_level,
    expertConsultationRecommended: Boolean(row.expert_consultation_recommended),
    aiResponse: row.ai_response,
    model: row.model,
    createdAt: row.created_at,
  };
}

/**
 * Map Postgres profile row to camelCase response object
 */
export function mapProfileRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    defaultLocation: row.default_location,
    preferredLanguage: row.preferred_language,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
