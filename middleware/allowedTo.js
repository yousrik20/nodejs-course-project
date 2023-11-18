const appError = require("../utilies/appError");

module.exports=(...roles)=>{
    console.log('roles',roles);
    return(req,res,next)=>{
        if(!roles.includes(req.currentUser.role)){
            return next(appError.create('this role is not authorized',401))
        }   
        next();
    }
}