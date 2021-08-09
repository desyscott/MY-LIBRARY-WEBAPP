const express = require("express")

//Initialize the express router
const router = express.Router()

//import the authorModel form the model
const authorModel = require("../models/authorsModel")


//Search All the authors 
router.get("/",async(req,res)=>{
   const searchOption = {}

   if(req.query.name !=null && req.query.name !=="" ){
    searchOption.name = new RegExp(req.query.name, "i")
   }

    try{
        const authors = await authorModel.find(searchOption)
        res.render("authors/index",{authors:authors,searchOption:req.query})
    }catch{
        res.redirect("/")
    }   
})


//get the new authors form 
router.get("/new",(req,res)=>{
    res.render("authors/new",{author : new authorModel()})
})

//post the create authors input to model
router.post("/",async(req,res)=>{
   const author =  new authorModel({name:req.body.name})
  try{
    const newAuthor = await  author.save()
    res.redirect("authors")
  }catch{
      res.render("authors/new",{
          author:author,
          errorMessage:"ERROR CREATING NEW AUTHOR"
      })
  } 
})

router.get("/:id",(req,res)=>{
    res.send("Show author" +req.params.id)
})
router.get("/:id/edit",(req,res)=>{
    res.send("Edit author" +req.params.id)
})
router.put("/:id",(req,res)=>{
    res.send("update author" +req.params.id)
})
router.delete("/:id",(req,res)=>{
    res.send("delete author" +req.params.id)
})



module.exports = router;