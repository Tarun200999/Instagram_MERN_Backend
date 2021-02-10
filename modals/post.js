const mongoose=require("mongoose");
const {ObjectId}=mongoose.Schema.Types;
const newPostSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    body:{
        type:String,
        required:true,
    },
    photo:{
        type:String,
        default:"no photo",
    },
    postBy:{
        type:ObjectId,
        ref:"Users",
    }
})

mongoose.model("Posts",newPostSchema);