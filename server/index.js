// express configuration
const express=require('express');
const connectDB=require('./configuration/db');
const CORS=require('cors');
const mongoose=require('mongoose');
const bodyParser=require('body-parser');
const profileRoutes=require('./profile_module/routes')
const userRoutes=require('./user_module/routes')
const path = require('path'); 
const User=require('./user_module/userSchema')
const Profile=require('./profile_module/profileSchema')
const {Server}=require('socket.io');
const http=require('http');
const Message=require('./messaage_module/messageSchema')
const friendRequestRoutes = require('./friend_conn_module/friendsRoutes'); 

const app=express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(CORS())
const PORT=process.env.PORT || 5000;

const server=http.createServer(app);
const io=new Server(server,{
    cors:{
        origin:'*',
    }
})


io.on('connection', (socket) => {
    console.log('New connection for socket:',socket.id);
    socket.on('joinRoom', (conversationId) => {
        socket.join(conversationId);
        console.log(`Room joined: ${conversationId}`);
    });

    socket.on('communicate', ({ conversationId, textMessage }) => {
        console.log('Sender message:', textMessage);
        io.to(conversationId).emit('message', textMessage);
        console.log('Message sent to room:', conversationId);
    });

});

connectDB();
app.post('/chat/message',async(req,res)=>{
    try {
        const { sender, receiver, content } = req.body;
        const conversationId = [sender, receiver].sort().join('_');

        console.log(`Sender: ${sender}, Receiver: ${receiver}`);
        console.log('Received message:', req.body);

        let conversation = await Message.findOne({ conversationId });

        if (conversation) {
            conversation.messages.push({ sender, receiver, content });
        } else {
            conversation = new Message({
                conversationId,
                messages: [{ sender, receiver, content }]
            });
        }
        await conversation.save();

        res.status(201).json(conversation);
    } catch (error) {
        console.error('Error handling message:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})
app.get('/chat/received/messages/:conversationId',async(req,res)=>{
    const { conversationId } = req.params;
    // console.log(`conversationId ${conversationId}`)
    const messages=await Message.find({conversationId});
    res.status(200).json(messages);
})
app.use('/account',userRoutes) 
app.use('/api/friend-requests',friendRequestRoutes) 


// Use the profile routes
app.use('/profile', profileRoutes);
// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));
app.get('/',(req,res)=>{
    return res.sendFile('/public/index.html')
})
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

