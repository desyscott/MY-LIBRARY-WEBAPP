const express =require("express");

//initialize express app
const router = express.Router()


router.get("/",(req,res)=>{
    res.render("home");   
})

module.exports=router;
