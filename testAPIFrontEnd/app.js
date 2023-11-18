fetch("http://localhost:5000/api/courses/?limit=2&page=3").then((res)=>res.json()).then((data)=>{
    console.log(data);
})