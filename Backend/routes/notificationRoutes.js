const express = require('express');

const router = express.Router();


const Notification = require('../models/Notification'); // ✅ correct path

router.get('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    const notifications = await Notification.find({ user: userId })
      .populate('user', 'name')
      .populate('person', 'name')
      .sort({ timestamp: -1 });

    const formatted = notifications.map(n => {
      const personName = n.person?.name || 'Someone';
      let message = '';

      if (n.status === 'owed') {
        message = `💸 You owe ₹${n.amount} to ${personName}`;
      } else if (n.status === 'due') {
        message = `💰 ${personName} owes you ₹${n.amount}`;
      } else if (n.status === 'paid') {
        message = `✅ ₹${n.amount} settled with ${personName}`;
      }

      return { ...n._doc, message };
    });

    res.json({ notifications: formatted });
  } catch (error) {
    console.error('❌ Notification fetch error:', error.message);
    res.status(500).json({ error: 'Server error while fetching notifications' });
  }
});


const {
  getAllNotifications,
  deleteNotification,
  createNotification
} = require('../controllers/notificationController');

// Example Express routes
router.get('/api/notifications/:userId', getAllNotifications);
router.delete('/api/notifications/delete/:id', deleteNotification);

// POST a new notification (optional)
router.post('/', createNotification);
// GET /api/notifications



module.exports = router;
