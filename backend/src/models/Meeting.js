// backend/src/models/Meeting.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const meetingSchema = new Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, default: '10:00 AM' },
  description: { type: String, default: '' },
  meetingLink: { type: String, default: 'https://meet.google.com/hum-exec-sync' },
  relatedEmailId: { type: Schema.Types.ObjectId, ref: 'Email' },
  participants: [{ type: String }],
  status: { type: String, enum: ['SCHEDULED', 'COMPLETED', 'CANCELLED'], default: 'SCHEDULED' },
}, { timestamps: true });

module.exports = mongoose.model('Meeting', meetingSchema);
