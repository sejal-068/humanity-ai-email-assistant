// backend/src/routes/account.js
const express = require('express');
const protect = require('../middlewares/auth');
const EmailAccount = require('../models/EmailAccount');

const router = express.Router();
router.use(protect);

// GET /api/accounts - list connected accounts for logged user
router.get('/', async (req, res) => {
  const accounts = await EmailAccount.find({ userId: req.user._id }).lean();
  res.json(accounts);
});

// POST /api/accounts/connect-demo - simulate Gmail or Outlook connection
router.post('/connect-demo', async (req, res) => {
  const { provider, emailAddress } = req.body; // provider: 'gmail'|'outlook'
  if (!['gmail','outlook'].includes(provider)) {
    return res.status(400).json({ message: 'Invalid provider' });
  }
  const existing = await EmailAccount.findOne({ userId: req.user._id, provider });
  if (existing) {
    existing.connectionStatus = 'connected';
    existing.isDemo = true;
    existing.lastSyncedAt = new Date();
    existing.emailAddress = emailAddress || existing.emailAddress;
    await existing.save();
    return res.json({ message: `${provider} already connected (demo)`, account: existing });
  }
  const account = new EmailAccount({
    userId: req.user._id,
    provider,
    emailAddress: emailAddress || `${req.user.email}`,
    connectionStatus: 'connected',
    isDemo: true,
    lastSyncedAt: new Date(),
  });
  await account.save();
  res.status(201).json({ message: `${provider} demo connection created`, account });
});

// DELETE /api/accounts/:id - disconnect demo account
router.delete('/:id', async (req, res) => {
  const account = await EmailAccount.findById(req.params.id);
  if (!account) return res.status(404).json({ message: 'Account not found' });
  if (!account.userId.equals(req.user._id)) return res.status(403).json({ message: 'Access denied' });
  await account.remove();
  res.json({ message: 'Account disconnected' });
});

module.exports = router;

