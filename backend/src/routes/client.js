// backend/src/routes/client.js
const express = require('express');
const protect = require('../middlewares/auth');
const { clientOnly } = require('../middlewares/role');
const Email = require('../models/Email');
const Draft = require('../models/Draft');
const Meeting = require('../models/Meeting');
const Notification = require('../models/Notification');

const router = express.Router();
router.use(protect, clientOnly);

// GET /api/client/attention -> emails requiring client response
router.get('/attention', async (req, res) => {
  const emails = await Email.find({
    clientId: req.user._id,
    classification: 'CLIENT_TO_REPLY',
    isArchived: false,
    isCompleted: false
  }).sort({ receivedAt: -1 }).lean();
  res.json(emails);
});

// GET /api/client/handled -> emails marked as handled/completed
router.get('/handled', async (req, res) => {
  const emails = await Email.find({
    clientId: req.user._id,
    isCompleted: true
  }).sort({ receivedAt: -1 }).lean();
  res.json(emails);
});

// GET /api/client/pending-approvals -> drafts awaiting client signoff
router.get('/pending-approvals', async (req, res) => {
  try {
    const drafts = await Draft.find({
      status: { $in: ['PENDING_APPROVAL', 'CHANGES_REQUESTED'] }
    }).populate('emailId').sort({ updatedAt: -1 }).lean();
    res.json(drafts);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch pending approvals' });
  }
});

// PATCH /api/client/drafts/:id/approve
router.patch('/drafts/:id/approve', async (req, res) => {
  try {
    const draft = await Draft.findById(req.params.id);
    if (!draft) return res.status(404).json({ message: 'Draft not found' });
    draft.status = 'APPROVED';
    draft.approvedAt = new Date();
    await draft.save();

    // Create notification for assistant
    await Notification.create({
      recipientId: draft.createdBy,
      title: 'Draft Approved',
      message: `Dr. Sterling approved the reply for: "${draft.subject}"`,
      type: 'APPROVAL',
      relatedEmailId: draft.emailId
    });

    res.json({ message: 'Draft approved successfully', draft });
  } catch (err) {
    res.status(500).json({ message: 'Approval failed' });
  }
});

// PATCH /api/client/drafts/:id/request-changes
router.patch('/drafts/:id/request-changes', async (req, res) => {
  try {
    const { feedback } = req.body;
    const draft = await Draft.findById(req.params.id);
    if (!draft) return res.status(404).json({ message: 'Draft not found' });
    draft.status = 'CHANGES_REQUESTED';
    draft.clientFeedback = feedback || 'Client requested modifications before sending.';
    await draft.save();

    // Notify assistant
    await Notification.create({
      recipientId: draft.createdBy,
      title: 'Changes Requested on Draft',
      message: `Feedback received: "${feedback || 'Please modify draft'}" on ${draft.subject}`,
      type: 'ACTION',
      relatedEmailId: draft.emailId
    });

    res.json({ message: 'Feedback submitted to assistant', draft });
  } catch (err) {
    res.status(500).json({ message: 'Failed to request changes' });
  }
});

// PATCH /api/client/emails/:id/handled
router.patch('/emails/:id/handled', async (req, res) => {
  const email = await Email.findById(req.params.id);
  if (!email) return res.status(404).json({ message: 'Email not found' });
  if (!email.clientId.equals(req.user._id)) return res.status(403).json({ message: 'Access denied' });
  email.isCompleted = true;
  await email.save();
  res.json({ message: 'Email marked handled', email });
});

// PATCH /api/client/emails/:id/takeover
router.patch('/emails/:id/takeover', async (req, res) => {
  const email = await Email.findById(req.params.id);
  if (!email) return res.status(404).json({ message: 'Email not found' });
  if (!email.clientId.equals(req.user._id)) return res.status(403).json({ message: 'Access denied' });
  email.classification = 'ASSISTANT_TO_REPLY';
  email.classificationSource = 'MANUAL';
  email.classificationReason = 'Client requested assistant takeover';
  await email.save();

  // Create notification for assistant
  if (email.assistantId) {
    await Notification.create({
      recipientId: email.assistantId,
      title: 'Assistant Takeover Requested',
      message: `Dr. Sterling assigned you to handle: "${email.subject}"`,
      type: 'ACTION',
      relatedEmailId: email._id
    });
  }

  res.json({ message: 'Takeover recorded, email reassigned to assistant', email });
});

module.exports = router;
