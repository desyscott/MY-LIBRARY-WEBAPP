const express = require("express")

//initialize express router
const router = express.Router();

const authorModel = require("../models/authorsModel")

//Search all author router
router.get("/",async (req,res) => {
   let searchOptions = {}
   if(req.query.name != null && req.query.name !=="" ){
    searchOptions.name = new RegExp(req.query.name,"i")
   }

       try{
           const authors = await authorModel.find(searchOptions)
           res.render("authors/index",{authors:authors,searchOptions:req.query })
       }catch{
           res.redirect("/")

       }
})

//get author form router
router.get("/new", (req,res) => {
    res.render(`authors/new`, {author:new authorModel()})
})

//Create new author router
router.post("/", async (req,res) => {
   const author = new authorModel ({name:req.body.name})

   try{
       const newAuthor = await author.save()
       res.redirect("authors")
   }catch{
      res.render("authors/new",{author: author, errorMessage:"Error creating Author"})

   }
})

module.exports=router;