// backend/src/models/Email.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const emailSchema = new Schema({
  subject: { type: String, required: true },
  sender: { type: String, required: true },
  senderEmail: { type: String, required: true },
  recipients: [{ type: String, required: true }],
  body: { type: String, required: true },
  preview: { type: String },
  conversationId: { type: Schema.Types.ObjectId, ref: 'Conversation' },
  clientId: { type: Schema.Types.ObjectId, ref: 'User' },
  assistantId: { type: Schema.Types.ObjectId, ref: 'User' },
  classification: { type: String, enum: ['ASSISTANT_TO_REPLY','CLIENT_TO_REPLY','NO_REPLY_NEEDED','NEEDS_REVIEW'], default: 'NEEDS_REVIEW' },
  originalAIClassification: { type: String },
  manualClassification: { type: String },
  confidence: { type: Number },
  classificationSource: { type: String, enum: ['AI','MANUAL'] },
  classificationReason: { type: String },
  summary: { type: String },
  suggestedAction: { type: String },
  priority: { type: String, enum: ['HIGH','MEDIUM','LOW'], default: 'MEDIUM' },
  category: { type: String },
  requiresAction: { type: Boolean, default: true },
  isImportant: { type: Boolean, default: false },
  isRead: { type: Boolean, default: false },
  isArchived: { type: Boolean, default: false },
  isCompleted: { type: Boolean, default: false },
  waitingForResponse: { type: Boolean, default: false },
  receivedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Email', emailSchema);

