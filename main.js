"use strict";

const express = require("express"),
  methodOverride = require("method-override"),
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

// Middleware setup
app.use(express.static(path.join(__dirname, "public")));
app.use(layouts);
app.use(
  express.urlencoded({
    extended: false
  })
);
app.use(methodOverride("_method"));
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
app.use((req, res, next) => {
  res.locals.loggedIn = !!req.user; 
  next();
});

const User = require("./models/user");
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware to set current logged in status and current user + first name for chat function
app.use((req, res, next) => {
  res.locals.loggedIn = req.isAuthenticated();
  res.locals.currentUser = req.user ? { _id: req.user._id, firstName: req.user.name.first } : null;
  next();
});

app.use('/', router);

const port = process.env.PORT || 4000;
app.set("port", port);

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
      const server = app.listen(app.get("port"), () => {
          console.log(`Server running at http://localhost:${app.get("port")}`);
      });
      const io = require("socket.io")(server);
      const chatController = require("./controllers/chatController")(io);
  })
  .catch((error) => {
      console.error('Failed to start the server due to MongoDB connection issues:', error);
  });