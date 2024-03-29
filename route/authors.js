const express = require("express");
const expressAsyncHandler = require("express-async-handler");

//Initialize the express router
const router = express.Router();

//import the authorModel form the model
const authorModel = require("../models/authorsModel");
const bookModel = require("../models/booksModel");

//Search All the authors
router.get("/",expressAsyncHandler(async (req, res) => {
  const searchOption = {};

  if (req.query.name != null && req.query.name !== "") {
    //using regular expression to search part of the text in our field which use case sensitive format
    //We add the text we type in the filed to our search searchOption to find it
    searchOption.name = new RegExp(req.query.name, "i");
  }
  try {
    const authors = await authorModel.find(searchOption);
    res.render("authors/index", {
      authors,
      //sending the query back to user so that it will repopulate the field value after clicking the search
      searchParams: req.query,
    });
  } catch {
    res.redirect("/");
  }
}));


//get the new authors form
router.get("/new", (req, res) => {
  res.render("authors/new", { author: new authorModel() });
});

//post the create authors input to model
router.post("/",expressAsyncHandler(async (req, res) => {
  const author = new authorModel({ name: req.body.name });
  try {
    const newAuthor = await author.save();
    res.redirect(`authors/${newAuthor.id}`);
  } catch {
    res.render("authors/new", {
      author,
      errorMessage: "Error Creating  New author",
    });
  }
}));

//Show all authors base on their id
router.get("/:id",expressAsyncHandler(async (req, res) => {
  try {
    const author = await authorModel.findById(req.params.id);
    //find the author book 
    const books = await bookModel.find({ author: author.id }).limit(6).exec();
    res.render("authors/show", { author, booksByAuthor: books });
  } catch (err) {
    console.log(err);
    res.render("/");
  }
}));

//get the new edit form `
router.get("/:id/edit", expressAsyncHandler(async (req, res) => {
  try {
    const author = await authorModel.findById(req.params.id);
    res.render("authors/edit", { author });
  } catch {
    res.redirect("/authors");
  }
}));


//update the edit authors
router.put("/:id",expressAsyncHandler(async (req, res) => {
  let author;
  try {
    //we find the author by the id we get from the request,we change the author's name and save
    author = await authorModel.findById(req.params.id);
    author.name = req.body.name;
    await author.save();
    //redirect to the first route id
    res.redirect(`/authors/${author.id}`);
  } catch {
    if (author == null) {
      res.redirect("/");
    } else {
      res.render("author/edit", {
        author,
        errorMessage: "Error in Updating authors",
      });
    }
  }
}));


router.delete("/:id",expressAsyncHandler(async (req, res) => {
  let author;
  try {
    //we find the specific author by their id by requesting it from the params
    author = await authorModel.findById(req.params.id);
    await author.remove();
    res.redirect(`/authors`);
  } catch(err){
    if (author == null) {
      res.redirect("/");
    } 
    else {
      res.redirect(`/authors/${author.id}`)
    }
    const  errorMessage=err.message;
    console.log(errorMessage)
    
  }
}));

module.exports = router;
