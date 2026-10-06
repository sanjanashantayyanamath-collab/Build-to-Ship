import * as profileService from '../services/profile.service.js';

export async function getProfileHandler(req, res, next) {
  try {
    const profile = await profileService.getProfile(req.sb, req.user.id);
    return res.status(200).json(profile);
  } catch (err) {
    next(err);
  }
}

export async function updateProfileHandler(req, res, next) {
  try {
    const profile = await profileService.updateProfile(req.sb, req.user.id, req.body);
    return res.status(200).json(profile);
  } catch (err) {
    next(err);
  }
}
