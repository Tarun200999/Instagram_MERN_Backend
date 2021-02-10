const express=require("express");
const app=express();
const mongoose=require("mongoose");
const dotenv=require("dotenv");
dotenv.config(); // to use .env variables here
const PORT=5000;


// DATABASE CONNECTION
mongoose.connect(process.env.MONGODB_URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
});
mongoose.connection.on("connected",()=>{
    console.log("database is connected succesfully");
})
mongoose.connection.on("error",(err)=>{
    console.log("error while connecting",err);
})

//DATABASE CONNECTION END 


require("./modals/user"); //User modal is register here
require("./modals/post");//Post modal is registerd here
app.use(express.json());
app.use(require("./routes/auth"));
app.use(require("./routes/post"));

app.listen(PORT,()=>{
    console.log(`Server is runnning  at localhost:${PORT}`);
})