const express=require('express');
const router=express.Router();
const {body}=require('express-validator');

const verifyToken=require('../middleware/verifyToken');
const courseController=require('../controllers/courses.controller');
const allowedTo = require('../middleware/allowedTo');
const userRoles = require('../utilies/userRoles');

// Get all Courses and Add New Course
const myArray=[1,2,3,4];
router.route('/')
        .get(courseController.getAllCourses)
        .post(verifyToken,[
            body('title')
                .notEmpty()
                .withMessage("Title is Required!")
                .isLength({min:3}).withMessage("Title at least 3 chars"),
            body('price').notEmpty().withMessage("Price is Required")
        ],allowedTo(userRoles.MANAGER),courseController.addCourse);
router.get('/germanboy',(req,res)=>{
    res.json({"Hi":"Welcome Back Germanboy 13:)"});
});
        // Get Single Course & Update Course & Delete Course
router.route('/:courseId')
        .get(courseController.getCourse)
        .patch(courseController.updateCourse)
        .delete(verifyToken,allowedTo(userRoles.ADMIN,userRoles.MANAGER), courseController.deleteCourse);

module.exports=router;