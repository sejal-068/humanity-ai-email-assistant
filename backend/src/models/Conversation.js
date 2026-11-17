// backend/src/models/Conversation.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const messageSchema = new Schema({
  author: { type: String, required: true }, // email address or name
  body: { type: String, required: true },
  sentAt: { type: Date, default: Date.now },
});

const conversationSchema = new Schema({
  emailId: { type: Schema.Types.ObjectId, ref: 'Email', required: true },
  participants: [{ type: String }],
  messages: [messageSchema],
  lastMessageAt: { type: Date },
  status: { type: String, enum: ['ACTIVE','COMPLETED'], default: 'ACTIVE' },
}, { timestamps: true });

module.exports = mongoose.model('Conversation', conversationSchema);

