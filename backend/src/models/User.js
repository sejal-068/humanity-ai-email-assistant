// backend/src/models/User.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['assistant', 'client'], required: true },
  clientId: { type: Schema.Types.ObjectId, ref: 'User' }, // for assistants → linked client
  assistantId: { type: Schema.Types.ObjectId, ref: 'User' }, // for client → linked assistant
  onboarded: { type: Boolean, default: false }, // new field – onboarding flow flag
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);

