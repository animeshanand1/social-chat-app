import React,{useEffect,useState} from "react";
import { useNavigate } from "react-router-dom";
import { fetchProfile } from "../store/profileSlice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

const FriendsList = () => {
  const [showModal, setShowModal] = useState(false);
  const [friendList,setFriendList]=useState([])
  const dispatch=useDispatch()
  const navigate=useNavigate()
  const { data: Profile, status, error } = useSelector((state) => state.profile)
  
  useEffect(() => {
        
    dispatch(fetchProfile())
}, [])
useEffect(() => {
  if (Profile?.myProfile?.friends) {
    setFriendList(Profile.myProfile.friends);
    // console.log('friends',Profile.myProfile.friends[0]._id)
  }
}, [Profile]); 

if (status === "loading") {
    console.log('loading')
    return <p>Loading...</p>;
}

if (error) {
    console.log('wrong')
    return <p>Error: {error}</p>;
}
if (!Profile.myProfile) {
    console.log('not loaded')
}
const manageChat=(receiptId)=>{
  console.log(`Navigating to chat with receipt ID: ${receiptId}`);
    navigate(`/message/${receiptId}`);
}
const removeFriend = async (receiverId) => {
  const senderId = Profile.myProfile._id;

  try {
      const response = await axios.delete(
          `http://localhost:5000/api/friend-requests/friends/${senderId}/${receiverId}`
      );
      setFriendList((prevList) => prevList.filter(friend => friend._id !== receiverId));
    
  } catch (error) {
      console.error('Error removing friend:', error.response?.data || error.message);
      alert('Failed to remove friend. Please try again.');
  }
};

  return (
    <div className="friends-list">
      <h2 style={{color:'lightseagreen'}}>My Friends</h2>
      <div className="friends-list__cards">
        {friendList.map((friend, i) => (
          <div key={i} className="friends-list__card">
            <h5 style={{textTransform:'capitalize'}}>{friend.firstName+' '+friend.lastName}</h5>
            <img style={{height:'70px',borderRadius:'50%'}} src={friend.profilePhoto} alt="avatar"/>
            <button className="friends-list__chat-btn" onClick={()=>manageChat(friend._id)}>Chat</button>
            <button className="friends-list__remove-btn" onClick={()=>removeFriend(friend._id)}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FriendsList;
