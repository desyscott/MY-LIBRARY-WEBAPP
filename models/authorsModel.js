const mongoose = require("mongoose");

const bookModel = require("../models/booksModel");

const authorModel = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

//Before the author is deleted the callback fxn  fires to  check the bookModel
// if it has  this author id is in it collection .If it has this author id  then it has book
  authorModel.pre("remove", function (next) {
    bookModel.find({ author: this.id }, (err, books) => {
      if (err) {
        next(err);
      } else if (books.length > 0) {
        next(new Error("This author has books still"));
      } else {
        next();
      }
    });
  });

module.exports = mongoose.model("Authors", authorModel);
