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
  connectFlash = require("connect-flash"),
  { body, validationResult } = require("express-validator"),
  passport = require("passport");

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

app.set("port", process.env.PORT || 3000);
app.set("view engine", "ejs");

app.get("/", (req, res) => {
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

// Flash messaging
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

app.use(router);

app.listen(app.get("port"), () => {
    console.log(
    `Server running at http://localhost:${app.get("port")}`
    );
});