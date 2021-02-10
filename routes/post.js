const express=require("express");
const router=express.Router();
const mongoose=require("mongoose");
const Posts=mongoose.model("Posts");
const requireLogin=require("../middleware/requireLogin");


router.get("/mypost",requireLogin,(req,res)=>{
  Posts.find({postBy:req.user._id}).populate("postBy","_id name").then(myposts=>{
      res.json({post:myposts});
  }).catch(error=>{
      console.log(error);
  })
})

router.get("/showposts",(req,res)=>{
    Posts.find().populate("postBy","_id name").then((allpost)=>{
        res.json({posts:allpost});
    }).catch((error)=>{
        console.log(error);
    })
})
router.post("/create",requireLogin,(req,res)=>{
    const {title,body}=req.body;
    if(!title||!body){
        return res.status(422).json({error:"Please add title and Body"});
    }
    req.user.password=undefined;
    const newpost=new Posts({
        title:title,
        body:body,
        postBy:req.user
    })
    newpost.save().then((savedPost)=>{
        res.json({post:newpost});
    }).catch((error)=>{
        console.log(error);
    })

})

module.exports=router;