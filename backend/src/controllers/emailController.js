// backend/src/controllers/emailController.js
const Email = require('../models/Email');
const Conversation = require('../models/Conversation');

// Helper to build filter based on role and query params
const buildFilter = (user, query) => {
  const filter = {};
  if (user.role === 'assistant') {
    filter.assistantId = user._id;
  } else if (user.role === 'client') {
    filter.clientId = user._id;
  }
  // Apply optional filters
  if (query.classification) filter.classification = query.classification;
  if (query.unread === 'true') filter.isRead = false;
  if (query.important === 'true') filter.isImportant = true;
  if (query.search) {
    const regex = new RegExp(query.search, 'i');
    filter.$or = [{ subject: regex }, { sender: regex }, { body: regex }];
  }
  return filter;
};

// GET /api/emails
exports.getEmails = async (req, res) => {
  const filter = buildFilter(req.user, req.query);
  const emails = await Email.find(filter).sort({ receivedAt: -1 }).lean();
  res.json(emails);
};

// GET /api/emails/:id
exports.getEmailById = async (req, res) => {
  const email = await Email.findById(req.params.id).lean();
  if (!email) return res.status(404).json({ message: 'Email not found' });
  // Authorization check
  if (req.user.role === 'assistant' && !email.assistantId.equals(req.user._id)) {
    return res.status(403).json({ message: 'Access denied' });
  }
  if (req.user.role === 'client' && !email.clientId.equals(req.user._id)) {
    return res.status(403).json({ message: 'Access denied' });
  }
  const conversation = await Conversation.findOne({ emailId: email._id }).lean();
  res.json({ email, conversation });
};

// PATCH /api/emails/:id/read
exports.updateRead = async (req, res) => {
  const { read } = req.body; // boolean
  const email = await Email.findById(req.params.id);
  if (!email) return res.status(404).json({ message: 'Email not found' });
  // auth check same as above
  if (req.user.role === 'assistant' && !email.assistantId.equals(req.user._id)) return res.status(403).json({ message: 'Access denied' });
  if (req.user.role === 'client' && !email.clientId.equals(req.user._id)) return res.status(403).json({ message: 'Access denied' });
  email.isRead = Boolean(read);
  await email.save();
  res.json({ message: 'Read status updated', email });
};

// PATCH /api/emails/:id/important
exports.updateImportant = async (req, res) => {
  const { important } = req.body;
  const email = await Email.findById(req.params.id);
  if (!email) return res.status(404).json({ message: 'Email not found' });
  if (req.user.role === 'assistant' && !email.assistantId.equals(req.user._id)) return res.status(403).json({ message: 'Access denied' });
  if (req.user.role === 'client' && !email.clientId.equals(req.user._id)) return res.status(403).json({ message: 'Access denied' });
  email.isImportant = Boolean(important);
  await email.save();
  res.json({ message: 'Importance updated', email });
};

// PATCH /api/emails/:id/archive
exports.updateArchive = async (req, res) => {
  const { archive } = req.body;
  const email = await Email.findById(req.params.id);
  if (!email) return res.status(404).json({ message: 'Email not found' });
  if (req.user.role === 'assistant' && !email.assistantId.equals(req.user._id)) return res.status(403).json({ message: 'Access denied' });
  if (req.user.role === 'client' && !email.clientId.equals(req.user._id)) return res.status(403).json({ message: 'Access denied' });
  email.isArchived = Boolean(archive);
  await email.save();
  res.json({ message: 'Archive status updated', email });
};

// PATCH /api/emails/:id/classify (manual override)
exports.updateManualClassification = async (req, res) => {
  const { classification, reason } = req.body; // expect enum value
  const email = await Email.findById(req.params.id);
  if (!email) return res.status(404).json({ message: 'Email not found' });
  if (req.user.role !== 'assistant') return res.status(403).json({ message: 'Only assistants can manually classify' });
  email.manualClassification = classification;
  email.classification = classification;
  email.classificationSource = 'MANUAL';
  if (reason) email.classificationReason = reason;
  await email.save();
  res.json({ message: 'Classification manually updated', email });
};

// PATCH /api/emails/:id/complete
exports.completeConversation = async (req, res) => {
  const email = await Email.findById(req.params.id);
  if (!email) return res.status(404).json({ message: 'Email not found' });
  const conv = await Conversation.findOne({ emailId: email._id });
  if (conv) {
    conv.status = 'COMPLETED';
    await conv.save();
  }
  email.isCompleted = true;
  await email.save();
  res.json({ message: 'Conversation marked completed', email });
};

