// backend/src/controllers/onboardingController.js
const User = require('../models/User');

// GET /api/onboarding/status -> returns if user has completed onboarding
exports.getStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('onboarded');
    res.json({ onboarded: user?.onboarded ?? false });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to get onboarding status' });
  }
};

// POST /api/onboarding/complete -> marks user as onboarded
exports.complete = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { onboarded: true });
    res.json({ message: 'Onboarding completed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to complete onboarding' });
  }
};

