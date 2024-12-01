import React from 'react'

const ProfilePic = ({className}) => {
    return (
        <div className={`${className}`}>
          <img src="profile-photo-url" alt="Profile" className={`${className}__image`} />
          {/* Optional Edit button */}
        </div>
    );
}

export default ProfilePic