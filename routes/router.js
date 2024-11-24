"use strict";

const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const expenseController = require("../controllers/expenseController");
const incomeController = require("../controllers/incomeController");

// Middleware to check if user is logged in (for accessing certain pages)
const checkLoginStatus = (req, res, next) => {
    if (req.isAuthenticated()) {
        res.locals.user = req.user;
        return next();
    }
    req.flash("error", "You must be logged in to access this page.");
    return res.redirect("/login");
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
router.get("/overview", checkLoginStatus, expenseController.overview, incomeController.overview, (req, res) => {
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

// Add expense routes
router.get("/expense/new", checkLoginStatus, expenseController.new);
router.post("/expense/new", checkLoginStatus, expenseController.create, expenseController.redirectView);
router.get("/expense/:id/edit", checkLoginStatus, expenseController.edit);
router.put("/expense/:id/update", checkLoginStatus, expenseController.update, expenseController.redirectView);
router.delete("/expense/:id/delete", checkLoginStatus, expenseController.delete, expenseController.redirectView);

// Add income routes
router.get("/income/new", checkLoginStatus, incomeController.new);
router.post("/income/new", checkLoginStatus, incomeController.create, incomeController.redirectView);
router.get("/income/:id/edit", checkLoginStatus, incomeController.edit);
router.put("/income/:id/update", checkLoginStatus, incomeController.update, incomeController.redirectView);
router.delete("/income/:id/delete", checkLoginStatus, incomeController.delete, incomeController.redirectView);

module.exports = router;