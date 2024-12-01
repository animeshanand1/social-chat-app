import React, { useEffect,useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const ProfileCard = () => {
  const [allProfile,setAllProfile]=useState([])
  const myLoginId = localStorage.getItem('userId');
  useEffect(()=>{
    const fetchAllUsers=async()=>{
      try {
        const response = await axios.get('http://localhost:5000/profile/allUsers', {
          headers: {
              'Authorization': `Bearer ${myLoginId}` 
          }
      });

        setAllProfile(response.data.allProfiles);
    } catch (error) {
        console.error('Error fetching all users:', error);
    }
      
    }
    fetchAllUsers()
  },[])
  const sendRequest = async (receiverId) => {
    const senderId = localStorage.getItem('profileId');
    console.log('senderId',senderId)
    console.log('receiverId',receiverId)
  
    try {
      const response = await axios.post('http://localhost:5000/api/friend-requests/send', {
        senderId,
        receiverId,
      });
      console.log('f req',response)
      console.log(response.data.message); 
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };
  return (
    <div>
     {
        allProfile?.map((profile,index)=>(
          <div className="profile-card" style={{ backgroundImage: `url(${profile.profilePhoto})`,backgroundSize:'cover' }} key={index}>
            <div className="profile-card-content">
            <h5 className="profile-name">{profile.firstName} {profile.lastName}</h5>
            <p className="profile-details" style={{fontSize:"14px"}}>{profile.city}</p>
            <button className="friend-request-button" style={{fontSize:'11px'}} onClick={() => sendRequest(profile._id)}>
              <FontAwesomeIcon icon={faUserPlus} style={{fontSize:'0.75rem'}} /> Add Friend
            </button>
          </div>
          </div>
        ))
     }
    </div>
   
  );
};

export default ProfileCard;
