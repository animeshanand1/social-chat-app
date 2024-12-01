import React, { useEffect, useState } from "react";
import axios from 'axios';
import socket from '../../socket';
import { useNavigate, useParams } from 'react-router-dom';

const ChatUi = () => {
    const { receiptId } = useParams();
    const [textMessage, setTextMessage] = useState('');
    const [messageQueue, setMessageQueue] = useState([]);
    const navigate = useNavigate();
    const [receivedMessages, setReceivedMessages] = useState([]);
    const [loadingMessages, setLoadingMessages] = useState(true);
    const [error, setError] = useState(null);
    const [receiverProfile, setReceiverProfile] = useState({
        firstName: '',
        lastName: '',
        profilePhoto: '',
    });
    const isLoggedIn = localStorage.getItem('token') ? true : false;
    const senderId = localStorage.getItem('profileId');
    const receiverId = receiptId;

    useEffect(() => {
        if (isLoggedIn) {
            let conversationId = [senderId, receiverId].sort().join('_');
            console.log('Connecting to the server...', conversationId);

            // Connect to socket only once
            socket.connect();
            socket.on('connect', () => {
                socket.emit('joinRoom', conversationId);
                // console.log('Joined Room:', conversationId);
            });

            // Listen for new messages
            const handleMessage = (textMessage) => {
                console.log("New message received:", textMessage);
                setReceivedMessages((prevMessages) => [...prevMessages, textMessage]);
            };

            socket.on("message", handleMessage);

            // Cleanup on unmount
            return () => {
                console.log('Disconnecting from the server...');
                socket.off('message', handleMessage);
                socket.disconnect();
            };
        }
    }, [receiverId, senderId, isLoggedIn]);

    useEffect(() => {
        const fetchMessages = async () => {
            let conversationId = [senderId, receiverId].sort().join('_');

            try {
                setLoadingMessages(true);
                const response = await axios.get(`http://localhost:5000/chat/received/messages/${conversationId}`);
                const newMessages = response.data.flatMap(conversation => 
                    conversation.messages.map(msg => ({
                        ...msg,
                        content: Array.isArray(msg.content) ? msg.content.join(' ') : msg.content || '',
                    }))
                );
                setReceivedMessages(newMessages);
            } catch (error) {
                console.error('Error fetching messages:', error);
                setError(error);
            } finally {
                setLoadingMessages(false);
            }
        };
        fetchMessages();
    }, [senderId, receiverId]);

    useEffect(() => {
        const fetchReceiverProfile = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/profile/getProfile/${receiverId}`);
                setReceiverProfile(response.data.myProfile);
            } catch (error) {
                console.error('Failed to fetch receiver profile:', error);
                setError(error);
            }
        }
        fetchReceiverProfile();
    }, [receiverId]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (messageQueue.length > 0) {
                try {
                    const response = axios.post('http://localhost:5000/chat/message', {
                        sender: senderId,
                        receiver: receiverId,
                        content: messageQueue
                    });

                    setMessageQueue([]);
                } catch (error) {
                    console.error('Error sending messages:', error);
                    alert('Failed to send messages:', error);
                }
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [messageQueue, receiverId, senderId]);

    const visitProfile = async (profileId) => {
        console.log(`you are visiting${profileId}`);
        navigate(`/visitProfile/${profileId}`);
        try {
            const response = await axios.get(`http://localhost:5000/profile/visitProfile/${profileId}`);
            console.log('response after visit profle', response);
        } catch (error) {
            console.log(error);
        }
    }

    const sendMessage = async () => {
        let conversationId = [senderId, receiverId].sort().join('_');
        if (textMessage.trim()) {
            setMessageQueue((prevQueue) => [...prevQueue, textMessage]);
            socket.emit('communicate', { conversationId, textMessage });
            console.log(`sending message ${textMessage}`);
        }
        setTextMessage('');
    };

    return (
        <div className="chatInterface">
            {/* Contacts Sidebar */}
            <div className="chatInterface__sidebar">
                <div className="chatInterface__search">
                    <input
                        type="text"
                        placeholder="Search contacts"
                        className="chatInterface__searchInput"
                    />
                </div>

                <div className="chatInterface__contacts">
                    {[1, 2, 3, 4, 5, 6, 7].map((_, index) => (
                        <div className="chatInterface__contact" key={index}>
                            <div className="chatInterface__contactAvatar">
                                <img src="avatar.jpg" alt="Avatar" />
                                <span className="chatInterface__notificationBadge">3</span>
                            </div>
                            <div className="chatInterface__contactInfo">
                                <div className="chatInterface__contactName">{receiverProfile.firstName + ' ' + receiverProfile.lastName || ''}</div>
                                <div className="chatInterface__messagePreview">
                                    {receivedMessages.length > 0 ? receivedMessages[0].content : 'No messages'}
                                </div>
                            </div>
                            <div className="chatInterface__timeStamp">12:34 PM</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Conversation Area */}
            <div className="chatInterface__conversation">
                <div className="chatInterface__header">
                    <div className="chatInterface__headerAvatar">
                        <img src={receiverProfile.profilePhoto || "avatar.jpg"} alt="Contact" onClick={() => visitProfile(receiverProfile._id)} />
                    </div>
                    <div className="chatInterface__headerInfo">
                        <div className="chatInterface__headerName">{receiverProfile.firstName + ' ' + receiverProfile.lastName || ''}</div>
                    </div>
                    <div className="chatInterface__headerActions">
                        {/* <button className="chatInterface__iconButton">📞</button> */}
                        <button className="chatInterface__iconButton">⋮</button>
                    </div>
                </div>

                {/* Chat Messages display */}
                <div className="chatInterface__messages">
                    {loadingMessages ? (
                        <div>Loading messages...</div>
                    ) : error ? (
                        <div></div>
                    ) : (
                        receivedMessages.map((message, index) => (
                            <div
                                className={`chatInterface__message ${message.sender === senderId ? 'chatInterface__message--outgoing' : 'chatInterface__message--incoming'}`}
                                key={message._id || index}
                            >
                                <strong>{message.sender === senderId ? 'You' : receiverProfile.firstName}</strong>: {message.content}
                            </div>
                        ))
                    )}
                </div>

                {/* Message Input Area */}
                <div className="chatInterface__messageInput">
                    <input
                        type="text"
                        placeholder="Write a message..."
                        className="chatInterface__inputField"
                        value={textMessage}
                        onChange={(e) => setTextMessage(e.target.value)}
                    />
                    <button className="chatInterface__sendButton" onClick={sendMessage}>
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatUi;
