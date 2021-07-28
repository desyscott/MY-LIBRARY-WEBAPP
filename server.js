const express = require("express");
const dotenv = require("dotenv");
const expressLayout = require("express-ejs-layouts");
const colors = require("colors");
const morgan = require("morgan");

//initialize express app
const app = express();


const indexRouter = require("./route/index");
const authorRouter = require("./route/authors");

const connectDB = require("./db");


dotenv.config();
app.set("view engine", "ejs");
app.set("views",__dirname + "/views");
app.use(expressLayout);
app.set("layout",  "layouts/layout.ejs");
app.use(express.static("public"));
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(morgan("dev"));
connectDB();



app.use("/", indexRouter);
app.use("/authors", authorRouter);


app.use((req,res) => {
    res.status(404).render("404");
  })






const PORT = process.env.PORT || 3000;
const HOSTNAME = "localhost"




app.listen(PORT,HOSTNAME,() => {
    console.log(`Express Server running in the ${process.env.NODE_ENV} mode at https://${HOSTNAME}:${PORT} `.green.bold)
})