// backend/src/models/EmailAccount.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const emailAccountSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  provider: { type: String, enum: ['gmail','outlook'], required: true },
  emailAddress: { type: String, required: true },
  connectionStatus: { type: String, enum: ['connected','disconnected','demo'], default: 'demo' },
  lastSyncedAt: { type: Date },
  isDemo: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('EmailAccount', emailAccountSchema);

