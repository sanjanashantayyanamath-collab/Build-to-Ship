const advisoryStore = new Map();

const normalizeAdvisory = (data) => ({
  id: data.id || cryptoRandomId(),
  crop: data.crop,
  cropOther: data.cropOther || '',
  location: data.location,
  soilType: data.soilType,
  season: data.season,
  growthStage: data.growthStage || 'Vegetative',
  irrigation: data.irrigation,
  irrigationMethod: data.irrigationMethod || null,
  temperatureC: data.temperatureC || null,
  rainfallMm: data.rainfallMm || null,
  farmSizeAcres: data.farmSizeAcres || null,
  problem: data.problem,
  language: data.language || 'English',
  primaryCategory: data.primaryCategory || 'general_crop_management',
  riskLevel: data.riskLevel || 'medium',
  summary: data.summary || 'Advisory generated successfully.',
  riskExplanation: data.riskExplanation || 'Follow recommended actions and monitor crop health.',
  possibleCauses: data.possibleCauses || [],
  recommendedActions: data.recommendedActions || [],
  irrigationAdvice: data.irrigationAdvice || 'Manage irrigation carefully and check field drainage.',
  nutrientAdvice: data.nutrientAdvice || 'Check nutrient balance based on crop stage and soil condition.',
  pestDiseasePossibilities: data.pestDiseasePossibilities || [],
  preventiveMeasures: data.preventiveMeasures || [],
  weatherConsiderations: data.weatherConsiderations || 'Track recent rainfall and temperature patterns.',
  followUpQuestions: data.followUpQuestions || [],
  expertConsultationRecommended: Boolean(data.expertConsultationRecommended),
  expertConsultationReason: data.expertConsultationReason || '',
  confidence: data.confidence || 'medium',
  limitations: data.limitations || 'This is a general recommendation based on the supplied input.',
  disclaimer: data.disclaimer || 'This AI-generated advice is informational and does not replace guidance from a qualified agricultural expert.',
  createdAt: new Date().toISOString(),
});

function cryptoRandomId() {
  return `advisory-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

export const advisoryRoutes = {
  create: (req, res) => {
    const payload = normalizeAdvisory(req.body);
    const list = advisoryStore.get(req.user.id) || [];
    list.unshift(payload);
    advisoryStore.set(req.user.id, list);
    res.status(201).json(payload);
  },
  list: (req, res) => {
    const list = advisoryStore.get(req.user.id) || [];
    const q = (req.query.q || '').toLowerCase();
    const crop = req.query.crop || '';
    const risk = req.query.risk || '';

    const filtered = list.filter((advisory) => {
      const cropMatch = !crop || advisory.crop.toLowerCase().includes(crop.toLowerCase());
      const riskMatch = !risk || advisory.riskLevel === risk;
      const textMatch = !q || `${advisory.crop} ${advisory.problem}`.toLowerCase().includes(q);
      return cropMatch && riskMatch && textMatch;
    });

    const page = Number(req.query.page || 1);
    const pageSize = Number(req.query.pageSize || 10);
    const start = (page - 1) * pageSize;
    const items = filtered.slice(start, start + pageSize);

    res.json({ items, page, pageSize, total: filtered.length });
  },
  stats: (req, res) => {
    const list = advisoryStore.get(req.user.id) || [];
    const total = list.length;
    const byRiskLevel = { low: 0, medium: 0, high: 0 };
    for (const item of list) {
      byRiskLevel[item.riskLevel] = (byRiskLevel[item.riskLevel] || 0) + 1;
    }
    const topCrop = list.reduce((acc, item) => {
      acc[item.crop] = (acc[item.crop] || 0) + 1;
      return acc;
    }, {});
    const mostQueriedCrop = Object.entries(topCrop).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

    res.json({ totalAdvisories: total, byRiskLevel, topCrop: mostQueriedCrop, lastFiveAdvisories: list.slice(0, 5) });
  },
  getById: (req, res) => {
    const list = advisoryStore.get(req.user.id) || [];
    const item = list.find((advisory) => advisory.id === req.params.id);
    if (!item) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Advisory not found.' } });
    res.json(item);
  },
  delete: (req, res) => {
    const list = advisoryStore.get(req.user.id) || [];
    const filtered = list.filter((advisory) => advisory.id !== req.params.id);
    if (filtered.length === list.length) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Advisory not found.' } });
    }
    advisoryStore.set(req.user.id, filtered);
    res.json({ success: true });
  },
};
