const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  transactionId: { type: String, required: true, unique: true },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: { type: String, required: true },
  category: { type: String, required: true },
  amount: { type: Number, required: true }, 
  type: { type: String, enum: ['income', 'expense'], required: true },
  contributors: [{ type: String }],
  paymentMode: { type: String, required: true },
  paymentTo: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', transactionSchema);
