"use strict";

const express = require("express"),
  app = express(),
  layouts = require("express-ejs-layouts"),
  mongoose = require("mongoose"),
  expressSession = require("express-session"),
  cookieParser = require("cookie-parser"),
  connectFlash = require("connect-flash"),
  { body, validationResult } = require("express-validator"),
  passport = require("passport"),
  path = require("path"),
  router = require("./routes/router");


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.set("layout", "layout");

// Middleware setup
app.use(express.static(path.join(__dirname, "public")));
app.use(layouts);
app.use(
  express.urlencoded({
    extended: false
  })
);
app.use(express.json());

// Cookies & Flash messaging
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
app.use((req, res, next) => {
  res.locals.flashMessages = req.flash();
  next();
}); 

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

const User = require("./models/user");
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware to set current logged in status and current user
app.use((req, res, next) => {
  res.locals.loggedIn = req.isAuthenticated();
  res.locals.currentUser = req.user;
  next();
});

app.use('/', router);

const port = process.env.PORT || 4000;

// DB Connection & dotenv configuration
require('dotenv').config();

async function connectToAtlas() {
  const uri = process.env.MONGO_URI;

  try {
      await mongoose.connect(uri);
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
