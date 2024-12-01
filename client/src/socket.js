import { io } from 'socket.io-client';

const socketUrl = 'http://localhost:5000';
const socket = io(socketUrl, {
  autoConnect: false,
});


export default socket;