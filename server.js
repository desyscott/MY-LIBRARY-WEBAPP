// if(process.env.NODE_ENV !== "production"){
//   require("dotenv").parse()
// }

const express = require("express");
const expressLayout = require("express-ejs-layouts");
const colors = require("colors");
const dotenv = require("dotenv");
const morgan = require("morgan");
const methodOverride = require("method-override");
const path = require("path");
//initialize express app
const app = express();

//import  all index router
const indexRouter = require("./route/index");
//import  all author router
const authorRouter = require("./route/authors");
//import  all book router
const bookRouter = require("./route/books");

//import connectDB
const connectDB = require("./db");

dotenv.config();
app.set("view engine", "ejs"); 
app.set("views", __dirname + "/views");
app.set("layout", "layouts/layout.ejs");
app.use(expressLayout);
app.use(methodOverride("_method"));
app.use(express.static("public"));
app.use(express.urlencoded({ limit: "10mb", extended: false }));
app.use(express.json());
app.use(morgan("dev"));
connectDB();

app.use("/", indexRouter);
app.use("/authors", authorRouter);
app.use("/books", bookRouter);

// middleware to display 404 on undefined route
app.use((req, res) => {
  res.status(404).render("404");
});

const Port = process.env.PORT || 3000;
const Hostname = "localhost";

app.listen(Port, Hostname, () => {
  console.log(
  `Express Server running in the ${process.env.NODE_ENV} mode at https://${Hostname}:${Port} 🚀`
      .yellow.bold
  );
});
