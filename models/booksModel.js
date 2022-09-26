const mongoose = require("mongoose");

const path = require("path");

//importing the upload/booksCovers
const coverImageBasePath = "uploads/booksCovers";

const bookModel = new mongoose.Schema({
  title: {
    type: String,
    required:[true,"This field is required"],
  },
  description: {
    type: String,
  },
  publishDate: {
    type: Date,
    required: [true,"This field is required"],
  },
  pageCount: {
    type: Number,
    required: [true,"This field is required"],
  },
  createAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  
  //we storing the name of the image in the database and storing the image itself in a file system
  coverImageName: {
    type: String,
    required: [true,"This field is required"],
  },
  //referencing the author Model the same author id in the book model
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required:true,
    ref: "Authors",
  },
});


//the virtual property will act as the any of the property in the model and it will derive it properties from the coverImageName property
//when coverImagePath is called, it is going to call the get function

bookModel.virtual("coverImagePath").get(function () {
  if (this.coverImageName != null) {
    return path.join("/", coverImageBasePath, this.coverImageName);
  }
});

module.exports = mongoose.model("Book", bookModel);

//exporting the upload/booksCovers
module.exports.coverImageBasePath = coverImageBasePath;
