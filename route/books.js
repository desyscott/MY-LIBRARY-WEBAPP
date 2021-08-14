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
   }
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
  renderNewPage(res,new bookModel())
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
     description:req.body.description  })

  try{
     const newBook = await book.save()
     res.redirect(`Books/${newBook.id}`);
     }catch{
    if(book.coverImageName != null){
      removeBookCover(book.coverImageName )
    }
    renderFormPage(res,book,true)
    
  }
})


//Show individual book
router.get("/:id",async(req,res)=>{
  try{
 const book = await bookModel.findById(req.params.id).populate("author").exec()
 res.render("Books/show", {book})
  }catch{
 res.redirect("/")
  }
})

//get the Edit book form
router.get("/:id/edit",async(req,res)=>{
  try{ 
    const book = await bookModel.findById(req.params.id)
    renderEditPage(res,book)
  }catch{
      res.redirect("/")
  } 
})

//PUT route to update the book model
router.put("/:id",upload.single("cover"),async(req,res)=>{
  const fileName = req.file !=null? req.file.filename : null
  let book
 try{
    book = await bookModel.findById(req.params.id)
    book.title = req.body.title
    book.author = req.body.author
    book.publishDate = new Date (req.body.publishDate)
    book.pageCount = req.body.pageCount
    book.description = req.body.description 
    book.coverImageName = fileName 
   
    await book.save()
    res.redirect(`/Books/${book.id}`)
    }catch(err){
      if(book == null ){
        res.redirect("/")
      }else{
        renderEditPage(res,book,true)
      }
      console.log(err)
 }
})

//delete route 
router.delete("/:id",async(req,res)=>{
  let book
  try{
     book = await bookModel.findById(req.params.id)
     await book.remove()
     res.redirect("/Books")
  }catch{
    if(book==null){
       res.redirect("/")
    }else{
      res.render("Books/show",{book,errorMessage:"Could not delete book"})
    }
  }
})



//function for the new route
const renderNewPage = async(res,book,form,hasError = false)=>{
  renderFormPage (res,book,"new",hasError )
}
//function for the edit route
const renderEditPage= async(res,book,form,hasError = false)=>{
  renderFormPage (res,book,"edit",hasError)
}

const renderFormPage = async(res,book,form,hasError = false)=>{
  try{
    const authors = await authorModel.find({}) 
    const params = {authors, book}
   if(hasError){
     if(form="new"){
      params.errorMessage = "Error in Creating Books"
     }else if(form="edit") {
      params.errorMessage = "Error in Updating Books"
     }
   } 
    res.render(`Books/${form}`, params )
  }catch{
    res.redirect("/Books")
  }
}



//function to remove BookCover in the server when an Error occur 
const removeBookCover = (fileName) => {
  fs.unlink(path.join(uploadPath, fileName), function(err){
    if(err){
      console.error(err)
    }
  })
 }




module.exports = router



