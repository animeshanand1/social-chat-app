const mongoose=require('mongoose');

const MessageSchema = new mongoose.Schema({
    conversationId: { type: String, required: true, unique: true },
    messages: [
        {
            sender: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile', required: true },
            receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile', required: true },
            content: { type: Array, required: true },
            timestamp: { type: Date, default: Date.now }
        }
    ]
});
const Message = mongoose.model('Message', MessageSchema);
module.exports = Message;