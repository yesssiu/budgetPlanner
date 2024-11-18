"use strict";

// Constant URI for the DB connection
const DB_URI = 'mongodb+srv://admin:admin@budgetbuddy.m3y54.mongodb.net/';

const express = require("express"),
  app = express(),
  layouts = require("express-ejs-layouts"),
  mongoose = require("mongoose"),
  expressSession = require("express-session"),
  cookieParser = require("cookie-parser"),
  connectFlash = require("connect-flash"),
  { body, validationResult } = require("express-validator"),
  passport = require("passport"),
  router = require("./router");

app.set("port", process.env.PORT || 3000);
app.set("view engine", "ejs");

app.get("/", (_, res) => res.render("index"));

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

async function runServer() {
  try {
      await mongoose.connect(DB_URI);
      const db = mongoose.connection;
      db.once("open", () => console.log("Successfully connected to MongoDB using Mongoose!"));
      const port = app.get("port");
      app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
    
  } finally {
    console.log("Done.");
  }
}

// Start the server
runServer().catch(console.dir);