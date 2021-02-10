const jwt=require("jsonwebtoken");
const dotenv=require("dotenv");
const mongoose=require("mongoose");
const Users=mongoose.model("Users");
dotenv.config();


module.exports=(req,res,next)=>{
     const {authorization}=req.headers;
     if(!authorization)
     {
         return res.status(401).json({error:"You must logged in To get this"});
     }
     const token=authorization.replace("Bearer ","");
     jwt.verify(token,process.env.JWT_SECRET_KEY,(error,payload)=>{
         if(error)
         {
             return res.status(401).json({error:"User must me Logged in"});
         }
         const {_id}=payload;
          Users.findById(_id).then((savedUser)=>{
              if(!savedUser){
                  return res.status(401).json("User not found");
              }
              req.user=savedUser;
          }).catch((error)=>{
              console.log(error);
          })
          next()
     })

     
}