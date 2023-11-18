require('dotenv').config();
const cors=require('cors');
const express =require("express")
const path=require('path');
const httpStatusText=require('./utilies/httpStatusText');
const app=express();

app.use("/uploads",express.static(path.join(__dirname,'uploads')))
const mongoose=require('mongoose');
console.log("url",process.env.MONGO_URL);
const url=process.env.MONGO_URL;
const userRouter=require('./routes/users.route');
mongoose.connect(url).then(()=>{
    console.log('MongoDB Connected Successfully!');
})


app.use(cors());
app.use(express.json());
// CRUD Operations (Create,Read,Update,Delete)'
const coursesRouter=require('./routes/courses.route');
app.use('/api/courses',coursesRouter);
app.use('/api/users',userRouter);
// Global Middleware for not found router
app.all('*',(req,res,next)=>{
    res.status(404).json({status:httpStatusText.ERROR,message:'This Resource is not available!'});
})

// Global Error Handler
app.use((error,req,res,next)=>{
    res.status(error.statusCode || 400).json({status:error.statusText || httpStatusText.ERROR,message:error.message,code:error.statusCode || 400,data:null});
})
app.listen(process.env.PORT||5000,()=>{
    console.log('listening in port 5000');
});