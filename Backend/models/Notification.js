const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },      // Receiver
  person: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },    // Sender
  amount: { type: Number, required: true },
  status: { type: String, enum: ['due', 'owed', 'paid'], required: true },
  read: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);
