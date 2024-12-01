// handle router

const express = require('express')
const userCreation=require('./userController')

const router=express.Router()

router.post('/signup',userCreation.registerUser)
router.post('/login',userCreation.loginUser)

module.exports=router