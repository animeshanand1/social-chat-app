const mongoose=require('mongoose');

const ProfileSchema=new mongoose.Schema({
    // reference to the user
    userId: { type:mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String
    },
    birthday: {
        type: Date,
    },
    city: {
        type: String,
        trim: true
    },
    profilePhoto: {
        type: String, 
        default: null 
    },
    coverPhoto: {
        type: String, 
        default: null 
    },
    
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Profile' }]
})

module.exports=mongoose.model('Profile',ProfileSchema);