const mongoose =require('mongoose');
const validator=require('validator');
const userRoles = require('../utilies/userRoles');

const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true,

    },
    email:{
        type:String,
        unique:true,
        required:true,
        validate:[validator.isEmail,'field must be a valid Email Address']
    },
    password:{
        type:String,
        required:true
    },
    token:{
        type:String
    },
    role:{
        type:String,// ["USER","ADMIN","MANAGER"]
        enum:[userRoles.USER,userRoles.ADMIN,userRoles.MANAGER],
        default:userRoles.USER

    },
    avatar:{
        type:String,
        default:'uploads/profile.jpg'
    }
})

module.exports=mongoose.model('User',userSchema);
