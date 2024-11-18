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
  mongoose = require("mongoose"),
  expressSession = require("express-session"),
  cookieParser = require("cookie-parser"),
  connectFlash = require("connect-flash");

  

//   mongoose.connect(
//     "mongodb://localhost:27017/recipe_db", DATABASE YHTEYS TÄHÄN
//     { useNewUrlParser: true,
//       useUnifiedTopology: true
//      }
//   );

async function connectToAtlas() {
  const uri = 'mongodb+srv://admin:admin@budgetbuddy.m3y54.mongodb.net/'

  try {
      await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
      console.log('Connected to MongoDB Atlas');
  } catch (error) {
      console.error('Error connecting to MongoDB Atlas', error);
  } 
}

connectToAtlas()
  .then(() => {
      app.listen(port, () => {
          console.log(`Server is running on port ${port}`);
      });
  })
  .catch((error) => {
      console.error('Failed to start the server due to MongoDB connection issues:', error);
  });

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


//Flash messaging
app.use(cookieParser("_passcode"));
app.use(expressSession({
  secret: "secret_passcode",
  cookie: {
    maxAge: 4000000
  },
  resave: false,
  saveUninitialized: false
}));
app.use(connectFlash());

app.use(router);

app.listen(app.get("port"), () => {
    console.log(
    `Server running at http://localhost:${app.get("port")}`
    );
    });