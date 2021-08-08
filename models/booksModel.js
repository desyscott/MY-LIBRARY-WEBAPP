const mongoose = require("mongoose")

const path = require("path")

//import the upload/booksCovers 
const coverImageBasePath = "uploads/booksCovers"
const bookModel = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
    },
    publishDate:{
        type:Date,
        required:true
    },
    pageCount:{
        type:Number,
        required:true
    },
    createAt:{
        type:Date,
        required:true,
        default:Date.now
    },
    coverImageName:{
        type:String,
        required:true
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"Authors"
    }
})

// create a virtual coverImage property and get the path where the coverImage is stored
bookModel.virtual("coverImage").get(function(){
    if(this.coverImageName !=null){
  return path.join("/", coverImageBasePath, this.coverImageName)
    }
})

module.exports = mongoose.model("Book", bookModel)
module.exports.coverImageBasePath = coverImageBasePath