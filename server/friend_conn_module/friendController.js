const FriendRequest = require('./friendsSchema');
const Profile = require('../profile_module/profileSchema');
const User=require('../user_module/userSchema')
const mongoose = require('mongoose');


const sendFriendRequest=async(req,res)=>{
    const {senderId,receiverId}=req.body;
    try{
        const sender=await Profile.findOne({_id:senderId});
        const receiverProfile=await Profile.findOne({_id:receiverId});
       
        if(!sender || !receiverProfile){
            return res.status(404).json({message:'Profile not found'});
        }
        const request=new FriendRequest({
            sender:senderId,
            receiver:receiverProfile
        });
        await request.save();
        
        return res.status(201).json({
          message: 'Friend request sent',
          request,
          receiverProfile: {
              firstName: receiverProfile.firstName,
              lastName: receiverProfile.lastName,
              profilePhoto: receiverProfile.profilePhoto,
              userId: receiverProfile.userId,
          }
      });
    }catch(err){
        console.error(err);
        return res.status(500).json({message:'Internal server error'});
    }
}

const getSentFriendRequests=async(req,res)=>{
  const {senderId}=req.params;
  try {
    const getRequests=await FriendRequest.find({sender:senderId}).populate('receiver','firstName lastName profilePhoto userId').where('status').equals('pending');

    return res.status(200).json({message:'Sent friend requests',requests:getRequests});
  } catch (error) {
    return res.status(500).json({message:'Internal server error'});
  }
}

// cancel sent request
const deleteFriendRequest = async (req, res) => {
  const { requestId } = req.params;
  console.log(`Request ID received: ${requestId}`);

  try {
    const request = await FriendRequest.findOneAndDelete({ _id: requestId });

    if (!request) {
      return res.status(404).json({ message: 'Friend request not found' });
    }

    return res.status(200).json({ message: 'Cancelled friend request successfully' });
  } catch (error) {
    console.error('Error deleting friend request:', error.message);
    return res.status(500).json({ message: 'Failed to cancel friend request' });
  }
};


// either accept or reject incoming request
const respondToFriendRequest = async (req, res) => {
  const { requestId } = req.params;
  const { action } = req.body;
  console.log(`requestId:${requestId} and action:${action}`)
  if (!requestId || !action) {
    return res.status(400).json({ message: 'Request ID and action are required' });
  }

  console.log(`Responding to friend request with ID: ${requestId}, Action: ${action}`);

  try {
    const request = await FriendRequest.findById(requestId);

    if (!request) {
      console.log(`Friend request with ID ${requestId} not found`);
      return res.status(404).json({ message: 'Friend request not found' });
    }

    if (action === 'accept') {
      // Add logic to accept the friend request (e.g., update friends list)
      request.status = 'accepted';
      console.log(`Friend request with ID ${requestId} accepted`);
      await addFriend(request.sender, request.receiver);
    } else if (action === 'reject') {
      request.status='rejected'
      console.log(`Friend request with ID ${requestId} declined`);
    } else {
      return res.status(400).json({ message: 'Invalid action' });
    }

    await request.deleteOne();

    return res.status(200).json({ message: `Friend request ${action}ed successfully` });
  } catch (error) {
    console.error('Error responding to friend request:', error.message);
    return res.status(500).json({ message: 'Failed to respond to friend request' });
  }
};



// fetch request
const getFriendRequests = async (req, res) => {
  const { userId } = req.params;

  try {
    // Fetch friend requests and populate sender's profile information
    const friendRequests = await FriendRequest.find({ receiver: userId })
      .populate('sender', 'userId firstName lastName profilePhoto') // Populate fields from the Profile model
      .exec();

    // Check if friendRequests are populated correctly
    if (!friendRequests.length) {
      return res.status(404).json({ message: "No friend requests found." });
    }

    // Format the response to include necessary sender information
    const formattedRequests = friendRequests.map(request => ({
      _id: request._id,
      sender: {
        userId: request.sender.userId, // Accessing the populated userId
        firstName: request.sender.firstName || 'Unknown', // Fallback for null values
        lastName: request.sender.lastName || 'Unknown',
        profilePhoto: request.sender.profilePhoto || 'default.jpg', // Fallback for missing photos
      },
      receiver: request.receiver,
      status: request.status,
      createdAt: request.createdAt,
      updatedAt: request.updatedAt,
    }));

    res.status(200).json({ friendRequests: formattedRequests });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
// accept friend
const addFriend = async (senderId, receiverId) => {
  console.log(`received request from ${senderId} to receiver:${receiverId}`)
  try {
    // Add each user to the other's friends list
    await Profile.findByIdAndUpdate(senderId, { $addToSet: { friends: receiverId } });
    await Profile.findByIdAndUpdate(receiverId, { $addToSet: { friends: senderId } });

    console.log(`Users ${senderId} and ${receiverId} are now friends`);
  } catch (error) {
    console.error('Error adding friends:', error.message);
    throw new Error('Failed to add friends');
  }
};

// remove friend
const removeFriend = async (req, res) => {
  const { senderId, receiverId } = req.params;

  try {
    // Remove each user from the other's friends list
    await Profile.findByIdAndUpdate(senderId, { $pull: { friends: receiverId } });
    await Profile.findByIdAndUpdate(receiverId, { $pull: { friends: senderId } });

    console.log(`Users ${senderId} and ${receiverId} are no longer friends`);
  } catch (error) {
    console.error('Error removing friends:', error.message);
    throw new Error('Failed to remove friends');
  }
};

module.exports={sendFriendRequest,getSentFriendRequests,deleteFriendRequest,respondToFriendRequest,getFriendRequests,removeFriend}