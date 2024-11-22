"use strict";

const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const expenseController = require("../controllers/expenseController");
const incomeController = require("../controllers/incomeController");

//Middleware to check if user is logged in (for accessing certain pages)
const checkLoginStatus = (req, res, next) => {
  if (req.isAuthenticated()) {
      res.locals.user = req.user;
      return next();
  }
  req.flash("error", "You must be logged in to access this page.");
  return res.redirect("/login");
};

module.exports = {
  checkLoginStatus
};

// Home Route
router.get("/", (req, res) => {
  res.render("index", { title: 'Home' });
});

// Error Page Route
router.get("/error", (req, res) => {
  res.render("error", { title: 'Error' });
});

// Help Page Route 
router.get("/help", (req, res) => {
  res.render("help", { title: 'Help' });
});

// Overview Page Route 
router.get("/overview", checkLoginStatus, incomeController.overview, expenseController.overview, (req, res) => {
  res.render("overview", { title: 'Overview' });
});


// Login routes
router.get("/login", userController.login);
router.post("/login", userController.authenticate);

// Logout route
router.get("/logout", userController.logout, userController.redirectView);

// Signup routes
router.get("/signup", userController.signup);
router.post("/signup", userController.validate, userController.create, userController.redirectView);

// Update user information 
router.get("/:id/update", userController.update);

//Add & Edit expense routes
router.get("/expense/new", expenseController.new)
router.post("/expense/new", expenseController.create, expenseController.redirectView);
router.get("/expense/:id/edit", expenseController.edit);
router.put("/expense/:id/update", expenseController.update, expenseController.redirectView);

//Add & Edit income routes
router.get("/income/new", incomeController.new)
router.post("/income/new", incomeController.create, incomeController.redirectView);
router.get("/income/:id/edit", incomeController.edit);
router.put("/income/:id/update", incomeController.update, incomeController.redirectView);

//Add & Edit expense routes
router.get("/expense/new", expenseController.new)
router.post("/expense/new", expenseController.create, expenseController.redirectView);
router.get("/expense/:id/edit", expenseController.edit);
router.put("/expense/:id/update", expenseController.update, expenseController.redirectView);

//Add & Edit income routes
router.get("/income/new", incomeController.new)
router.post("/income/new", incomeController.create, incomeController.redirectView);
router.get("/income/:id/edit", incomeController.edit);
router.put("/income/:id/update", incomeController.update, incomeController.redirectView);

module.exports = router;

//Not needed for Express?
// exports.handle = (req, res) => {
//   try {
//     routes[req.method][req.url](req, res);
//   } catch (e) {
//     res.writeHead(httpStatus.OK, contentTypes.html);
//     utils.getFile("views/error.html", res);
//   }
// };

// exports.get = (url, action) => {
//   routes["GET"][url] = action;
// };

// exports.post = (url, action) => {
//   routes["POST"][url] = action;
// };
