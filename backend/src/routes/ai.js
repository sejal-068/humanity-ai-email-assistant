// backend/src/routes/ai.js
const express = require('express');
const protect = require('../middlewares/auth');
const { assistantOnly } = require('../middlewares/role');
const AIService = require('../services/aiService');
const Email = require('../models/Email');

const router = express.Router();
router.use(protect, assistantOnly);

// POST /api/ai/classify/:id
router.post('/classify/:id', async (req, res) => {
  const email = await Email.findById(req.params.id);
  if (!email) return res.status(404).json({ message: 'Email not found' });
  try {
    const result = await AIService.classify(email);
    email.originalAIClassification = result.classification;
    email.classification = result.classification;
    email.confidence = result.confidence;
    email.priority = result.priority;
    email.requiresAction = result.requiresAction;
    email.summary = result.summary;
    email.classificationReason = result.reason;
    email.suggestedAction = result.suggestedAction;
    email.category = result.category;
    email.classificationSource = 'AI';
    await email.save();
    res.json({ message: 'Classification completed', result, email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'AI classification failed' });
  }
});

// POST /api/ai/summarize/:id
router.post('/summarize/:id', async (req, res) => {
  const email = await Email.findById(req.params.id);
  if (!email) return res.status(404).json({ message: 'Email not found' });
  const summary = await AIService.summarize(email);
  email.summary = summary;
  await email.save();
  res.json({ summary });
});

// POST /api/ai/draft/:id
router.post('/draft/:id', async (req, res) => {
  const email = await Email.findById(req.params.id);
  if (!email) return res.status(404).json({ message: 'Email not found' });
  const draftBody = await AIService.draftReply(email);
  res.json({ draft: draftBody });
});

module.exports = router;

