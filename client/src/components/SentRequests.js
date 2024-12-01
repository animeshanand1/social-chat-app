import React, { useEffect, useState } from "react";
import axios from "axios";

const SentRequests = () => {
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const senderId=localStorage.getItem('profileId')
  useEffect(() => {
    // Fetch sent requests
    const fetchSentRequests = async () => {
      try {
        const response=await axios.get(`http://localhost:5000/api/friend-requests/sent/${senderId}`)
        // console.log('response from sent req',response.data.requests)
        setSentRequests(response.data.requests);
        console.log('sentRequests',sentRequests);
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSentRequests();
  }, [senderId]);

  const cancelRequest = async (requestId) => {
    console.log('Request ID to cancel:', requestId); // Debugging log
    try {
      const response = await axios.delete(`http://localhost:5000/api/friend-requests/cancel/${requestId}`);
      console.log('Server response:', response.data); // Debugging log
  
      // Remove the canceled request from the UI
      setSentRequests(sentRequests.filter((req) => req._id !== requestId));
    } catch (err) {
      console.error('Error canceling request:', err.message);
      alert('Failed to cancel request.');
    }
  };
  

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="sent-requests">
      <h2 style={{color:'green'}}>Sent Requests</h2>
      {sentRequests.length > 0 ? (
        <ul>
          {sentRequests.map((request) => (
            <li key={request._id} className="sent-requests__item">
              <h5>{request.receiver.firstName + ' '+request.receiver.lastName}</h5>
              <img src={request.receiver.profilePhoto} style={{height:'60px',borderRadius:'20%'}}></img>
              <button
                className="sent-requests__cancel-btn"
                onClick={() => cancelRequest(request._id)}
              >
                Cancel
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No sent requests</p>
      )}
    </div>
  );
};

export default SentRequests;
