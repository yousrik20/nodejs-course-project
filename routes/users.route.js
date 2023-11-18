const express=require('express');
const router=express.Router();
const userController=require('../controllers/users.controller');
const verifyToken=require('../middleware/verifyToken');
const multer  = require('multer');
const appError = require('../utilies/appError');
const diskStorage=multer.diskStorage({
        destination:function(req,file,cb){
                console.log("file",file);
                cb(null,'uploads');
        },
        filename:function(req,file,cb){
                const ext=file.mimetype.split('/')[1];
                const fileName=`user-${Date.now()}.${ext}`;
                cb(null,fileName);
        }
})
const fileFilter=(req,file,cb)=>{
        const imageType=file.mimetype.split('/')[0];
        if(imageType==='image'){
                return cb(null,true);
        }else{
                return cb(appError.create('File Type Not Allowed',400),false);
        }
}
const upload = multer({ storage:diskStorage,
                        fileFilter:fileFilter})
// Get all Users

// Register

// Login
router.route('/')
        .get(verifyToken, userController.getAllUsers)

router.route('/register')
        .post(upload.single('avatar'), userController.register)
        
router.route('/login')
        .post(userController.login)

module.exports=router;