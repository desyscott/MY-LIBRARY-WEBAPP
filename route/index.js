const express = require("express");

//initialize express router
const router = express.Router()


const bookModel =require("../models/booksModel")
//get the book image from bookModel and display it on the home page
router.get("/",async(req,res)=>{
  try{
    let books = await bookModel.find().sort({createdAt :"desc"}).limit(10).exec()
    res.render("Home",{books}); 
  }catch{
      books = []
  }
   
})

module.exports = router;