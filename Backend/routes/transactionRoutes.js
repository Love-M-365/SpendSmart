const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');

// POST /api/transactions/add — Add a transaction
router.post('/add', async (req, res) => {
  try {
    let { amount, type } = req.body;

    // Ensure expense is stored as negative
    if (type === 'expense') {
      amount = -Math.abs(amount);
    } else {
      amount = Math.abs(amount);
    }

    const newTransaction = new Transaction({ ...req.body, amount });
    await newTransaction.save();

    res.status(201).json({ success: true, message: 'Transaction added successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Something went wrong', error: err.message });
  }
});

// GET /api/transactions/:userId — Get transactions by userId
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const transactions = await Transaction.find({ userId }).sort({ date: -1 });

    res.json(transactions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
