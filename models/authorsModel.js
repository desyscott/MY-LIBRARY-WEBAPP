const mongoose = require("mongoose")


const authorModel = new mongoose.Schema({
   name:{
    type:String,
    required:true
   } 
})

module.exports = mongoose.model("Authors",authorModel )