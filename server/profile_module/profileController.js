const express = require('express');
const mongoose = require('mongoose');
const User = require('../user_module/userSchema');
const Profile = require('./profileSchema');
const multer = require('multer');
// we need path to get the file extension
const path = require('path');
const { profile } = require('console');
// edit/create my profile

const updateProfile = async (req, res) => {
    // Assuming userId is passed in the params
    const userId = req.params.userId;
   const { firstName, lastName, birthday, city } = req.body;
    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    // fields to update
    const fieldsToUpdate = {};
    if (firstName) fieldsToUpdate.firstName = firstName;
    if (lastName) fieldsToUpdate.lastName = lastName;
    if (birthday) fieldsToUpdate.birthday = birthday;
    if (city) fieldsToUpdate.city = city;
    // Handle profilePhoto and coverPhoto if they exist in req.files
     // Handle profile photo if uploaded
     if (req.files && req.files['profilePhoto']) {
        const profilePhotoPath = path.join('uploads', req.files['profilePhoto'][0].filename);
        // Construct the full URL and ensure it uses forward slashes
        const fullProfilePhotoUrl = `${req.protocol}://${req.get('host')}/${profilePhotoPath}`.replace(/\\/g, '/');
        fieldsToUpdate.profilePhoto = fullProfilePhotoUrl;
    }

    // Handle cover photo if uploaded
    if (req.files && req.files['coverPhoto']) {
        const coverPhotoPath = path.join('uploads', req.files['coverPhoto'][0].filename);
        const fullCoverPhotoUrl = `${req.protocol}://${req.get('host')}/${coverPhotoPath}`.replace(/\\/g, '/');
        fieldsToUpdate.coverPhoto = fullCoverPhotoUrl;
    }
    try {
        const updatedProfile = await Profile.findOneAndUpdate(
            { userId: userId },
            { $set: fieldsToUpdate },
            { new: true, upsert: true }
        );
        return res.status(200).json({ message: 'User Profile Updated Successfully', profile: updatedProfile });
    } catch (error) {
        console.log('Error:', error.message);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

    const myProfileData=async(req,res)=>{
        const userId = req.params.userId;
    
        try {
            const myProfile=await Profile.findOne({userId}).populate('friends','firstName lastName profilePhoto')
            
            return res.status(201).json({message:'User Profile fetched Successfully',myProfile})
        } catch (error) {
            return res.status(500).json({message:'Failed to fetch user details'})
        }
        
    }

const viewAllProfile=async(req,res)=>{
    const myLoginId = req.headers['authorization']?.split(' ')[1]; 
    
    
    try {
        const allProfiles=await Profile.find()
        const filteredProfiles = allProfiles.filter(profile => profile.userId.toString() !== myLoginId);

        return res.status(200).json({
            message: 'All profiles fetched successfully',
            allProfiles: filteredProfiles
        });
    } catch (error) {
        console.error(error); 
        return res.status(500).json({
            message: 'Failed to fetch user details',
            error: error.message 
        });
    }
}

const viewProfile=async(req,res)=>{
    
    const {userId} = req.params;
    try {
        const myProfile=await Profile.findOne({_id:userId})
        
        return res.status(201).json({message:'User Profile fetched Successfully',myProfile})
    } catch (error) {
        console.log('errr',error.message)
        return res.status(500).json({message:'Failed to fetch user details'})
    }
    
}

const visitProfile=async(req,res)=>{
    const {profileId}=req.params
    // console.log(`profile id ${profileId}`)
    try {
        const profile=await Profile.findOne({_id:profileId})
        // console.log('profile for visitor',profile)
        return res.status(200).json({message:'User Profile fetched Successfully',profile})
    } catch (error) {
        return res.status(500).json({message:'Failed to fetch user details'})
    }
}



module.exports = { updateProfile,myProfileData,viewAllProfile,viewProfile,visitProfile};
