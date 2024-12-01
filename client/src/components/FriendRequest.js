import React, { useEffect, useState } from "react";
import axios from "axios";
const FriendRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const profileId = localStorage.getItem('profileId')
    
    useEffect(() => {
        const incomingRequests = async () => {

            try {
                const response = await axios.get(`http://localhost:5000/api/friend-requests/incoming-request/${profileId}`);
                setRequests(response.data.friendRequests);
                console.log(requests,'req')
            } catch (error) {
                console.error("Error fetching friend requests:", error);
            } finally {
                setLoading(false);
            }
        };

        incomingRequests();
    }, []);
    const handleAccept = async(requestId) => {
       const action='accept'
       console.log(`Accepted friend request: ${requestId}`);
       try {
            const response=await axios.put(`http://localhost:5000/api/friend-requests/respond/${requestId}`,{action})
            console.log('response for accept',response)
       } catch (error) {
            console.log(error.message,'error')
       }
       setRequests(requests.filter((req) => req._id !== requestId))
    };
    const rejectRequest=async(requestId)=>{
        const action='reject'
        console.log('requestId',requestId)
        try {
            const response=await axios.put(`http://localhost:5000/api/friend-requests/respond/${requestId}`,{action})
            console.log('response',response)
       } catch (error) {
            console.log(error.message,'error')
       }
       setRequests(requests.filter((req) => req._id !== requestId))
    }
    

    if (loading) {
        return <div>Loading friend requests...</div>;
    }
    return (
        <div className="friend-requests">
            <h2 style={{ color: 'blue' }}>Friend Requests</h2>
            <ul style={{listStyleType: 'none', padding: 0}}>
                {requests.length > 0 ? (
                    requests.map((request) => (
                        <li key={request.id} className="friend-requests__item">
                            <h4>{request.sender.firstName + ' ' + request.sender.lastName}</h4>
                            <img src={request.sender.profilePhoto} style={{ height: '50px', borderRadius: '50%' }} />

                            <button
                                className="friend-requests__accept-btn"
                                onClick={() => handleAccept(request._id)}
                            >
                                Accept
                            </button>
                            <button
                                className="sent-requests__cancel-btn"
                                onClick={() => rejectRequest(request._id)}
                            >
                                Reject
                            </button>
                        </li>
                    ))
                ) : (
                    <li style={{ }}>No friend requests available.</li>
                )}
            </ul>
        </div>
    );
};

export default FriendRequests;
