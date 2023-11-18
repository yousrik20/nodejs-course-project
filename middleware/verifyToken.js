const jwt =require('jsonwebtoken');
const httpStatusText=require('../utilies/httpStatusText');
const appError=require('../utilies/appError');
 
const verifyToken=(req,res,next)=>{
    const authHeader=req.headers['Authorization'] || req.headers['authorization'];
    console.log("authheader",authHeader);
    if(!authHeader){
        const error= appError.create("Token Is Required",401,httpStatusText.ERROR)
        return next(error);
    }
    const token=authHeader.split(' ')[1];
    try{
        const currentUser= jwt.verify(token,process.env.JWT_SECRET_KEY);
        req.currentUser=currentUser;
        // req.user=currentUser;
        next();
    }catch(err){
        const error= appError.create("invalid Token",401,httpStatusText.ERROR)
        return next(error);
    }
};

module.exports=verifyToken;