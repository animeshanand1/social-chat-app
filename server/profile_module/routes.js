const express=require('express')
const profileController=require('./profileController')
const multer=require('multer')
const path=require('path')


// storage engine
const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'uploads/');
    },
    filename:(req,file,cb)=>{
        // filename will be  name of the user followed by the userID first 3 digit and the followed 
        // by the file extension
        cb(null, Date.now() + '-' + file.originalname);
    }
})
// multer upload config
const upload=multer({
    storage:storage,
    limits:{fileSize:1024*1024*5}
})

const router=express.Router()

router.post('/update/:userId',upload.fields([{name:'profilePhoto',maxCount:1},{name:'coverPhoto',maxCount:1}]),profileController.updateProfile)
router.get('/getMyaccount/:userId',profileController.myProfileData)
router.get('/allUsers',profileController.viewAllProfile)
router.get('/getProfile/:userId',profileController.viewProfile)
router.get('/visitProfile/:profileId',profileController.visitProfile)
module.exports=router