const express = require('express');
const router = express.Router();
const friendRequestController = require('./friendController');

router.post('/send', friendRequestController.sendFriendRequest);
router.get('/incoming-request/:userId', friendRequestController.getFriendRequests );
router.put('/respond/:requestId', friendRequestController.respondToFriendRequest);
// router to delete a friend (existing)
router.delete('/friends/:senderId/:receiverId', friendRequestController.removeFriend);
// router.get('/:profileId', friendRequestController.getFriendRequests);
router.delete('/cancel/:requestId', friendRequestController.deleteFriendRequest);
router.get('/sent/:senderId', friendRequestController.getSentFriendRequests);

module.exports = router;
