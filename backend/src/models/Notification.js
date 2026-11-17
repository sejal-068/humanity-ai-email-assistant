// backend/src/models/Notification.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const notificationSchema = new Schema({
  recipientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  title: { type: String, default: 'Notification' },
  type: { type: String, enum: ['INFO', 'ALERT', 'ACTION', 'APPROVAL', 'MEETING'], default: 'INFO' },
  relatedEmailId: { type: Schema.Types.ObjectId, ref: 'Email' },
  isRead: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
