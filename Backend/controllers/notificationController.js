const Notification = require('../models/Notification');

// Create a new notification
const createNotification = async (req, res) => {
  try {
    const { user, person, status, amount } = req.body;

    if (!user || !person || !status || !amount) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newNotification = new Notification({
      user,      // receiver
      person,    // sender
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

// Get all notifications
const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find()
      .populate('user', 'name email')
      .populate('person', 'name email');

    res.status(200).json(notifications);
  } catch (err) {
    console.error('Error fetching notifications:', err);
    res.status(500).json({ message: 'Failed to fetch notifications' });
  }
};

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

module.exports = {
  createNotification,
  getAllNotifications,
  deleteNotification
};
