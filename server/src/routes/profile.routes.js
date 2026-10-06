const profileStore = new Map();

export const profileRoutes = {
  getProfile: (req, res) => {
    const userId = req.user.id;
    const profile = profileStore.get(userId) || {
      id: userId,
      name: 'Demo Farmer',
      defaultLocation: 'Mysuru, Karnataka',
      preferredLanguage: 'English',
    };
    profileStore.set(userId, profile);
    res.json(profile);
  },
  updateProfile: (req, res) => {
    const userId = req.user.id;
    const payload = req.body;
    const profile = {
      id: userId,
      name: payload.name || 'Demo Farmer',
      defaultLocation: payload.defaultLocation || 'Mysuru, Karnataka',
      preferredLanguage: payload.preferredLanguage || 'English',
    };
    profileStore.set(userId, profile);
    res.json(profile);
  },
};
