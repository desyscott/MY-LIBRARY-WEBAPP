const express = require("express");
const dotenv = require("dotenv");
const expressLayout = require("express-ejs-layouts");
const colors = require("colors");
const path = require ("path");
const morgan = require("morgan");
const methodOverride = require("method-override");

//initialize express app
const app = express();

//import  all index router
const indexRouter = require("./route/index");
//import  all author router
const authorRouter = require("./route/authors");
//import  all book router
const bookRouter = require("./route/books")

//import connectDB 
const connectDB = require("./db");


dotenv.config();
app.set("view engine", "ejs");
app.set("views",__dirname + "/views");
app.use(expressLayout);
app.set("layout",  "layouts/layout.ejs");
app.use(express.static(path.join("public")));
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(morgan("dev"));
app.use(methodOverride("_method"));
connectDB();


app.use("/", indexRouter);
app.use("/authors", authorRouter);
app.use("/books",bookRouter);

// middleware to display 404 on undefined route
app.use((req,res) => {
    res.status(404).render("404");
  })


const PORT = process.env.PORT || 5000;
const HOSTNAME = "localhost"


app.listen(PORT,HOSTNAME,() => {
    console.log(`Express Server running in the ${process.env.NODE_ENV} mode at https://${HOSTNAME}:${PORT} 🚀`.green.bold)
})