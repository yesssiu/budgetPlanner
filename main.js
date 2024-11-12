"use strict";

const port = 3000,
http = require("http"),
httpStatus = require("http-status-codes"),
router = require("./router"),
contentTypes = require("./contentTypes"),
utils = require("./utils");

const express = require("express"),
  app = express(),
  layouts = require("express-ejs-layouts"),
  mongoose = require("mongoose")

//   mongoose.connect(
//     "mongodb://localhost:27017/recipe_db", DATABASE YHTEYS TÄHÄN
//     { useNewUrlParser: true,
//       useUnifiedTopology: true
//      }
//   );

// mongodb+srv://admin:admin@budgetbuddy.m3y54.mongodb.net/

app.set("port", process.env.PORT || 3000);
app.set("view engine", "ejs");

router.get("/", (req, res) => {
  res.render("index");
});

app.use(express.static("public"));
app.use(layouts);
app.use(
  express.urlencoded({
    extended: false
  })
);
app.use(express.json());

app.listen(app.get("port"), () => {
    console.log(
    `Server running at http://localhost:${app.get("port")}`
    );
    });