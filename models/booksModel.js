const mongoose = require("mongoose");

const path = require("path");

//import the upload/booksCovers
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

//when coverImagePath is called to get the src of image  the mongoose virtual will create a property that act like  the schema property that
//to get the actual image in the public path
bookModel.virtual("coverImagePath").get(function () {
  if (this.coverImageName != null) {
    return path.join("/", coverImageBasePath, this.coverImageName);
  }
});

module.exports = mongoose.model("Book", bookModel);
module.exports.coverImageBasePath = coverImageBasePath;
