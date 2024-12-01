import React from "react";
import FriendRequests from "../../FriendRequest";
import FriendsList from "../../FriendList";
import SentRequests from "../../SentRequests";
const FriendsPage = () => {
    
  return (
    <div className="friends-page">
      <div className="friends-page__left">
        <FriendRequests/>
      </div>
      <div className="friends-page__middle">
        <FriendsList/>
      </div>
      <div className="friends-page__right">
        <SentRequests/>
      </div>
    </div>
  );
};

export default FriendsPage;

