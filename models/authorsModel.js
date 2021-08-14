const mongoose = require("mongoose")

const bookModel = require("../models/booksModel")


const authorModel = new mongoose.Schema({
   name:{
    type:String,
    required:true
   } 
})



authorModel.pre("remove",function(next){
   bookModel.find({author:this.id},(err,books)=>{
    if(err){
          next(err)
        }else if(books.length>0){
           next(new Error("This author has books still"))
        }else{
           next()
        }
   })
     
})

module.exports = mongoose.model("Authors",authorModel )