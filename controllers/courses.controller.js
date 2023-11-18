// let {courses}=require('../data/courses');
const {validationResult}=require('express-validator');
const Course=require('../models/course.model');
const httpStatusText=require('../utilies/httpStatusText');
const asyncWrapper = require('../middleware/asyncWrapper');
const appError=require('../utilies/appError');
const getAllCourses=asyncWrapper(async(req,res)=>{
        // get all courses from DB useing Course Model
        const query=req.query;
        
        const limit=query.limit || 10;
        const page=query.page || 1;
        const skip=(page-1)*limit;
        //          (3-1)*2=4 ->page 3 skip 4 when Limit 2
        const courses=await Course.find({},{"__v":false}).limit(limit).skip(skip);
        res.json( {status:httpStatusText.SUCCESS,data:{courses}});
        console.log(courses);
})
const getCourse=asyncWrapper(
    async(req,res,next)=>{
        const course=await Course.findById(req.params.courseId);
            if(!course){
                const error= appError.create("Not Found Course",404,httpStatusText.FAIL)
                return next(error);
                // return res.status(404).json({status:httpStatusText.FAIL,data:{course:"course Not Found!"}});
            }
            return res.json({status:httpStatusText.SUCCESS,data:{course}});
        }); 
    // const courseId=+req.params.courseId;
    // const course=courses.find((course)=>course.id===courseId);
    // try{
        
    // }catch(err){
    //     return res.status(400).json({status:httpStatusText.ERROR,data:null,message:err.message,code:400});
    // }
    

const addCourse=asyncWrapper(async (req,res,next)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        const error=appError.create(errors.array(),400,httpStatusText.FAIL);
      
        return next(error);
      
    }
    const newCourse=new Course(req.body);
    await newCourse.save();
    res.status(201).json({status:httpStatusText.SUCCESS,data:{course:newCourse}});
    // console.log(errors);
    // if(!req.body.title){
    //     return res.status(400).json({error:"title Not Provided"});
    // }
    // if(!req.body.price){
    //     return res.status(400).json({error:"price Not Provided"});
    // }
    //  const course={id:courses.length+1,...req.body}
    // courses.push(course);
   
})
const updateCourse=asyncWrapper(async (req,res)=>{
    const coursId=req.params.courseId;
    // const courseId=+req.params.courseId;
    // let course=courses.find((course)=>course.id===courseId);
    // if(!course){
    //     return res.status(404).json({msg:'course not found!'});
    // }
        const updateCourse= await Course.updateOne({_id:coursId},{$set:{...req.body}})
        return res.status(200).json({status:httpStatusText.SUCCESS,data:{course:updateCourse}});  
})
const deleteCourse= asyncWrapper(async (req,res)=>{
    
        await Course.deleteOne({_id: req.params.courseId});
         res.status(200).json({status:httpStatusText.SUCCESS,data:null});
    // const courseId=+req.params.courseId;
    // courses=courses.filter((course)=>course.id !== courseId);
    
})

module.exports={
 getAllCourses,getCourse,addCourse,updateCourse,deleteCourse
}