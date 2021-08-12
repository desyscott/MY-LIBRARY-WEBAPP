const express = require("express")

//initialize the express router
const router = express.Router()


const multer = require("multer")
const path = require("path")
const fs = require("fs")

//import the booksModel form the model
const bookModel = require("../models/booksModel")
//import the authorsModel form the model
const authorModel = require("../models/authorsModel")

//import the bookCover folder from the bookModel and join it to the public folder
const uploadPath = path.join("public", bookModel.coverImageBasePath)

const imageMimeTypes = ["image/jpg","image/jpeg", "image/png","image/gif"]
const upload = multer({
   dest:uploadPath,
   fileFilter: (req,file,callback)=>{
    callback(null, imageMimeTypes.includes(file.mimetype))
   },
})

//Search the book title
router.get("/",async(req,res)=>{
    let searchOption = bookModel.find({})

    if(req.query.title!= null  && req.query.title!= ""){
      searchOption = searchOption.regex("title" ,new RegExp(req.query.title,"i"))
    }
  
    if(req.query.publishBefore!= null  && req.query.publishBefore!= ""){
      searchOption = searchOption.lte("publishDate" ,req.query.publishBefore)
    }

    if(req.query.publishAfter!= null  && req.query.publishAfter!= ""){
      searchOption = searchOption.gte("publishDate" ,req.query.publishAfter)
    }
  
  try{
    const books = await searchOption.exec()
    res.render("Books/index", {books, searchOption:req.query} )
  }catch{
      res.redirect("/")
  }
})

//get the form book input
router.get("/new",(req, res)=>{
  renderNewFormPage(res,new bookModel())
})

//post all requested input to model
router.post("/", upload.single("cover"),async(req,res)=>{
    const fileName = req.file !=null? req.file.filename : null
      const book = new bookModel({
     title:req.body.title,
     author:req.body.author,
     publishDate:new Date (req.body.publishDate),
     pageCount:req.body.pageCount,
     coverImageName: fileName,
     description:req.body.description
  
 })
  try{
     const newBook = await book.save()
     res.redirect("Books");
     console.log(req.file);
  }catch{
    if(book.coverImageName != null){
      removeBookCover(book.coverImageName )
    }
    renderNewFormPage(res,book,true)
  }
})

//function to remove BookCover when an Error occur 
const removeBookCover = (fileName) => {
   fs.unlink(path.join(uploadPath, fileName), function(err){
     if(err){
       console.error(err)
       console.log("deleted")
     }
   })
  }

 const renderNewFormPage = async(res,book,hasError = false)=>{
  try{
    const authors = await authorModel.find({}) 
    const params = { authors, book }
   if(hasError) params.errorMessage = "Error in Creating Books"
    res.render("Books/new", params )
  }catch{
    res.redirect("/Books")
  }
}

module.exports = router
