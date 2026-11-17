// backend/src/routes/dashboard.js
const express = require('express');
const protect = require('../middlewares/auth');
const Email = require('../models/Email');

const router = express.Router();
router.use(protect);

// GET /api/dashboard/stats
router.get('/stats', async (req, res) => {
  const match = {};
  if (req.user.role === 'assistant') match.assistantId = req.user._id;
  else if (req.user.role === 'client') match.clientId = req.user._id;
  const total = await Email.countDocuments(match);
  const unread = await Email.countDocuments({ ...match, isRead: false });
  const important = await Email.countDocuments({ ...match, isImportant: true });
  const actionRequired = await Email.countDocuments({ ...match, classification: { $in: ['ASSISTANT_TO_REPLY','CLIENT_TO_REPLY'] } });
  const waiting = await Email.countDocuments({ ...match, waitingForResponse: true });
  res.json({ total, unread, important, actionRequired, waiting });
});

module.exports = router;

