const User=require('../models/user.model');
const asyncWrapper = require('../middleware/asyncWrapper');
const httpStatusText=require('../utilies/httpStatusText');
const appError=require('../utilies/appError');
const bcrypt=require("bcryptjs");
const jwt=require('jsonwebtoken');
const generateJWT = require('../utilies/generateJWT');
const getAllUsers=asyncWrapper(async(req,res)=>{
    console.log(req.headers);
    // get all courses from DB useing Course Model
    const query=req.query;
    
    const limit=query.limit || 10;
    const page=query.page || 1;
    const skip=(page-1)*limit;
    //          (3-1)*2=4 ->page 3 skip 4 when Limit 2
    const users=await User.find({},{"__v":false,"password":false}).limit(limit).skip(skip);
    res.json( {status:httpStatusText.SUCCESS,data:{users}});
})

const register=asyncWrapper(async(req,res,next)=>{
    console.log(req.body);
    const {firstName,lastName,email,password,role}=req.body;
    const oldUser= await User.findOne({email});
    if(oldUser){
        const error= appError.create("user already Exists",404,httpStatusText.FAIL)
                return next(error);
    }
    // password Hashing
    const hashedPassword= await bcrypt.hash(password,10)
    const newUser=new User({
        firstName,
        lastName,
        email,
        password:hashedPassword,
        role,
        avatar:req.file.filename
    });
    // generate Toke JWT
    const token=await generateJWT({email:newUser.email,id:newUser._id,role:newUser.role});
    newUser.token=token;
    await newUser.save();
    res.status(201).json({status:httpStatusText.SUCCESS,data:{user:newUser}});
})

const login = asyncWrapper(async(req,res,next)=>{
    const {email,password}=req.body; 
    if(!email && !password){
        const error= appError.create("Email and Password are required",404,httpStatusText.FAIL)
                return next(error);
    } 
    const user= await User.findOne({email:email});
    if(!user){
        const error= appError.create("User Not Found",400,httpStatusText.FAIL)
                return next(error);
    }
    const matchedPassword=await bcrypt.compare(password,user.password);
    
    if(user && matchedPassword){
        // logged In Successfully
        const token=await generateJWT({email:user.email,id:user._id,role:user.role});
        return res.json({status:httpStatusText.SUCCESS,data:{token}})
    }else{
        const error= appError.create("something wrong",404,httpStatusText.ERROR)
                return next(error);
    }
})

module.exports={
    getAllUsers,
    register,
    login
}