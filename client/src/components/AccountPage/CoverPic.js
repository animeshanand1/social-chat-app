import React from 'react'

const CoverPic = ({className}) => {
    return (
        <div className={`${className}`}>
          <img src="cover-photo-url" alt="Cover" className={`${className}__image`} />
          {/* Optional Edit button */}
        </div>
      );
}

export default CoverPic