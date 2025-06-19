const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Add a friend
exports.addFriend = async (req, res) => {
  const { userId } = req.params;
  const { friendId } = req.body;

  try {
    await User.findByIdAndUpdate(userId, {
      $addToSet: { friends: friendId }
    });

    res.json({ message: 'Friend added successfully!' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add friend' });
  }
};
exports.getUserFriends = async (req, res) => {
    const { userId } = req.params;
  
    try {
      // Find user by ID and populate their friends list
      const user = await User.findById(userId).populate('friends', 'name email');
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Send the user's friends list
      res.json(user.friends);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch friends' });
    }
  };
  
  