// BasicDetails.js
import React, { useState } from 'react';

const BasicDetails = ({ className }) => {
  const [details, setDetails] = useState({
    name: 'Your Name',
    dob: 'YYYY-MM-DD',
    city: 'Your City'
  });

  const handleChange = (field, value) => {
    setDetails(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className={`${className}`}>
      <div className={`${className}__field`}>
        <label>Name:</label>
        <input
          type="text"
          value={details.name}
          onChange={(e) => handleChange('name', e.target.value)}
        />
      </div>
      <div className={`${className}__field`}>
        <label>DOB:</label>
        <input
          type="date"
          value={details.dob}
          onChange={(e) => handleChange('dob', e.target.value)}
        />
      </div>
      <div className={`${className}__field`}>
        <label>City:</label>
        <input
          type="text"
          value={details.city}
          onChange={(e) => handleChange('city', e.target.value)}
        />
      </div>
    </div>
  );
};

export default BasicDetails;
