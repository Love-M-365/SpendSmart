const express = require('express');
const router = express.Router();
const userController = require('../controllers/userControllers');

router.get('/', userController.getAllUsers);
router.post('/:userId/add-friend', userController.addFriend);
// Backend route to get user's friends
router.get('/:userId/friends', userController.getUserFriends);
  
module.exports = router;
