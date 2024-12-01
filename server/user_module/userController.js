// user controller
const mongoose=require('mongoose')
const User=require('./userSchema')
const  jwt = require('jsonwebtoken');
const Profile=require('../profile_module/profileSchema')
const bcrypt = require('bcryptjs');
// register user
const registerUser = async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(401).json({ message: 'Email already in use' });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ name, email, password: hashedPassword });

        const newProfile = await Profile.create({
            userId: newUser._id,
            firstName: name|| 'User', 
        });

        return res.status(201).json({ message: 'User Created', newUser, newProfile });

    } catch (error) {
        console.error('Error:', error.message);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};


// login user

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Check if the user exists
        const isUser = await User.findOne({ email });
        if (!isUser) {
            console.log('Error: not a valid user');
            return res.status(401).json({ message: 'Invalid credentials not a valid user' });
        }

        // Validate password
        const isMatch = await bcrypt.compare(password, isUser.password);
        if (!isMatch) {
            console.error('Error: Incorrect Password');
            return res.status(401).json({ message: 'Incorrect Password' });
        }

        console.log('User data:', isUser);

        let profile = await Profile.findOne({ userId: isUser._id });
        if (!profile) {
            profile = new Profile({
                userId: isUser._id,
                firstName: 'User', 
                lastName: '',
                birthday: null, 
                city: '',
                profilePhoto: null, 
                coverPhoto: null, 
                friends: [] 
            });
            await profile.save();
        }

        let fullName = `${profile.firstName} ${profile.lastName || ''}`.trim();

        //  token with full name
        const token = jwt.sign(
            { id: isUser._id, email: isUser.email, name: fullName,profileId: profile._id },
            'secretkey',
            { expiresIn: '1hr' }
        );

        res.status(200).json({ token });
    } catch (error) {
        console.error('Error during login:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports={registerUser,loginUser}