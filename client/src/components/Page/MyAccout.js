// AccountPage.js
import React from 'react';
import CoverPic from '../AccountPage/CoverPic';
import ProfilePic from '../AccountPage/ProfilePic';
import BasicDetails from '../AccountPage/BasicDetails';
const AccountPage = () => {
  return (
    <div className="account-page">
      <CoverPic className="account-page__cover-photo" />
      <ProfilePic className="account-page__profile-photo" />
      <BasicDetails className="account-page__basic-details" />
    </div>
  );
};

export default AccountPage;
