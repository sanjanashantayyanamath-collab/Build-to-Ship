import * as advisoryService from '../services/advisory.service.js';

export async function createAdvisoryHandler(req, res, next) {
  try {
    const result = await advisoryService.createAdvisory(req.sb, req.user.id, req.body);
    if (!result.inScope) {
      return res.status(200).json({
        inScope: false,
        message: result.message,
        aiResponse: result.aiResponse,
      });
    }
    return res.status(201).json(result.advisory);
  } catch (err) {
    next(err);
  }
}

export async function listAdvisoriesHandler(req, res, next) {
  try {
    const result = await advisoryService.listAdvisories(req.sb, req.user.id, req.query);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function getAdvisoryStatsHandler(req, res, next) {
  try {
    const stats = await advisoryService.getAdvisoryStats(req.sb, req.user.id);
    return res.status(200).json(stats);
  } catch (err) {
    next(err);
  }
}

export async function getAdvisoryByIdHandler(req, res, next) {
  try {
    const advisory = await advisoryService.getAdvisoryById(req.sb, req.user.id, req.params.id);
    return res.status(200).json(advisory);
  } catch (err) {
    next(err);
  }
}

export async function deleteAdvisoryByIdHandler(req, res, next) {
  try {
    const result = await advisoryService.deleteAdvisoryById(req.sb, req.user.id, req.params.id);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}
