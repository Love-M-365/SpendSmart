const Notification = require('../models/Notification');

// Create a new notification
const createNotification = async (req, res) => {
  try {
    const { user, person ,category, status, amount } = req.body;

    if (!user || !person || !status || !category || !amount) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newNotification = new Notification({
      user,      // receiver
      person,    // sender
      category,
      status,
      amount,
      read: false,
      timestamp: new Date()
    });

    await newNotification.save();

    res.status(201).json(newNotification);
  } catch (err) {
    console.error('Error creating notification:', err);
    res.status(500).json({ message: 'An error occurred while creating the notification' });
  }
};


const User = require('../models/User'); 



// Delete a notification by ID
const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Notification.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (err) {
    console.error('Error deleting notification:', err);
    res.status(500).json({ message: 'Failed to delete notification' });
  }
};

const Transaction = require('../models/Transaction');

const { v4: uuidv4 } = require('uuid'); 
const markNotificationPaid = async (req, res) => {
  try {
    const notifId = req.params.id;

    const notification = await Notification.findById(notifId).populate('person', 'name');
    if (!notification) return res.status(404).json({ error: 'Notification not found' });

    if (notification.status === 'paid') {
      return res.status(400).json({ error: 'Already marked as paid' });
    }

    // 1. Update the notification
    notification.status = 'paid';
    await notification.save();

    // 2. Create a negative transaction
    const newTransaction = new Transaction({
      transactionId: uuidv4(),
      userId: notification.user,
      title: `Settlement to ${notification.person?.name || 'Someone'}`,
      category: `${notification.category}`,
      amount: -Math.abs(notification.amount), // ensures it's negative
      type: 'expense',
      paymentMode: 'Wallet', // or any default you use
      paymentTo: notification.person?.name || 'Unknown',
      contributors: [],
    });

    await newTransaction.save();

    res.json({ message: 'Notification marked as paid and transaction created' });
  } catch (err) {
    console.error('Mark Paid Error:', err.message);
    res.status(500).json({ error: 'Failed to mark as paid' });
  }
};

module.exports = {
  deleteNotification,
  createNotification,
  markNotificationPaid
};
