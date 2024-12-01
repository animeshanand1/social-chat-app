import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';

const VisitProfile = () => {
    const {id}=useParams()
    const [profileData,setProfileData]=useState([])
    console.log(id,"idsd")

    useEffect(()=>{
        const showProfileDetailds=async()=>{
            try {
                const response=await axios.get(`http://localhost:5000/profile/visitProfile/${id}`)
                console.log('response visit profile',response.data)
                setProfileData(response.data.profile)
                console.log('profile',profileData)
            } catch (error) {
                console.log(error.message)
            }
        }
        showProfileDetailds()
    },[])
  return (
    <div className="userProfile">
      {/* Left Section */}
      <div className="userProfile-left">
        <div className="userProfile-left-frame">
          <img
            src={profileData.coverPhoto || 'Preview.jpg'}
            alt="Cover"
            className="userProfile-left-frame-cover"
          />
          <div className="userProfile-left-frame-profile">
            <img
              src={profileData.profilePhoto || 'Preview.jpg'}
              alt="Profile"
              className="userProfile-left-frame-profile-pic"
            />
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="userProfile-right">
        {/* User Info */}
        <div className="userProfile-right-info">
          <h2 className="userProfile-right-info-name" style={{textTransform:'capitalize'}}>{profileData.firstName+ " "+profileData.lastName}</h2>
          <div className="userProfile-right-info-stats">
            <p className="userProfile-right-info-stats-item">
              <strong>500</strong> Followers
            </p>
            <p className="userProfile-right-info-stats-item">
              <strong>City:</strong><span style={{color:'red',marginLeft:'5px' ,textTransform:'capitalize',fontWeight:'600'}}>{profileData.city}</span>
            </p>
            <p className="userProfile-right-info-stats-item">
              <strong>300</strong> Following
            </p>
          </div>
        </div>

        {/* Gallery */}
        <div className="userProfile-right-gallery">
          <h3 className="userProfile-right-gallery-title">Gallery</h3>
          <div className="userProfile-right-gallery-grid">
            {/* Map through uploaded pictures */}
            {[1, 2, 3, 4].map((img, index) => (
              <img
                key={index}
                src={`image-url-${index}`}
                alt={`Gallery Item ${index}`}
                className="userProfile-right-gallery-grid-item"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VisitProfile