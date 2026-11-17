// backend/src/routes/assistant.js
const express = require('express');
const protect = require('../middlewares/auth');
const Email = require('../models/Email');
const Meeting = require('../models/Meeting');
const Draft = require('../models/Draft');
const Notification = require('../models/Notification');
const User = require('../models/User');

const router = express.Router();
router.use(protect);

// GET /api/assistant/stats
router.get('/stats', async (req, res) => {
  try {
    const match = {};
    if (req.user.role === 'assistant') {
      match.assistantId = req.user._id;
    } else if (req.user.role === 'client') {
      match.clientId = req.user._id;
    }

    const total = await Email.countDocuments(match);
    const unread = await Email.countDocuments({ ...match, isRead: false });
    const important = await Email.countDocuments({ ...match, isImportant: true });
    const assistantToReply = await Email.countDocuments({ ...match, classification: 'ASSISTANT_TO_REPLY', isArchived: false, isCompleted: false });
    const clientToReply = await Email.countDocuments({ ...match, classification: 'CLIENT_TO_REPLY', isArchived: false, isCompleted: false });
    const noReplyNeeded = await Email.countDocuments({ ...match, classification: 'NO_REPLY_NEEDED', isArchived: false });
    const actionRequired = await Email.countDocuments({ ...match, classification: { $in: ['ASSISTANT_TO_REPLY', 'CLIENT_TO_REPLY'] }, isArchived: false, isCompleted: false });
    const waiting = await Email.countDocuments({ ...match, waitingForResponse: true, isArchived: false });
    const completed = await Email.countDocuments({ ...match, isCompleted: true });

    // Pending approvals count
    const pendingApprovals = await Draft.countDocuments({ status: 'PENDING_APPROVAL' });
    const upcomingMeetings = await Meeting.countDocuments({ status: 'SCHEDULED' });

    res.json({
      total,
      unread,
      important,
      assistantToReply,
      clientToReply,
      noReplyNeeded,
      actionRequired,
      waiting,
      completed,
      pendingApprovals,
      upcomingMeetings
    });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ message: 'Failed to retrieve stats' });
  }
});

// GET /api/assistant/meetings
router.get('/meetings', async (req, res) => {
  try {
    const meetings = await Meeting.find().sort({ date: 1 }).populate('relatedEmailId').lean();
    res.json(meetings);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch meetings' });
  }
});

// POST /api/assistant/meetings
router.post('/meetings', async (req, res) => {
  try {
    const { title, date, time, description, meetingLink, relatedEmailId, participants } = req.body;
    const meeting = new Meeting({
      title,
      date: date || new Date(),
      time: time || '10:00 AM',
      description: description || '',
      meetingLink: meetingLink || 'https://meet.google.com/hum-exec-sync',
      relatedEmailId: relatedEmailId || null,
      participants: participants || []
    });
    await meeting.save();
    res.status(201).json(meeting);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create meeting' });
  }
});

// PATCH /api/assistant/meetings/:id
router.patch('/meetings/:id', async (req, res) => {
  try {
    const meeting = await Meeting.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!meeting) return res.status(404).json({ message: 'Meeting not found' });
    res.json(meeting);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update meeting' });
  }
});

// DELETE /api/assistant/meetings/:id
router.delete('/meetings/:id', async (req, res) => {
  try {
    const meeting = await Meeting.findByIdAndDelete(req.params.id);
    if (!meeting) return res.status(404).json({ message: 'Meeting not found' });
    res.json({ message: 'Meeting cancelled' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete meeting' });
  }
});

// GET /api/assistant/drafts/:emailId
router.get('/drafts/:emailId', async (req, res) => {
  try {
    const drafts = await Draft.find({ emailId: req.params.emailId }).sort({ updatedAt: -1 }).lean();
    res.json(drafts);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch drafts' });
  }
});

// POST /api/assistant/drafts
router.post('/drafts', async (req, res) => {
  try {
    const { emailId, recipient, subject, body, status, clientFeedback } = req.body;
    let draft = await Draft.findOne({ emailId });
    if (draft) {
      draft.body = body !== undefined ? body : draft.body;
      draft.subject = subject || draft.subject;
      draft.recipient = recipient || draft.recipient;
      draft.status = status || draft.status;
      if (clientFeedback !== undefined) draft.clientFeedback = clientFeedback;
      await draft.save();
    } else {
      draft = new Draft({
        emailId,
        recipient: recipient || 'client@example.com',
        subject: subject || 'Re: Conversation',
        body,
        status: status || 'DRAFT',
        createdBy: req.user._id,
        clientFeedback: clientFeedback || ''
      });
      await draft.save();
    }
    res.status(200).json(draft);
  } catch (err) {
    res.status(500).json({ message: 'Failed to save draft' });
  }
});

// GET /api/assistant/notifications
router.get('/notifications', async (req, res) => {
  try {
    const notifications = await Notification.find({ recipientId: req.user._id }).sort({ createdAt: -1 }).lean();
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch notifications' });
  }
});

// PATCH /api/assistant/notifications/:id/read
router.patch('/notifications/:id/read', async (req, res) => {
  try {
    const n = await Notification.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
    res.json(n);
  } catch (err) {
    res.status(500).json({ message: 'Failed to mark notification read' });
  }
});

module.exports = router;
