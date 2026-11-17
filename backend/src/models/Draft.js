// backend/src/models/Draft.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const draftSchema = new Schema({
  emailId: { type: Schema.Types.ObjectId, ref: 'Email', required: true },
  recipient: { type: String, required: true },
  subject: { type: String, required: true },
  body: { type: String, required: true },
  status: { type: String, enum: ['DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'CHANGES_REQUESTED', 'SENT'], default: 'DRAFT' },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  clientFeedback: { type: String, default: '' },
  approvedAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Draft', draftSchema);
