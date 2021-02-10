const express=require("express");
const router=express.Router();
const mongoose=require("mongoose");
const Users=mongoose.model("Users");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const dotenv=require("dotenv");
const requireLogin=require("../middleware/requireLogin");
dotenv.config();

router.post("/signup",(req,res)=>{
     const {name,email,password}=req.body;
     if(!name||!email||!password)
     {
        return res.status(422).json({error:"Please add All the fields"});
     }
     else{
         Users.findOne({email:email}).then((savedUser)=>{
             if(savedUser)
             {
                 res.status(422).json({error:"User already Exists"});
             }
             else{

                bcrypt.hash(password,12).then(hashedpassword=>{
                    const newUser=new Users({
                        name:name,
                        email:email,
                        password:hashedpassword,
                    })
                    newUser.save().then((user)=>{
                        res.json({message:"User is Succesfully registered"});
                    }).catch((error)=>{
                        console.log(error);
                    })
                }).catch((error)=>{
                    console.log(error);
                })  
             }
         }).catch((error)=>{
             console.log(error);
         })
     }
})

router.post("/signin",(req,res)=>{
    const {email,password}=req.body;
    if(!email||!password)
    {
        return res.status(422).json({error:"Please provide full details"});
    }
    else{
       Users.findOne({email:email}).then((savedUser)=>{
           if(!savedUser)
           {
               return res.status(422).json({error:"invalid email or password"});
           }
           bcrypt.compare(password,savedUser.password).then((match)=>{
               if(match)
               {   
                   
                const token=jwt.sign({_id:savedUser._id},process.env.JWT_SECRET_KEY);
                
                return res.json({token:token});
               }
               else{
                   res.status(422).json({error:"invalid email or password"});
               }
           }).catch(error=>{
               console.log(error);
           })
       }).catch((error)=>{
           res.json({error:error});
       })
    }
})

module.exports=router;